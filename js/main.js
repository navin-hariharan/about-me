/**
 * main.js — orchestrates the page.
 *
 * Responsibilities, in order:
 *   1. read prefers-reduced-motion once and branch on it
 *   2. run the boot sequence, then reveal the page
 *   3. start ambient effects (rain, custom cursor, clock)
 *   4. render all content from data.js into the DOM
 *   5. wire interactions: typer, scramble, counters, terminal, globe,
 *      filters, flip cards, 3D tilt, magnetic buttons, contact cipher
 *   6. scroll spy, progress bar, reveals, section route wipes
 *
 * Everything degrades: if Three.js fails to load, a CSS globe shows instead;
 * if JS is off, the noscript line gives an email address.
 */
import { startRain } from './rain.js';
import {
  profile, socials, stats, projects, archive, capabilities, hexSkills,
  experience, certificates, terminalScript,
} from './data.js';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const rand = (arr) => arr[(Math.random() * arr.length) | 0];
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01ABCDEF';

// Escape text before it goes into innerHTML. Our content is first-party,
// but data that arrives over /api/site is still escaped so a value can
// never break out into markup.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// One source of truth for a social link's markup (used by the static
// render and the Rust hydration).
const socialLi = (s) => `
    <li><a class="glass neon" href="${esc(s.href)}" target="_blank" rel="noopener">
      <span class="s-label">${esc(s.label)}</span><span class="s-handle">${esc(s.handle)}</span><span class="s-arrow">↗</span>
    </a></li>`;

/* ------------------------------------------------------------------ *
 * 1. Boot sequence
 * ------------------------------------------------------------------ */
const BOOT_LINES = [
  'navin-hariharan.com // SYSTEM BIOS v2.6 — POST OK',
  'mounting /dev/navin … <c>ok</c>',
  'loading kernel modules [ offsec ] [ ai ] [ infra ] … <c>ok</c>',
  'establishing TLS 1.3 handshake … <c>secure</c>',
  'decrypting profile.gpg … <m>████████████</m> 100%',
  'importing public keys: CEH · Security+ … <c>ok</c>',
  'spinning up threat map … <c>online</c>',
  'granting session access …',
];

function runBoot() {
  const boot = $('#boot');
  const log = $('#boot-log');
  const bar = $('#boot-bar');
  const finish = () => {
    if (boot.classList.contains('is-done')) return;
    boot.classList.add('is-done');
    document.body.classList.remove('is-booting');
    startPage();
    setTimeout(() => boot.remove(), 700);
  };

  if (REDUCED) {
    log.innerHTML = BOOT_LINES.join('\n').replace(/<\/?[cm]>/g, '');
    bar.style.width = '100%';
    setTimeout(finish, 250);
    return;
  }

  window.addEventListener('keydown', finish, { once: true });
  boot.addEventListener('click', finish, { once: true });

  let i = 0;
  const total = BOOT_LINES.length;
  const next = () => {
    if (i >= total) {
      log.innerHTML += '\n<span class="grant">ACCESS GRANTED</span>';
      bar.style.width = '100%';
      setTimeout(finish, 650);
      return;
    }
    log.innerHTML += (i ? '\n' : '') + BOOT_LINES[i];
    bar.style.width = `${((i + 1) / total) * 100}%`;
    i++;
    setTimeout(next, 230 + Math.random() * 170);
  };
  next();
}

/* ------------------------------------------------------------------ *
 * 2. Page bring-up (after boot)
 * ------------------------------------------------------------------ */
function startPage() {
  renderContent();
  startCursor();
  startRain($('#rain'), { reduced: REDUCED });
  startTyper();
  setupScramble();
  setupReveals();
  setupCounters();
  setupTerminal();
  setupFilters();
  setupCards3D();
  setupFlips();
  setupMagnetic();
  setupHexField();
  setupContact();
  hydrateFromRust();
  setupScrollSpy();
  setupRouteWipes();
  setupMobileNav();
  loadGlobe();
  setupPortrait();
  $('#year').textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------------ *
 * 3. Ambient: custom cursor
 * ------------------------------------------------------------------ */
function startCursor() {
  // Skip on touch / coarse pointers and under reduced motion.
  if (REDUCED || !matchMedia('(pointer: fine)').matches) return;
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  document.body.classList.add('has-cursor');
  let rx = 0;
  let ry = 0;
  let mx = 0;
  let my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });
  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  // Enlarge the ring over interactive elements.
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button, input, textarea, .pcard, .flip, .hex-grid li')) ring.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('a, button, input, textarea, .pcard, .flip, .hex-grid li')) ring.classList.remove('is-hover');
  });
}

/* ------------------------------------------------------------------ *
 * 4. Render content from data.js
 * ------------------------------------------------------------------ */
function renderContent() {
  // Counters
  $('#counters').innerHTML = stats.map((s) => `
    <div class="counter glass neon" data-to="${s.value}" data-suffix="${s.suffix}">
      <b>0${s.suffix}</b><span>${s.label}</span><div class="bar"><i></i></div>
    </div>`).join('');

  // Project filters
  const cats = ['All', ...new Set(projects.map((p) => p.category))];
  $('#filters').innerHTML = cats.map((c, i) => {
    const n = c === 'All' ? projects.length : projects.filter((p) => p.category === c).length;
    return `<button type="button" data-filter="${c}" aria-pressed="${i === 0}">${c}<span class="n">${String(n).padStart(2, '0')}</span></button>`;
  }).join('');

  // Project cards
  $('#project-grid').innerHTML = projects.map((p, i) => `
    <article class="pcard glass neon" data-cat="${p.category}" tabindex="0" aria-expanded="false">
      <div class="pcard-top">
        <span class="classif">${p.classification}</span>
        <span class="fileno mono">FILE_${String(i + 1).padStart(3, '0')}</span>
      </div>
      <h3><span class="scramble" data-scramble data-hover>${p.title}</span></h3>
      <p>${p.summary}</p>
      <ul class="tags">${p.stack.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="pcard-detail"><div>
        <p>${p.detail}</p>
        <div class="pcard-links">${p.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('')}</div>
      </div></div>
      <div class="pcard-foot">
        <span>${p.year}${p.metric ? ` · <span class="metric">${p.metric}</span>` : ''}</span>
        <button type="button" class="open-file" aria-label="Toggle details for ${p.title}">decrypt</button>
      </div>
    </article>`).join('');

  // Archive rows
  $('#archive').innerHTML = archive.map((a) => `
    <li><a href="${a.href}" target="_blank" rel="noopener">
      <span class="a-name">${a.name}</span><span class="a-note">${a.note}</span>
      <span class="a-lang">${a.lang}</span><span class="a-stars">${a.stars ? '★ ' + a.stars : ''}</span>
    </a></li>`).join('');

  // Capability flip cards
  $('#cap-grid').innerHTML = capabilities.map((c) => `
    <div class="flip" data-c="${c.color}" style="--lvl:${c.level}%">
      <div class="flip-inner">
        <button class="flip-face flip-front glass neon" type="button" aria-label="${c.title}, tap to see tools">
          <span class="flip-hint mono">tap ⇆</span>
          <span class="cap-code">${c.code}</span>
          <h3>${c.title}</h3><p>${c.body}</p>
          <div class="meter"><span>${c.level}%</span><div class="meter-track"><i></i></div></div>
        </button>
        <div class="flip-face flip-back glass neon">
          <h3>~/${c.code.toLowerCase()}/tools</h3>
          <ul>${c.tools.map((t) => `<li>${t}</li>`).join('')}</ul>
          <button class="flip-hint mono" type="button" style="position:absolute;bottom:24px;left:24px" aria-label="Flip back">← back</button>
        </div>
      </div>
    </div>`).join('');

  // Hex skills
  $('#hex-grid').innerHTML = hexSkills.map(([name, g]) => `<li class="${g}">${name}</li>`).join('');

  // Timeline
  $('#timeline').innerHTML = experience.map((e) => `
    <li class="entry glass reveal${e.logo ? '' : ' entry--nologo'}">
      <div class="entry-when">${e.when}<span class="entry-level">${e.level}</span></div>
      <div class="entry-main">
        ${e.logo ? `<img class="entry-logo" src="${e.logo}" alt="${e.org} logo" loading="lazy" width="52" height="52" />` : ''}
        <div class="entry-text"><h3>${e.title}<small>${e.org}</small></h3><p>${e.body}</p></div>
      </div>
    </li>`).join('');

  // Certificates
  $('#certs').innerHTML = certificates.map((c) => `
    <a class="cert glass neon reveal" href="${c.image}" target="_blank" rel="noopener">
      <img src="${c.image}" alt="${c.title} certificate" loading="lazy" />
      <div>
        <span class="cert-short">${c.short}</span>
        <h4>${c.title}</h4>
        <p>${c.issuer} · ${c.date}</p>
        <span class="verify">view credential ↗</span>
      </div>
    </a>`).join('');

  // Contact links
  const mail = `mailto:${profile.email}`;
  $('#email-link').textContent = profile.email;
  $('#email-link').href = mail;
  $('#socials').innerHTML = socials.map(socialLi).join('');
}

/* ------------------------------------------------------------------ *
 * 5a. Hero typer + glitch burst
 * ------------------------------------------------------------------ */
function startTyper() {
  const el = $('#typer');
  const roles = profile.roles;
  if (REDUCED) { el.textContent = roles[0]; return; }
  let r = 0;
  let i = 0;
  let deleting = false;
  const tick = () => {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 70 + Math.random() * 60); }
    else if (!deleting) { deleting = true; setTimeout(tick, 1400); }
    else if (i > 0) { i--; setTimeout(tick, 34); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 320); }
  };
  tick();

  // Occasional glitch flare on the name.
  const g = $('.glitch');
  setInterval(() => { g.classList.add('is-hot'); setTimeout(() => g.classList.remove('is-hot'), 500); }, 7000);
}

/* ------------------------------------------------------------------ *
 * 5b. Scramble / decrypt-on-hover text
 * ------------------------------------------------------------------ */
function scrambleTo(el, finalText, speed = 1) {
  if (REDUCED) { el.textContent = finalText; return; }
  let frame = 0;
  const queue = [...finalText].map((ch, i) => ({ ch, start: Math.floor(i * 1.3), end: Math.floor(i * 1.3) + 8 + Math.random() * 8 }));
  cancelAnimationFrame(el._raf);
  const run = () => {
    let out = '';
    let done = 0;
    for (const item of queue) {
      if (frame >= item.end) { out += item.ch; done++; }
      else if (frame >= item.start) out += `<span style="color:var(--magenta)">${rand(SCRAMBLE_CHARS)}</span>`;
      else out += '';
    }
    el.innerHTML = out;
    frame += speed;
    if (done < queue.length) el._raf = requestAnimationFrame(run);
    else el.textContent = finalText;
  };
  run();
}

function setupScramble() {
  // Section headings scramble when they first enter the viewport.
  const once = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      scrambleTo(e.target, e.target.dataset.final || e.target.textContent);
      once.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('[data-scramble]').forEach((el) => {
    el.dataset.final = el.textContent;
    if (el.hasAttribute('data-hover')) {
      // Project titles: re-scramble on card hover/focus.
      const card = el.closest('.pcard');
      if (card) {
        card.addEventListener('pointerenter', () => scrambleTo(el, el.dataset.final, 1.6));
        card.addEventListener('focus', () => scrambleTo(el, el.dataset.final, 1.6), true);
      }
    } else {
      once.observe(el);
    }
  });
}

/* ------------------------------------------------------------------ *
 * 5c. Reveal on scroll
 * ------------------------------------------------------------------ */
function setupReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .section-head, .counter, .flip').forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

/* ------------------------------------------------------------------ *
 * 5d. Animated counters
 * ------------------------------------------------------------------ */
function setupCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('is-visible');
      const to = +el.dataset.to;
      const suffix = el.dataset.suffix || '';
      const out = $('b', el);
      if (REDUCED) { out.textContent = to + suffix; io.unobserve(el); return; }
      const dur = 1500;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        out.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('.counter').forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ *
 * 5e. Terminal: auto-loop demo + interactive mode
 * ------------------------------------------------------------------ */
function setupTerminal() {
  const body = $('#term-body');
  const form = $('#term-form');
  const input = $('#term-cmd');
  const modeTag = $('#term-mode');
  const sr = $('#term-sr');
  let auto = true;
  let typing = null;

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  // Output lines may use a small, fixed set of formatting tags. We escape the
  // text first, then re-enable only these known tags — never arbitrary HTML.
  const TAGS = { ok: ['<span class="ok">', '</span>'], c: ['<span class="c">', '</span>'], dim: ['<span class="dim">', '</span>'], err: ['<span class="err">', '</span>'], m: ['<span class="m">', '</span>'] };
  const markup = (s) => esc(s).replace(/&lt;(\/?)(ok|c|dim|err|m)&gt;/g, (_, close, tag) => TAGS[tag][close ? 1 : 0]);

  function print(html, cls = 'line') {
    const div = document.createElement('div');
    div.className = cls;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    // Trim history so the node count stays bounded.
    while (body.children.length > 120) body.removeChild(body.firstChild);
    return div;
  }

  function typeLine(text, cls, done) {
    if (REDUCED) { print(text, cls); done && done(); return; }
    const div = print('', cls);
    let i = 0;
    const tick = () => {
      div.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) typing = setTimeout(tick, 16 + Math.random() * 26);
      else done && done();
    };
    tick();
  }

  // --- auto demo loop ---
  let step = 0;
  function autoNext() {
    if (!auto) return;
    const entry = terminalScript[step % terminalScript.length];
    step++;
    typeLine(`navin@navin-hariharan:~$ ${entry.cmd}`, 'line cmd', () => {
      let k = 0;
      const emit = () => {
        if (!auto) return;
        if (k < entry.out.length) {
          print(markup(entry.out[k]));
          k++;
          setTimeout(emit, 220 + Math.random() * 160);
        } else {
          setTimeout(autoNext, 1600);
        }
      };
      setTimeout(emit, 260);
    });
  }

  // --- interactive commands ---
  const commands = {
    help: () => ['available: <c>whoami</c> <c>skills</c> <c>projects</c> <c>contact</c> <c>social</c> <c>sudo</c> <c>clear</c> <c>exit</c>'],
    whoami: () => ['navin hariharan — ethical hacker & AI researcher', 'CEH · Security+ · MSc Cybersecurity'],
    skills: () => ['offensive security · applied AI · infrastructure · forensics', 'python · pytorch · docker · burp · nmap · flux'],
    projects: () => projects.slice(0, 5).map((p) => `<c>${p.title}</c> — ${p.summary}`),
    contact: () => [`<c>${profile.email}</c>`, 'type "social" for links'],
    social: () => socials.map((s) => `${s.label}: <c>${s.href}</c>`),
    sudo: () => ['<err>nice try.</err> you already have root here. :)'],
    clear: () => { body.innerHTML = ''; return []; },
    exit: () => { auto = true; modeTag.textContent = 'AUTO'; modeTag.classList.remove('is-live'); setTimeout(autoNext, 400); return ['<dim>resuming auto feed…</dim>']; },
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    auto = false;
    clearTimeout(typing);
    modeTag.textContent = 'LIVE';
    modeTag.classList.add('is-live');
    print(`navin@navin-hariharan:~$ ${esc(raw)}`, 'line cmd');
    const cmd = raw.toLowerCase().split(' ')[0];
    const fn = commands[cmd];
    const lines = fn ? fn() : [`<err>command not found: ${esc(cmd)}</err> — type <c>help</c>`];
    lines.forEach((l) => print(markup(l)));
    sr.textContent = `${cmd}: ${lines.length} lines`;
  });

  // Pause the auto feed while the user is focused in the input.
  input.addEventListener('focus', () => { if (auto) { auto = false; modeTag.textContent = 'LIVE'; modeTag.classList.add('is-live'); clearTimeout(typing); } });

  // Start the demo when the terminal first appears.
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { autoNext(); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe($('#terminal'));
}

/* ------------------------------------------------------------------ *
 * 5f. Project filters + expand
 * ------------------------------------------------------------------ */
function setupFilters() {
  const buttons = $$('#filters button');
  const cards = $$('.pcard');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn));
    const f = btn.dataset.filter;
    cards.forEach((c) => {
      const show = f === 'All' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
    });
  }));

  // Expand / collapse a file.
  cards.forEach((card) => {
    const toggle = () => {
      const open = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', open);
      $('.open-file', card).textContent = open ? 'encrypt' : 'decrypt';
    };
    $('.open-file', card).addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.target.closest('a')) { e.preventDefault(); toggle(); }
    });
  });
}

/* ------------------------------------------------------------------ *
 * 5g. 3D tilt on project cards + certs
 * ------------------------------------------------------------------ */
function setupCards3D() {
  if (REDUCED || !matchMedia('(pointer: fine)').matches) return;
  $$('.pcard, .cert').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

/* ------------------------------------------------------------------ *
 * 5h. Flip cards (arsenal)
 * ------------------------------------------------------------------ */
function setupFlips() {
  $$('.flip').forEach((flip) => {
    const front = $('.flip-front', flip);
    const back = $('.flip-back .flip-hint', flip);
    front.addEventListener('click', () => flip.classList.add('is-flipped'));
    back.addEventListener('click', () => flip.classList.remove('is-flipped'));
  });
}

/* ------------------------------------------------------------------ *
 * 5i. Magnetic buttons
 * ------------------------------------------------------------------ */
function setupMagnetic() {
  if (REDUCED || !matchMedia('(pointer: fine)').matches) return;
  $$('.magnetic').forEach((btn) => {
    const strength = 0.4;
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      const span = $('span', btn);
      if (span) span.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
      const span = $('span', btn);
      if (span) span.style.transform = '';
    });
  });
}

/* ------------------------------------------------------------------ *
 * 5j. Hex field: light a random cluster now and then
 * ------------------------------------------------------------------ */
function setupHexField() {
  if (REDUCED) return;
  const hexes = $$('#hex-grid li');
  if (!hexes.length) return;
  setInterval(() => {
    const h = rand(hexes);
    h.classList.add('is-lit');
    setTimeout(() => h.classList.remove('is-lit'), 900);
  }, 700);
}

/* ------------------------------------------------------------------ *
 * 5k. Contact: copy address + a one-tap mail CTA
 * ------------------------------------------------------------------ */
function setupContact() {
  const copy = $('#copy-email');
  if (!copy) return;
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(profile.email); copy.textContent = '[ copied ✓ ]'; }
    catch { copy.textContent = '[ ' + profile.email + ' ]'; }
    setTimeout(() => (copy.textContent = '[ copy address ]'), 2000);
  });
}

/* ------------------------------------------------------------------ *
 * 5k-b. Hydrate from the Rust backend when it's serving the page.
 * The Axum server exposes /api/site; when present we re-render the
 * "open to" list and socials from its typed payload and flag the
 * footer as live. On static hosting the fetch fails and the page
 * keeps the values baked into data.js — so it degrades gracefully.
 * ------------------------------------------------------------------ */
async function hydrateFromRust() {
  // Only call the backend when the Axum server rendered this page; on static
  // hosting the marker stays "static" and we keep the baked-in content (and
  // avoid a console 404 from a request that could never succeed).
  const servedBy = $('meta[name="served-by"]')?.content;
  if (servedBy !== 'rust') return;
  try {
    const res = await fetch('/api/site', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();

    const openList = $('.ch-open');
    if (openList && Array.isArray(data.open_to)) {
      openList.innerHTML = data.open_to.map((t) => `<li>${esc(t)}</li>`).join('');
    }

    if (Array.isArray(data.socials) && data.socials.length) {
      $('#socials').innerHTML = data.socials.map(socialLi).join('');
    }

    const credit = $('#stack-credit');
    if (credit) credit.textContent = '';
  } catch {
    /* static hosting (e.g. the preview): keep the baked-in content */
  }
}

/* ------------------------------------------------------------------ *
 * 6a. Scroll spy + progress bar
 * ------------------------------------------------------------------ */
function setupScrollSpy() {
  const bar = $('#progress');
  const sections = $$('[data-section]');
  const navLinks = $$('.hud-nav a, .rail a');

  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.transform = `scaleX(${p})`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.section;
      navLinks.forEach((a) => {
        const href = a.getAttribute('href').slice(1);
        a.classList.toggle('is-active', href === id);
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach((s) => io.observe(s));
}

/* ------------------------------------------------------------------ *
 * 6b. Route wipe between sections on nav click
 * ------------------------------------------------------------------ */
function setupRouteWipes() {
  const route = $('#route');
  const text = $('#route-text');
  $$('[data-route]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (REDUCED) { target.scrollIntoView(); history.replaceState(null, '', `#${id}`); return; }
      text.textContent = `cd /${id === 'top' ? '~' : id}`;
      route.classList.remove('is-out');
      route.classList.add('is-in');
      setTimeout(() => {
        target.scrollIntoView();
        history.replaceState(null, '', `#${id}`);
        route.classList.remove('is-in');
        route.classList.add('is-out');
      }, 340);
    });
  });
}

/* ------------------------------------------------------------------ *
 * 6c. Mobile nav
 * ------------------------------------------------------------------ */
function setupMobileNav() {
  const toggle = $('#menu-toggle');
  const nav = $('#mobile-nav');
  const set = (open) => {
    toggle.setAttribute('aria-expanded', open);
    nav.hidden = !open;
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') set(false); });
}

/* ------------------------------------------------------------------ *
 * 5l. Portrait: show an NH monogram if the hosted photo can't load
 * ------------------------------------------------------------------ */
function setupPortrait() {
  const img = $('#portrait');
  const frame = $('#operator-photo');
  if (!img || !frame) return;
  const fail = () => frame.classList.add('is-fallback');
  img.addEventListener('error', fail);
  // Catch images that errored before this handler attached.
  if (img.complete && img.naturalWidth === 0) fail();
}

/* ------------------------------------------------------------------ *
 * 6d. Globe: dynamic import so a CDN failure can fall back gracefully
 * ------------------------------------------------------------------ */
async function loadGlobe() {
  const wrap = $('#globe');
  const threatCountEl = $('#threat-count');
  const nodeCountEl = $('#node-count');
  const coordEl = $('#coord');
  const feed = $('#threat-feed');

  const fallback = () => wrap.classList.add('is-fallback');

  // A grid globe is enough under reduced motion; skip the WebGL cost.
  if (REDUCED) { fallback(); nodeCountEl.textContent = '20'; return; }

  try {
    const { initGlobe, GLOBE_EVENTS } = await import('./globe.js');
    let coordThrottle = 0;
    initGlobe(wrap, {
      onReady: (n) => { nodeCountEl.textContent = n; },
      onCoord: (lat, lon) => {
        const now = performance.now();
        if (now - coordThrottle < 90) return;
        coordThrottle = now;
        const ns = lat >= 0 ? 'N' : 'S';
        const ew = lon >= 0 ? 'E' : 'W';
        coordEl.textContent = `${Math.abs(lat).toFixed(2)}°${ns} ${Math.abs(lon).toFixed(2)}°${ew}`;
      },
      onPing: (count, where, lat, lon) => {
        threatCountEl.textContent = count;
        const ns = lat >= 0 ? 'N' : 'S';
        const li = document.createElement('li');
        li.innerHTML = `<b>${rand(GLOBE_EVENTS)}</b> · ${where === 'cursor' ? 'cursor' : where} ${Math.abs(lat).toFixed(0)}°${ns}`;
        feed.prepend(li);
        while (feed.children.length > 5) feed.removeChild(feed.lastChild);
      },
    });
  } catch (err) {
    console.warn('Globe unavailable, using fallback:', err);
    fallback();
    nodeCountEl.textContent = '20';
  }
}

/* ------------------------------------------------------------------ *
 * Go
 * ------------------------------------------------------------------ */
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runBoot);
else runBoot();
