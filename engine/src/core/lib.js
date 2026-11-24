// Shared engine: canvas, math, easing and drawing primitives. Every kit function draws on the shared `ctx`.
export const W = 1080, H = 1920, FPS = 30, TAU = Math.PI * 2;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// ---------- math / easing ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));         // 0..1 progress of t between a and b
export const eo = (t) => 1 - Math.pow(1 - t, 3);                              // ease out
export const ei = (t) => t * t * t;                                           // ease in
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }; // overshoot
export const spring = (t, k = 9, d = 5) => 1 - Math.exp(-d * t) * Math.cos(k * t);   // settles with a wobble
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const mix = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
export const wob = (t, f = 1, a = 1, ph = 0) => Math.sin(t * f * TAU + ph) * a;

// ---------- primitives ----------
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-400, -400, W + 800, H + 800); }
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill, stroke, lw) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function ell(x, y, rx, ry, fill, stroke, lw, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function poly(pts, fill, stroke, lw, close = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
/** smooth closed blob through points (Catmull-Rom → quadratic midpoints). */
export function blobPath(pts) {
  const n = pts.length; ctx.beginPath();
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let s = m(pts[n - 1], pts[0]); ctx.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) { const p = pts[i], q = m(p, pts[(i + 1) % n]); ctx.quadraticCurveTo(p[0], p[1], q[0], q[1]); }
  ctx.closePath();
}
export function blob(pts, fill, stroke, lw) {
  blobPath(pts);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
}
/** thick tapered-ish limb along a bezier: from a to b with a bend (normal offset). Round caps. */
export function limb(a, b, bend, w, fill, stroke, lw) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / l * bend, cy = my + dx / l * bend;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(cx, cy, b[0], b[1]); };
  if (stroke) { path(); ctx.strokeStyle = stroke; ctx.lineWidth = w + lw * 2; ctx.stroke(); }
  path(); ctx.strokeStyle = fill; ctx.lineWidth = w; ctx.stroke();
}
export function stroke(pts, color, w, smooth = true) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  if (smooth && pts.length > 2) { for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); }
  else for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
export function grad(x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
/** run fn with a transform (translate, rotate, scale); restores afterwards */
export function at(x, y, rot, sx, sy, fn) { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(sx ?? 1, sy ?? sx ?? 1); fn(); ctx.restore(); }
