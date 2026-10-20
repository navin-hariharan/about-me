/**
 * globe.js — a monochrome particle-Earth, built with Three.js.
 *
 * The look: white dots mapped onto the continents, a faint network mesh of
 * lines between hub nodes, a few travelling arcs, brighter nodes and a soft
 * particle halo — all greyscale on black, like a global-network render.
 * No colour.
 *
 * Continents come from a handful of lat/lon ellipses (isLand) so the dots
 * cluster into recognisable landmasses without needing an external map image.
 *
 * The globe tilts toward the pointer, can be dragged to spin, drops a ping
 * where the cursor meets the sphere, and pauses rendering when off screen.
 */
import * as THREE from 'three';

// Rough continent blobs: [centreLat, centreLon, semiLat, semiLon].
// A point counts as land if it falls inside any ellipse — enough to read
// as Earth (Africa, Eurasia, the Americas, Australia, Antarctica…).
const LAND = [
  [10, 20, 34, 24],    // Africa (north + centre)
  [-8, 22, 30, 18],    // Africa (south)
  [52, 12, 17, 40],    // Europe
  [45, 90, 32, 62],    // Asia
  [30, 46, 16, 18],    // Middle East / Arabia
  [22, 80, 14, 16],    // India
  [58, -102, 26, 46],  // North America
  [40, -95, 16, 26],   // North America (south)
  [-18, -60, 32, 20],  // South America
  [-28, 134, 13, 22],  // Australia
  [72, -42, 11, 26],   // Greenland
  [-82, 0, 10, 180],   // Antarctica
];

const DEG = Math.PI / 180;

function isLand(lat, lon) {
  for (const [la, lo, dla, dlo] of LAND) {
    let d = ((lon - lo + 540) % 360) - 180;
    const a = (lat - la) / dla;
    const b = d / dlo;
    if (a * a + b * b < 1) return true;
  }
  return false;
}

function toVec3(lat, lon, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function toLatLon(v) {
  const n = v.clone().normalize();
  const lat = 90 - Math.acos(n.y) / DEG;
  let lon = Math.atan2(n.z, -n.x) / DEG - 180;
  if (lon < -180) lon += 360;
  return { lat, lon };
}

// Soft round white sprite for dots, nodes and packets.
function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const EVENTS = ['handshake', 'node sync', 'packet relay', 'route update', 'keepalive', 'tunnel open', 'mesh ping', 'heartbeat'];

export function initGlobe(container, hooks = {}) {
  const width = container.clientWidth || 480;
  const height = container.clientHeight || 480;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 3.05);

  const world = new THREE.Group(); // tilts toward the pointer
  scene.add(world);
  const globe = new THREE.Group(); // spins continuously
  world.add(globe);

  const R = 1;
  const sprite = dotTexture();

  // --- dotted sphere: dense land dots, sparse faint ocean dots ---
  const land = [];
  const ocean = [];
  const N = 7000;
  const gold = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = gold * i;
    const v = new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad);
    const { lat, lon } = toLatLon(v);
    if (isLand(lat, lon)) land.push(v);
    else if (Math.random() < 0.12) ocean.push(v); // keep the sphere readable
  }

  const toGeo = (pts, r) => {
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((v, i) => arr.set([v.x * r, v.y * r, v.z * r], i * 3));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  };

  globe.add(new THREE.Points(toGeo(land, R * 1.002), new THREE.PointsMaterial({
    color: 0xffffff, size: 0.017, map: sprite, transparent: true, opacity: 0.92, depthWrite: false, blending: THREE.AdditiveBlending,
  })));
  globe.add(new THREE.Points(toGeo(ocean, R), new THREE.PointsMaterial({
    color: 0x9fb0c0, size: 0.009, map: sprite, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending,
  })));

  // Soft particle halo just outside the silhouette.
  const haloPts = [];
  for (let i = 0; i < 420; i++) {
    const y = 1 - (i / 419) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = gold * i * 1.7;
    haloPts.push(new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad).multiplyScalar(1.06 + Math.random() * 0.06));
  }
  globe.add(new THREE.Points(toGeo(haloPts, 1), new THREE.PointsMaterial({
    color: 0xffffff, size: 0.012, map: sprite, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending,
  })));

  // --- hub nodes on land + a static constellation mesh ---
  const nodes = [];
  const shuffled = land.slice().sort(() => Math.random() - 0.5);
  for (const v of shuffled) {
    if (nodes.length >= 56) break;
    if (nodes.every((n) => n.distanceTo(v) > 0.28)) nodes.push(v.clone().multiplyScalar(R * 1.01));
  }

  globe.add(new THREE.Points(toGeo(nodes, 1), new THREE.PointsMaterial({
    color: 0xffffff, size: 0.05, map: sprite, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending,
  })));

  const segPts = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ b, j, d: a.distanceTo(b) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach(({ b }) => { segPts.push(a.clone(), b.clone()); });
  });
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(segPts), new THREE.LineBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending,
  })));

  // --- travelling arcs between nodes ---
  const arcs = [];
  const arcGroup = new THREE.Group();
  globe.add(arcGroup);

  function spawnArc(aIdx, bIdx) {
    const a = nodes[aIdx];
    const b = nodes[bIdx];
    const mid = a.clone().add(b).multiplyScalar(0.5).setLength(R * (1.12 + a.distanceTo(b) * 0.16));
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const segs = 48;
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segs));
    geo.setDrawRange(0, 0);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
    arcGroup.add(line);
    const packet = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    packet.scale.setScalar(0.06);
    arcGroup.add(packet);
    arcs.push({ line, packet, curve, segs, t: 0, life: 0, max: 1.9 });
  }

  // --- expanding ping rings (white) ---
  const pings = [];
  const pingGeo = new THREE.RingGeometry(0.02, 0.05, 28);
  function spawnPing(vec) {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(pingGeo, mat);
    ring.position.copy(vec.clone().setLength(R * 1.01));
    ring.lookAt(vec.clone().multiplyScalar(2));
    globe.add(ring);
    pings.push({ ring, t: 0 });
  }

  const state = { threatCount: 0, nodeCount: nodes.length };
  if (hooks.onReady) hooks.onReady(state.nodeCount);

  // --- interaction ---
  const pointer = new THREE.Vector2(-5, -5);
  const tiltTarget = new THREE.Vector2(0, 0);
  const tilt = new THREE.Vector2(0, 0);
  let spin = 0.0011;
  let dragging = false;
  let lastX = 0;
  const raycaster = new THREE.Raycaster();
  const pickSphere = new THREE.Mesh(new THREE.SphereGeometry(R, 24, 24), new THREE.MeshBasicMaterial({ visible: false }));
  globe.add(pickSphere);
  let lastCursorPing = 0;

  function onMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    pointer.set(nx, ny);
    tiltTarget.set(nx * 0.34, ny * 0.3);
    if (dragging) spin = 0.0011 + (e.clientX - lastX) * 0.00018;
    lastX = e.clientX;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(pickSphere)[0];
    if (hit) {
      const local = globe.worldToLocal(hit.point.clone());
      const { lat, lon } = toLatLon(local);
      if (hooks.onCoord) hooks.onCoord(lat, lon);
      const now = performance.now();
      if (now - lastCursorPing > 320) {
        lastCursorPing = now;
        spawnPing(local);
        state.threatCount++;
        if (hooks.onPing) hooks.onPing(state.threatCount, 'cursor', lat, lon);
      }
    }
  }
  renderer.domElement.addEventListener('pointermove', onMove, { passive: true });
  renderer.domElement.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId); });
  renderer.domElement.addEventListener('pointerup', () => { dragging = false; });
  renderer.domElement.addEventListener('pointerleave', () => { dragging = false; pointer.set(-5, -5); });

  let autoTimer = 0;
  let running = true;
  let raf = 0;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);

    globe.rotation.y += spin;
    if (!dragging) spin += (0.0011 - spin) * 0.02;
    tilt.lerp(tiltTarget, 0.06);
    world.rotation.x = tilt.y;
    world.rotation.y = tilt.x;

    autoTimer += dt;
    if (autoTimer > 1.2) {
      autoTimer = 0;
      const a = (Math.random() * nodes.length) | 0;
      let b = (Math.random() * nodes.length) | 0;
      if (b === a) b = (b + 1) % nodes.length;
      spawnArc(a, b);
      if (Math.random() > 0.4) {
        spawnPing(nodes[b]);
        state.threatCount++;
        const { lat, lon } = toLatLon(nodes[b]);
        if (hooks.onPing) hooks.onPing(state.threatCount, 'node', lat, lon);
      }
    }

    for (let i = arcs.length - 1; i >= 0; i--) {
      const arc = arcs[i];
      arc.life += dt;
      arc.t = Math.min(1, arc.t + dt * 1.4);
      arc.line.geometry.setDrawRange(0, Math.floor(arc.t * (arc.segs + 1)));
      arc.packet.position.copy(arc.curve.getPoint(arc.t));
      const fade = Math.max(0, 1 - (arc.life - arc.max + 0.6) / 0.6);
      arc.line.material.opacity = 0.85 * fade;
      arc.packet.material.opacity = fade;
      if (arc.life > arc.max) {
        arcGroup.remove(arc.line, arc.packet);
        arc.line.geometry.dispose();
        arcs.splice(i, 1);
      }
    }

    for (let i = pings.length - 1; i >= 0; i--) {
      const ping = pings[i];
      ping.t += dt * 2.2;
      ping.ring.scale.setScalar(1 + ping.t * 6);
      ping.ring.material.opacity = Math.max(0, 1 - ping.t);
      if (ping.t >= 1) {
        globe.remove(ping.ring);
        ping.ring.material.dispose();
        pings.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) { clock.getDelta(); raf = requestAnimationFrame(frame); }
    else cancelAnimationFrame(raf);
  }, { threshold: 0.05 });
  io.observe(container);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  return { EVENTS };
}

export const GLOBE_EVENTS = EVENTS;
