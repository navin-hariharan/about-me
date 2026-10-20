/**
 * rain.js — falling-code background on a single fixed canvas.
 * Throttled to ~30fps, paused when the tab is hidden, and drawn once
 * (no animation) when the visitor prefers reduced motion.
 */

const GLYPHS = 'アカサタナハマヤラワ0123456789ABCDEF<>/{}$#*+=ｦｱｳｴｵｶｷｸｹｺ'.split('');
const SIZE = 16;

export function startRain(canvas, { reduced }) {
  const ctx = canvas.getContext('2d');
  let drops = [];
  let cols = 0;
  let w = 0;
  let h = 0;
  let last = 0;
  let raf = 0;
  const pointer = { x: -1e4, y: -1e4 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / SIZE);
    // Each column keeps its own head position and speed.
    drops = Array.from({ length: cols }, () => ({ y: Math.random() * -h, v: 0.4 + Math.random() * 0.9 }));
    ctx.fillStyle = '#03050b';
    ctx.fillRect(0, 0, w, h);
    if (reduced) drawStatic();
  }

  function glyph() {
    return GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }

  // One frame: fade the previous frame slightly, then draw the new heads.
  function step() {
    ctx.fillStyle = 'rgba(3, 5, 11, 0.12)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${SIZE - 2}px "JetBrains Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const d = drops[i];
      const x = i * SIZE;
      const near = Math.abs(x - pointer.x) < 90 && Math.abs(d.y - pointer.y) < 160;
      ctx.fillStyle = near ? '#ff2bd6' : i % 7 === 0 ? '#22e6ff' : '#3dff8a';
      ctx.globalAlpha = near ? 1 : 0.75;
      ctx.fillText(glyph(), x, d.y);
      d.y += SIZE * d.v * (near ? 1.8 : 1);
      if (d.y > h + 40 && Math.random() > 0.96) {
        d.y = Math.random() * -200;
        d.v = 0.4 + Math.random() * 0.9;
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawStatic() {
    ctx.font = `${SIZE - 2}px "JetBrains Mono", monospace`;
    for (let i = 0; i < cols; i += 2) {
      for (let y = 0; y < h; y += SIZE * 3) {
        ctx.fillStyle = Math.random() > 0.85 ? '#22e6ff' : '#1a3a2a';
        ctx.fillText(glyph(), i * SIZE, y);
      }
    }
  }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return;
    last = t;
    step();
  }

  resize();
  window.addEventListener('resize', resize);
  if (reduced) return;

  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) raf = requestAnimationFrame(loop);
  });
  raf = requestAnimationFrame(loop);
}
