FROM rust:1-slim AS build
WORKDIR /src

# Cache dependencies: copy manifests, build a stub, then the real sources.
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo 'fn main() {}' > src/main.rs \
    && cargo build --release \
    && rm -rf src
COPY src ./src
RUN touch src/main.rs && cargo build --release

# Stage 2 — minimal runtime with just the binary and the web assets.
FROM debian:bookworm-slim AS runtime
WORKDIR /app
RUN useradd -r -u 10001 app \
    && apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# The compiled Rust server.
COPY --from=build /src/target/release/about-me /usr/local/bin/about-me

# Static web assets the server hands out (index.html is rendered by Rust).
COPY index.html ./index.html
COPY css/    ./css/
COPY js/     ./js/
COPY vendor/ ./vendor/
COPY assets/ ./assets/

ENV SITE_ROOT=/app
ENV PORT=8080
EXPOSE 8080
USER app

HEALTHCHECK --interval=30s --timeout=3s --start-period=3s \
  CMD curl -fsS http://localhost:8080/api/health || exit 1

CMD ["/usr/local/bin/about-me"]
