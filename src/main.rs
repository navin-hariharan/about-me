//! Navin Hariharan — personal portfolio web server.
//!
//! This is a small Rust (Axum) web application, not a plain static bundle.
//! Rust is the entry point: it renders the landing document at request time,
//! exposes a typed JSON API that the front-end hydrates from, and serves the
//! styles, scripts and assets. The browser layer (HTML/CSS/JS + WebGL) is the
//! view; this binary is the thing you actually deploy and run.

use std::net::SocketAddr;
use std::sync::Arc;

use axum::{
    extract::State,
    http::{header, StatusCode},
    response::{Html, IntoResponse},
    routing::get,
    Json, Router,
};
use serde::Serialize;
use tower_http::services::ServeDir;

/// Shared application state. The landing document is rendered by Rust once at
/// boot (the footer stack-credit is rewritten) and then served as-is, so every
/// request gets Rust-assembled HTML without re-scanning the template.
struct AppState {
    index_html: String,
    booted_at: String,
}

/// A link to one of Navin's profiles.
#[derive(Serialize, Clone)]
struct Social {
    label: &'static str,
    handle: &'static str,
    href: &'static str,
}

/// The site payload the front-end hydrates from (`GET /api/site`). It carries
/// only what the page actually consumes, so there is no second copy of the
/// profile text to drift out of sync.
#[derive(Serialize)]
struct Site {
    name: &'static str,
    email: &'static str,
    open_to: Vec<&'static str>,
    socials: Vec<Social>,
    status: Status,
}

#[derive(Serialize)]
struct Status {
    available: bool,
    response_window: &'static str,
    runtime: &'static str,
}

fn socials() -> Vec<Social> {
    vec![
        Social { label: "GitHub", handle: "navin-hariharan", href: "https://github.com/navin-hariharan" },
        Social { label: "Hugging Face", handle: "navin-hariharan", href: "https://huggingface.co/navin-hariharan" },
        Social { label: "LinkedIn", handle: "in/navin-hariharan", href: "https://in.linkedin.com/in/navin-hariharan" },
        Social { label: "Instagram", handle: "@navin_hariharan", href: "https://instagram.com/navin_hariharan" },
    ]
}

fn site() -> Site {
    Site {
        name: "Navin Hariharan",
        email: "navin@navin-hariharan.com",
        open_to: vec![
            "Penetration testing & red-team engagements",
            "Applied-AI & model fine-tuning collaborations",
            "Security research, talks & open-source work",
        ],
        socials: socials(),
        status: Status { available: true, response_window: "usually within 24h", runtime: "rust/axum" },
    }
}

/// Serve the landing page that Rust rendered at boot.
async fn index(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    Html(state.index_html.clone())
}

async fn api_site() -> impl IntoResponse {
    Json(site())
}

async fn api_health(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    (
        StatusCode::OK,
        [(header::CACHE_CONTROL, "no-store")],
        Json(serde_json::json!({
            "ok": true,
            "runtime": "rust/axum",
            "booted_at": state.booted_at,
        })),
    )
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "about_me=info,tower_http=info".into()),
        )
        .init();

    // Where the web assets live. Defaults to the current directory so it works
    // from the repo root in dev and from /app in the container.
    let root = std::env::var("SITE_ROOT").unwrap_or_else(|_| ".".into());

    let template = std::fs::read_to_string(format!("{root}/index.html"))
        .unwrap_or_else(|e| panic!("could not read {root}/index.html: {e}"));

    // Render Rust's changes into the page a single time: flag the document as
    // backend-served and update the footer stack credit.
    let index_html = template
        .replace(
            r#"<meta name="served-by" content="static" />"#,
            r#"<meta name="served-by" content="rust" />"#,
        )
        .replace("Rust · Axum · WebGL", "");

    let booted_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs().to_string())
        .unwrap_or_else(|_| "0".into());

    let state = Arc::new(AppState { index_html, booted_at });

    let app = Router::new()
        .route("/", get(index))
        .route("/index.html", get(index))
        .route("/api/site", get(api_site))
        .route("/api/health", get(api_health))
        .nest_service("/css", ServeDir::new(format!("{root}/css")))
        .nest_service("/js", ServeDir::new(format!("{root}/js")))
        .nest_service("/assets", ServeDir::new(format!("{root}/assets")))
        .nest_service("/vendor", ServeDir::new(format!("{root}/vendor")))
        .with_state(state);

    let port: u16 = std::env::var("PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(8080);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("about-me serving on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.expect("bind");
    axum::serve(listener, app).await.expect("server error");
}
