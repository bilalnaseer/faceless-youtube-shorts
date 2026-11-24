// Blob Park kit: a sunny park and two blob friends. Thin 5 px ink outlines, flat fills, tentacle limbs, tiny faces.
// Close-ups are made by zooming the SAME wide scene: use scene(cx, cy, zoom, fn). Import as `* as K`.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, spring, rnd, wob, circle, ell, rr, poly, blob, blobPath, limb, stroke, grad, at, fillAll } from './lib.js';

export const P = {
  ink: '#111111', skyTop: '#7FF5E0', skyMid: '#B9F6C9', skyLow: '#FCEFA6', grass: '#97CC63', grassDark: '#7DB650', trunk: '#C99A33', trunkDark: '#A87D22',
  leafDark: '#6B6A34', leaf: '#6CD79B', leafLight: '#8DE8B4', wood: '#8E5A2B', woodLight: '#A56B35', woodDark: '#774A22', metal: '#6F6F78',
  bloo: '#9BEBFF', blooShade: '#7ED6EE', pink: '#F26FBF', purple: '#B57CEF', orby: '#FA9115', orbyShade: '#E27A08', yellow: '#FFD92E', cheek: '#FF7A59',
};
export const OL = 5;
const o = (fill, w = OL) => { if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.lineWidth = w; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
/** zoom the whole scene about (cx, cy): fn draws a normal wide shot, close-ups are just a bigger zoom */
export function scene(cx, cy, zoom, fn) { ctx.save(); ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy); fn(); ctx.restore(); }

// ───────── the park ─────────
function foliage(x, y, w, h, seed, dark = true) {                           // a scalloped canopy: bumpy top and bottom edges, rounded ends
  const n = Math.max(2, Math.ceil(w / 90)), top = y - 300, bot = y + h * 0.4;
  ctx.beginPath(); ctx.moveTo(x, top + 60);
  for (let i = 0; i < n; i++) { const x0 = x + w / n * i, x1 = x + w / n * (i + 1); ctx.quadraticCurveTo((x0 + x1) / 2, top - 70 - rnd(seed + i) * 40, x1, top + 30 + rnd(seed + i + 4) * 30); }
  ctx.quadraticCurveTo(x + w + 40, (top + bot) / 2, x + w, bot);
  for (let i = n; i > 0; i--) { const px = x + (w / n) * i, py = y + h * (0.5 + 0.5 * rnd(seed + i)); ctx.quadraticCurveTo(px - w / n / 2, py + 44, px - w / n, bot + (py - y) * 0.2); }
  ctx.quadraticCurveTo(x - 40, (top + bot) / 2, x, top + 60); ctx.closePath(); o(dark ? P.leafDark : P.leaf);
}
/** park background. dy scrolls the world DOWN (use negative dy… no: positive dy moves everything down, so the camera looks UP). */
export function park(dy = 0) {
  ctx.fillStyle = grad(0, -900 + dy, 0, 1300 + dy, [[0, P.skyTop], [0.55, P.skyMid], [1, P.skyLow]]); ctx.fillRect(-400, -1400 + dy, W + 800, 2800);
  ctx.save(); ctx.translate(0, dy);
  // far leaf mass (light green) behind, upper right
  foliage(560, 80, 700, 260, 30, false);
  // trees
  const trunk = (x, w, top = -120) => { rr(x, top, w, 2600, 0); ctx.fillStyle = P.trunk; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke(); stroke([[x + w * 0.62, top + 700], [x + w * 0.64, 1000]], P.trunkDark, 6, false); };
  trunk(90, 230); trunk(790, 190);
  foliage(-60, 150, 640, 320, 3, true); foliage(700, 120, 520, 280, 11, true); foliage(230, -80, 720, 220, 20, true);
  // ground
  ctx.fillStyle = P.grass; ctx.fillRect(-400, 1260, W + 800, 1400); ctx.beginPath(); ctx.moveTo(-400, 1260); ctx.lineTo(W + 400, 1260); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke();
  ctx.fillStyle = P.grass;
  for (let i = 0; i < 18; i++) { const gx = rnd(i) * W, gy = 1330 + rnd(i + 5) * 520; for (const k of [-1, 0, 1]) stroke([[gx + k * 14, gy], [gx + k * 22, gy - 26]], P.grassDark, 5, false); }
  ctx.restore();
}
/** the bench: seat top at y = 1160, centred at x = 540, 760 wide. Draw BEFORE the characters; benchFront() after if they sit behind the seat edge. */
export function bench(x = 540, y = 1160) {
  ctx.save(); ctx.translate(x, y);
  for (const sx of [-1, 1]) { rr(sx * 330 - 9, 20, 18, 190, 6); ctx.fillStyle = P.metal; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke(); rr(sx * 360 - 7, -230, 14, 250, 6); ctx.fillStyle = P.metal; ctx.fill(); ctx.stroke(); }
  for (let i = 0; i < 3; i++) { rr(-380, -250 + i * 62, 760, 46, 10); ctx.fillStyle = i % 2 ? P.woodLight : P.wood; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke(); }
  poly([[-390, 0], [390, 0], [350, 56], [-350, 56]], P.wood, P.ink, OL); rr(-390, -12, 780, 26, 10); ctx.fillStyle = P.woodLight; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke();
  ctx.restore();
}
// ───────── characters ─────────
const eyeBlob = (x, y, r, look = [0, 0], lid = 0, color = '#fff') => { circle(x, y, r, color, P.ink, 4); circle(x + look[0] * r * 0.45, y + look[1] * r * 0.45, r * 0.45, P.ink); circle(x + look[0] * r * 0.45 + r * 0.14, y + look[1] * r * 0.45 - r * 0.16, r * 0.15, '#fff'); if (lid > 0) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); ctx.fillStyle = P.bloo; ctx.fillRect(x - r, y - r - 2, r * 2, r * 2 * lid + 2); ctx.restore(); stroke([[x - r, y - r + r * 2 * lid], [x + r, y - r + r * 2 * lid]], P.ink, 4, false); } };
/** BLOO, the tall blue teardrop with a pink tentacle arm and a purple curl for a foot. Origin = bottom centre (sitting point).
 *  opts: x y s flip · eyes 'open'|'closed'|'wide'|'angry'|'sleepy'|'happy' · look [x,y] · mouth 'flat'|'o'|'smile'|'frown'|'grit'
 *        arm: 'rest'|'up'|'out' + armT (0..1 blend) · hold(x, y) prop at the arm tip · lean (rad) · squash · t */
export function bloo(op = {}) {
  const { x = 380, y = 1160, s = 1, flip = false, eyes = 'open', look = [0.4, 0], mouth = 'flat', arm = 'rest', armT = 1, hold = null, lean = 0, squash = 1, t = 0, tip = [0, 0] } = op;
  ctx.save(); ctx.translate(x, y); ctx.rotate(lean); ctx.scale((flip ? -1 : 1) * s, s * squash);
  // purple foot curl
  ctx.beginPath(); ctx.moveTo(-90, -30); ctx.quadraticCurveTo(-160, 10, -120, 40); ctx.quadraticCurveTo(-30, 70, 40, 10); ctx.quadraticCurveTo(-30, 30, -60, -22); ctx.closePath(); o(P.purple);
  // body
  blob([[20, -440], [78, -382], [96, -270], [132, -130], [118, -30], [20, 8], [-96, -22], [-134, -130], [-92, -290], [-40, -400]], P.bloo, P.ink, OL + 1);
  ctx.beginPath(); ctx.ellipse(-76, -160, 18, 90, 0.18, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fill();
  // face
  const fy = -318;
  if (eyes === 'closed') { for (const ex of [-4, 56]) { ctx.beginPath(); ctx.arc(ex, fy, 20, Math.PI * 1.05, Math.PI * 1.95, true); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); } }
  else if (eyes === 'happy') { for (const ex of [-4, 56]) { ctx.beginPath(); ctx.arc(ex, fy + 8, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); } }
  else { const r = eyes === 'wide' ? 34 : 28; eyeBlob(-6, fy, r, look, eyes === 'sleepy' ? 0.5 : 0); eyeBlob(56, fy + 2, r, look, eyes === 'sleepy' ? 0.5 : 0);
    if (eyes === 'angry') { stroke([[-40, fy - 44], [24, fy - 24]], P.ink, 7, false); stroke([[96, fy - 40], [36, fy - 22]], P.ink, 7, false); } }
  const mx = 22, my = fy + 76;
  if (mouth === 'flat') stroke([[mx - 22, my], [mx + 22, my + 2]], P.ink, 5, false);
  else if (mouth === 'o') ell(mx, my + 6, 16, 22, '#5B2A3A', P.ink, 4);
  else if (mouth === 'smile') { ctx.beginPath(); ctx.arc(mx, my - 10, 26, 0.2, Math.PI - 0.2); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); }
  else if (mouth === 'frown') { ctx.beginPath(); ctx.arc(mx, my + 20, 26, Math.PI + 0.3, TAU - 0.3); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); }
  else if (mouth === 'grit') { rr(mx - 30, my - 8, 60, 28, 6); o('#fff', 4); stroke([[mx - 10, my - 8], [mx - 10, my + 20]], P.ink, 3, false); stroke([[mx + 10, my - 8], [mx + 10, my + 20]], P.ink, 3, false); }
  // pink tentacle arm (from the right shoulder)
  const sh = [92, -170];
  const poses = { rest: [[150, -90], 40, [196, -100]], out: [[250, -170], -30, [290, -200]], up: [[170, -330], -50, [190, -430]] };
  const [pe, pb, tp] = poses[arm] || poses.rest, e = [lerp(150, pe[0], armT) + tip[0], lerp(-90, pe[1], armT) + tip[1]];
  limb(sh, e, pb, 40, P.pink, P.ink, 5); circle(e[0], e[1], 22, P.pink, P.ink, 5);
  if (hold) hold(e[0], e[1]);
  ctx.restore();
}
/** ORBY, the orange ball with a yellow squiggle body. Origin = bottom centre (sitting point).
 *  opts: x y s flip · eyes 'open'|'wide'|'happy'|'sparkle'|'teary'|'sad'|'closed' · mouth 'smile'|'o'|'grin'|'bite'|'frown'|'open' · look [x,y]
 *        armUp (0..1: hands raised) · hold(x, y) prop at the hands · squash · t */
export function orby(op = {}) {
  const { x = 700, y = 1160, s = 1, flip = false, eyes = 'open', mouth = 'smile', look = [-0.3, 0], armUp = 0, hold = null, squash = 1, t = 0, dangle = 0, hands = null } = op;
  ctx.save(); ctx.translate(x, y); ctx.scale((flip ? -1 : 1) * s, s * squash);
  // lower body: yellow squiggle blob
  ctx.beginPath(); ctx.ellipse(0, -80, 96, 82, 0, 0, TAU); o(P.orby);
  stroke([[-40, -110], [-16, -66], [0, -112], [16, -66], [40, -110]], P.yellow, 14); stroke([[-60, -40], [-30, -56], [-10, -30]], P.yellow, 12);
  // feet
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 46, -6 + dangle * Math.sin(t * 5 + sx), 34, 16, 0, 0, TAU); o(P.orbyShade); }
  // arms: yellow squiggle tentacles; hands raised toward `hands` (or default)
  const sh = [[-84, -150], [84, -150]], lo = [[-150, -40], [150, -40]], hi = hands || [[-60, -430], [60, -430]];
  for (let k = 0; k < 2; k++) { const e = [lerp(lo[k][0], hi[k][0], armUp), lerp(lo[k][1], hi[k][1], armUp)]; limb(sh[k], e, (k ? -1 : 1) * 24, 28, P.yellow, P.ink, 5); circle(e[0], e[1], 18, P.yellow, P.ink, 5); if (k === 0 && hold) hold(e[0], e[1]); }
  // head
  ctx.beginPath(); ctx.ellipse(0, -256, 118, 112, 0, 0, TAU); o(P.orby);
  ctx.beginPath(); ctx.ellipse(-60, -300, 28, 48, 0.6, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill();
  // eyes
  const er = eyes === 'wide' ? 40 : 34, ey = -262;
  const big = (ex) => { ell(ex, ey, er * 0.9, er, P.ink); circle(ex + look[0] * 8 - 9, ey - 12, er * 0.3, '#fff'); circle(ex + look[0] * 8 + 10, ey + 14, er * 0.14, '#fff'); };
  if (eyes === 'open' || eyes === 'wide' || eyes === 'sparkle') { big(-46); big(46); if (eyes === 'sparkle') { circle(-46 + 6, ey - 4, 12, '#fff'); circle(46 + 6, ey - 4, 12, '#fff'); } }
  else if (eyes === 'teary') { big(-46); big(46); ell(-46, ey + 34, 30, 12, '#BFEFFF'); ell(46, ey + 34, 30, 12, '#BFEFFF'); }
  else if (eyes === 'sad') { big(-46); big(46); stroke([[-86, ey - 40], [-20, ey - 62]], P.ink, 6, false); stroke([[86, ey - 40], [20, ey - 62]], P.ink, 6, false); }
  else if (eyes === 'happy') { for (const ex of [-46, 46]) { ctx.beginPath(); ctx.arc(ex, ey + 8, 28, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); } }
  else { for (const ex of [-46, 46]) { ctx.beginPath(); ctx.arc(ex, ey, 26, Math.PI * 0.15, Math.PI * 0.85); ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.stroke(); } }
  ell(-80, ey + 56, 18, 10, 'rgba(255,90,60,.35)'); ell(80, ey + 56, 18, 10, 'rgba(255,90,60,.35)');
  const my = -196;
  if (mouth === 'smile') { ctx.beginPath(); ctx.arc(0, my - 14, 24, 0.15, Math.PI - 0.15); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); }
  else if (mouth === 'grin') { ctx.beginPath(); ctx.moveTo(-60, my - 20); ctx.quadraticCurveTo(0, my + 60, 60, my - 20); ctx.closePath(); o('#5B2A3A', 5); ell(0, my + 18, 24, 12, '#E8727E'); }
  else if (mouth === 'o') ell(0, my, 18, 26, '#5B2A3A', P.ink, 4);
  else if (mouth === 'open') { ctx.beginPath(); ctx.ellipse(0, my + 2, 34, 28, 0, 0, TAU); o('#5B2A3A', 5); ell(0, my + 14, 18, 10, '#E8727E'); }
  else if (mouth === 'frown') { ctx.beginPath(); ctx.arc(0, my + 24, 24, Math.PI + 0.3, TAU - 0.3); ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); }
  else if (mouth === 'bite') { rr(-70, my - 30, 140, 70, 14); o('#fff', 5); for (let i = -2; i <= 2; i++) stroke([[i * 28, my - 30], [i * 28, my + 40]], P.ink, 3, false); stroke([[-70, my + 5], [70, my + 5]], P.ink, 3, false); }
  ctx.restore();
}
// ───────── props ─────────
export function balloon(x, y, r, color, a = 0, stringTo = null, t = 0) {                     // x,y = balloon centre; string runs to stringTo = [sx, sy]
  if (stringTo) { ctx.beginPath(); ctx.moveTo(x, y + r * 1.05); ctx.bezierCurveTo(x + Math.sin(t * 3 + a) * 18, y + r * 1.5 + (stringTo[1] - y) * 0.3, stringTo[0] - Math.sin(t * 2) * 12, stringTo[1] - (stringTo[1] - y) * 0.3, stringTo[0], stringTo[1]); ctx.lineWidth = 3; ctx.strokeStyle = P.ink; ctx.stroke(); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.9, r, 0, 0, TAU); o(color, 5);
  ctx.beginPath(); ctx.moveTo(-8, r + 2); ctx.lineTo(8, r + 2); ctx.lineTo(0, r + 14); ctx.closePath(); o(color, 4);
  ctx.beginPath(); ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.14, r * 0.28, 0.5, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill(); ctx.restore();
}
export function cloud(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.arc(60, -16, 62, 0, TAU); ctx.arc(130, 0, 48, 0, TAU); ctx.rect(0, 0, 130, 48); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill(); ctx.restore(); }
export function sparkles(x, y, r, a = 1, t = 0) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 4; i++) { const an = i / 4 * TAU + t * 2, rr_ = r * (0.8 + 0.2 * Math.sin(t * 6 + i)); stroke([[x + Math.cos(an) * rr_ * 0.6, y + Math.sin(an) * rr_ * 0.6], [x + Math.cos(an) * rr_, y + Math.sin(an) * rr_]], P.ink, 5, false); } ctx.restore(); }
export function sweatDrop(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(22, 4, 0, 20); ctx.quadraticCurveTo(-22, 4, 0, -30); o('#C9F1FF', 4); ctx.restore(); }
export function bird(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const f = Math.sin(t * 8) * 10; stroke([[-40, -f], [0, 10], [40, -f]], P.ink, 6); ctx.restore(); }
