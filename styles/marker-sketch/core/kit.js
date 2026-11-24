// Marker Sketch kit: white page, thick black marker outlines, big goofy eyes, flat grey props. No colour except the red title.
// Everything is open line art (white fill so shapes overlap cleanly). Import as `* as K`.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell, rr, poly, blobPath, stroke, grad, at } from './lib.js';

export const P = { ink: '#0D0D0D', grey: '#737373', greyLight: '#9A9A9A', paper: '#FFFFFF', red: '#E3280F' };
export const LW = 11;                                                      // marker width

/** hand-drawn polyline: a smooth curve through the points with a tiny deterministic wobble. */
export function ink(pts, w = LW, seed = 1, wobble = 1.2) {
  const q = pts.map((p, i) => [p[0] + (rnd(seed * 7 + i) - 0.5) * wobble * 2, p[1] + (rnd(seed * 13 + i) - 0.5) * wobble * 2]);
  stroke(q, P.ink, w, true);
}
function shape(pts, fill = P.paper, w = LW, seed = 1, wobble = 1.2) {                // closed smooth shape: white fill + marker outline
  const q = pts.map((p, i) => [p[0] + (rnd(seed * 7 + i) - 0.5) * wobble * 2, p[1] + (rnd(seed * 13 + i) - 0.5) * wobble * 2]);
  blobPath(q); if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.lineWidth = w; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.stroke();
}
const arcLine = (cx, cy, r, a0, a1, w = LW) => { ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.lineWidth = w; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); };

// ───────── eyes (shared) ─────────
/** big goofy eye with glasses ring. lid 0..1 (1 = half shut, sleepy), look [x,y] in -1..1, r = eye radius */
function eye(x, y, r, lid = 0.4, look = [0, 0], glasses = true, brow = 0) {
  if (glasses) { ctx.beginPath(); ctx.arc(x, y, r + 14, 0, TAU); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.stroke(); }
  circle(x, y, r, P.paper, P.ink, 8);
  const px = x + look[0] * r * 0.45, py = y + look[1] * r * 0.4;
  circle(px, py, r * 0.2, P.ink);
  if (lid > 0) {                                                                    // upper lid: white cap with an inked edge
    const ly = y - r + lid * 2 * r * 0.82;
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 4, 0, TAU); ctx.clip();
    ctx.fillStyle = P.paper; ctx.fillRect(x - r, y - r - 4, r * 2, ly - (y - r) + 4);
    ctx.restore(); stroke([[x - r, ly + 4], [x, ly - 4], [x + r, ly + 4]], P.ink, 8);
  }
}
const MOUTH = {
  meh(x, y) { stroke([[x - 22, y], [x, y - 4], [x + 22, y + 2]], P.ink, 7); },
  small(x, y) { ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.quadraticCurveTo(x, y - 10, x + 18, y + 4); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.stroke(); stroke([[x - 6, y + 6], [x + 10, y + 12]], P.ink, 6); },
  o(x, y) { ell(x, y, 16, 22, P.paper, P.ink, 7); },
  grin(x, y) { ctx.beginPath(); ctx.moveTo(x - 36, y - 6); ctx.quadraticCurveTo(x, y + 26, x + 40, y - 8); ctx.quadraticCurveTo(x + 2, y + 10, x - 36, y - 6); ctx.closePath(); ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.stroke(); },
  talk(x, y, t = 0) { const o = 10 + Math.abs(Math.sin(t * 12)) * 16; ell(x, y, 20, o, P.paper, P.ink, 7); },
  smirk(x, y) { ctx.beginPath(); ctx.moveTo(x - 30, y + 4); ctx.quadraticCurveTo(x + 4, y + 14, x + 38, y - 14); ctx.lineWidth = 8; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); },
};
const fist = (x, y, s = 1) => {                                                      // a rounded cartoon fist
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape([[-24, -10], [-6, -30], [22, -24], [34, 0], [20, 26], [-14, 28], [-30, 12]], P.paper, 9, 5, 0);
  stroke([[-14, 0], [6, 4]], P.ink, 6); stroke([[-10, -14], [10, -12]], P.ink, 6);
  ctx.restore();
};

/** DOUG, the customer: a tall box head with a quiff, giant sleepy eyes in glasses. Origin = neck base.
 *  opts: x y s · lid look mouth ('meh'|'small'|'o'|'grin'|'talk'|'smirk') · hand 'chin'|'down'|'wave'|'point' · tilt · t */
export function doug(op = {}) {
  const { x = 300, y = 1100, s = 1, lid = 0.45, look = [0.3, 0.2], mouth = 'small', hand = 'chin', tilt = 0, t = 0, brow = 0, flip = false } = op;
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale((flip ? -1 : 1) * s, s);
  // body: two long sleeves from the neck, shoulders sloping down
  ink([[-70, 0], [-110, 80], [-150, 260], [-168, 420]], LW, 2);                                     // left side
  ink([[78, -4], [130, 90], [162, 240], [150, 420]], LW, 3);                                       // right side
  ink([[-58, 14], [-62, 120], [-64, 300]], 8, 4);                                                   // inner fold
  stroke([[-30, 4], [-24, 34]], P.ink, 6); stroke([[-8, 6], [-4, 36]], P.ink, 6); stroke([[16, 6], [14, 34]], P.ink, 6);   // neck wrinkles
  // head: leaning box (flat top, slight taper), quiff swoosh
  const head = [[-104, -50], [-98, -210], [-96, -330], [96, -300], [104, -180], [92, -42]];
  ctx.beginPath(); ctx.moveTo(-104, -50); ctx.lineTo(-100, -318); ctx.lineTo(96, -292); ctx.lineTo(108, -170); ctx.lineTo(94, -44); ctx.quadraticCurveTo(0, -20, -104, -50); ctx.closePath();
  ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-100, -318); ctx.quadraticCurveTo(-30, -400, 90, -372); ctx.quadraticCurveTo(10, -352, 96, -292); ctx.fillStyle = P.paper; ctx.fill(); ctx.stroke();   // quiff
  ctx.beginPath(); ctx.moveTo(-40, -352); ctx.quadraticCurveTo(10, -390, 60, -362); ctx.lineWidth = 7; ctx.stroke();
  // face
  const ey = -190;
  eye(-34 + tilt * 0, ey, 40, lid, look, true); eye(48, ey + 6, 44, lid, look, true);
  if (brow) { ink([[-70, ey - 74 - brow * 14], [-34, ey - 90 - brow * 22], [0, ey - 74 - brow * 10]], 8, 9); ink([[18, ey - 76 - brow * 14], [52, ey - 94 - brow * 22], [90, ey - 70 - brow * 8]], 8, 10); }
  else ink([[-70, ey - 66], [-34, ey - 84], [0, ey - 68]], 8, 9);
  (MOUTH[mouth] || MOUTH.small)(14, -88, t);
  // hand
  if (hand === 'chin') { ink([[110, 120], [150, 20], [96, -40]], LW, 5); shape([[70, -40], [92, -90], [120, -80], [128, -40], [112, 0], [78, 6]], P.paper, 9, 6, 0.6); stroke([[96, -88], [100, -52]], P.ink, 6); }
  else if (hand === 'wave') { ink([[110, 120], [190, 20], [210, -110]], LW, 5); fist(214, -140, 1.2); }
  else if (hand === 'point') { ink([[110, 120], [200, 60], [290, 40]], LW, 5); shape([[280, 24], [340, 30], [344, 50], [286, 60]], P.paper, 9, 6, 0.5); }
  ctx.restore();
}
/** RAY, the cashier: round head, cap with a visor, glasses, name-tag shirt. Origin = neck base. opts: x y s · lid look mouth · talk t */
export function ray(op = {}) {
  const { x = 700, y = 1100, s = 1, lid = 0.15, look = [-0.2, 0.7], mouth = 'grin', t = 0, flip = false } = op;
  ctx.save(); ctx.translate(x, y); ctx.scale((flip ? -1 : 1) * s, s);
  ink([[-150, 0], [-210, 80], [-240, 260]], LW, 12); ink([[150, 0], [210, 80], [240, 260]], LW, 13);
  shape([[-140, 0], [-60, 30], [0, 8], [60, 30], [140, 0], [150, 200], [-150, 200]], P.paper, LW, 14, 0.8);                // shirt
  rr(40, 70, 70, 44, 6); ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.stroke();
  // head
  ctx.beginPath(); ctx.ellipse(0, -140, 148, 150, 0, 0, TAU); ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = P.ink; ctx.stroke();
  // cap: dome + brim
  ctx.beginPath(); ctx.moveTo(-150, -170); ctx.quadraticCurveTo(-140, -330, 0, -336); ctx.quadraticCurveTo(140, -330, 150, -170); ctx.quadraticCurveTo(0, -200, -150, -170); ctx.closePath(); ctx.fillStyle = P.paper; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-150, -176); ctx.quadraticCurveTo(0, -212, 150, -176); ctx.quadraticCurveTo(250, -170, 276, -150); ctx.quadraticCurveTo(110, -150, -150, -176); ctx.closePath(); ctx.fillStyle = P.paper; ctx.fill(); ctx.stroke();
  circle(0, -338, 10, P.paper, P.ink, 7);
  // face
  eye(-56, -120, 44, lid, look, true); eye(56, -120, 44, lid, look, true); ink([[-18, -122], [18, -122]], 8, 3);
  (MOUTH[mouth] || MOUTH.grin)(10, -40, t);
  ctx.restore();
}
/** GUS, the stock boy in the background. pose 0 = waving hello · 1 = panicked jump · 2 = flattened on the floor · 3 = hugging his head. Origin = feet. */
export function gus(op = {}) {
  const { x = 140, y = 1100, s = 1, pose = 0, t = 0, flip = false } = op;
  ctx.save(); ctx.translate(x, y); ctx.scale((flip ? -1 : 1) * s, s);
  const head = (hx, hy, mouth) => { circle(hx, hy, 66, P.paper, P.ink, LW - 1); circle(hx - 22, hy - 8, 12, P.paper, P.ink, 6); circle(hx + 20, hy - 8, 12, P.paper, P.ink, 6); circle(hx - 22, hy - 6, 4, P.ink); circle(hx + 20, hy - 6, 4, P.ink);
    mouth === 'scream' ? ell(hx, hy + 30, 20, 24, P.paper, P.ink, 7) : stroke([[hx - 18, hy + 26], [hx + 18, hy + 26]], P.ink, 7); };
  const hat = (hx, hy) => { shape([[hx - 56, hy - 40], [hx - 66, hy - 100], [hx - 20, hy - 130], [hx + 20, hy - 124], [hx + 64, hy - 100], [hx + 54, hy - 40]], P.paper, 9, 20, 0.5); };
  if (pose === 0) {
    const w = Math.sin(t * 10) * 0.2; hat(0, -270); head(0, -250, 'flat'); ink([[0, -184], [0, -60]], LW, 21);
    ink([[0, -170], [-60, -110], [-70, -50]], 9, 22); ink([[0, -170], [70, -190 + 0], [96 + w * 40, -270 + w * 30]], 9, 23); fist(100 + w * 40, -290 + w * 30, 0.6);
    ink([[0, -60], [-30, 0]], 9, 24); ink([[0, -60], [34, 0]], 9, 25);
  } else if (pose === 1) {
    const j = Math.abs(Math.sin(t * 9)) * 40; ctx.translate(0, -j); hat(0, -270); head(0, -250, 'scream'); ink([[0, -184], [0, -60]], LW, 21);
    ink([[0, -170], [-80, -230], [-110, -330]], 9, 22); ink([[0, -170], [80, -230], [110, -330]], 9, 23); fist(-112, -350, 0.6); fist(112, -350, 0.6);
    ink([[0, -60], [-50, -10]], 9, 24); ink([[0, -60], [60, -20]], 9, 25);
  } else if (pose === 2) {
    ctx.translate(330, -30); ctx.rotate(-1.45); hat(0, -270); head(0, -250, 'scream'); ink([[0, -184], [0, -60]], LW, 21);
    ink([[0, -170], [-60, -120], [-30, -60]], 9, 22); ink([[0, -170], [70, -120], [40, -60]], 9, 23); ink([[0, -60], [-40, 0]], 9, 24); ink([[0, -60], [40, 0]], 9, 25);
  } else {
    hat(0, -230); head(0, -210, 'scream'); ink([[0, -144], [0, -40]], LW, 21);
    ink([[0, -130], [-70, -180], [-40, -250]], 9, 22); ink([[0, -130], [70, -180], [40, -250]], 9, 23); ink([[0, -40], [-40, 0]], 9, 24); ink([[0, -40], [40, 0]], 9, 25);
  }
  ctx.restore();
}
// ───────── props (flat grey, like the page's shadows) ─────────
/** counter: a diagonal edge across the picture; fill grey below it when filled. */
export function counterLine(y0, y1, filled = false, color = P.grey) {
  ctx.beginPath(); ctx.moveTo(-60, y0); ctx.lineTo(W + 60, y1); if (filled) { ctx.lineTo(W + 60, H + 100); ctx.lineTo(-60, H + 100); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); }
  else { ctx.lineWidth = 14; ctx.strokeStyle = P.ink; ctx.stroke(); }
}
export function greyTablet(x, y, s = 1, rot = 0.14, label = 'LIST', cols = 2) {                     // the grey list board with FOOD-style label
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-10, -10, 360, 440, 30); ctx.fillStyle = P.grey; ctx.fill(); rr(20, 20, 300, 380, 18); ctx.fillStyle = '#8E8E8E'; ctx.fill();
  ctx.font = '400 70px Hand'; ctx.fillStyle = '#C9C9C9'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, 50, 70);
  for (let i = 0; i < 6; i++) { const bx = 50 + (i % cols) * 130, by = 130 + Math.floor(i / cols) * 100; ctx.save(); ctx.translate(bx + 40, by + 30); ctx.rotate((rnd(i) - 0.5) * 0.2); rr(-40, -30, 80, 60, 14); ctx.lineWidth = 8; ctx.strokeStyle = '#C9C9C9'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
export function register(x, y, s = 1) {                                                              // grey checkout desk seen from the cashier's side
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  poly([[-300, 0], [300, 0], [320, 160], [-320, 160]], P.grey); poly([[-120, -150], [200, -170], [230, 0], [-150, 0]], '#8A8A8A');
  rr(-70, -120, 190, 80, 12); ctx.fillStyle = '#A6A6A6'; ctx.fill();
  ctx.restore();
}
export function pile(x, y, s = 1, n = 4, seed = 1) {                                                // grey boxes stacked: what the stock boy was carrying
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < n; i++) { ctx.save(); ctx.translate((rnd(seed + i) - 0.5) * 30, -i * 74); ctx.rotate((rnd(seed + i + 9) - 0.5) * 0.18); rr(-80, -70, 160, 70, 8); ctx.fillStyle = i % 2 ? P.grey : '#868686'; ctx.fill(); ctx.restore(); }
  ctx.restore();
}
export function melon(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 70, 54, 0, 0, TAU); ctx.fillStyle = P.grey; ctx.fill(); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 70 - Math.abs(i) * 6, 54, 0, 1.7, 4.6); ctx.lineWidth = 3; } for (const k of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(-60 * (1 - Math.abs(k)), 40 * k * 1.2); ctx.quadraticCurveTo(0, 54 * (k * 0.3 + 0.1), 60 * (1 - Math.abs(k)), 40 * k * 1.2); ctx.strokeStyle = '#BDBDBD'; ctx.lineWidth = 7; ctx.stroke(); } ctx.restore(); }
export function ice(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-60, -90, 120, 150, 12); ctx.fillStyle = P.grey; ctx.fill(); rr(-48, -60, 96, 70, 8); ctx.fillStyle = '#B0B0B0'; ctx.fill(); ctx.font = '400 38px Hand'; ctx.fillStyle = P.grey; ctx.textAlign = 'center'; ctx.fillText('ICE', 0, -20); ctx.restore(); }
export function cactus(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-26, -140, 52, 150, 26); ctx.fillStyle = P.grey; ctx.fill(); rr(-70, -100, 30, 70, 15); ctx.fill(); rr(40, -120, 30, 70, 15); ctx.fill(); rr(-66, -60, 50, 24, 12); ctx.fill(); rr(16, -78, 50, 24, 12); ctx.fill(); poly([[-44, 6], [44, 6], [36, 60], [-36, 60]], '#8E8E8E'); ctx.restore(); }
/** motion marks: short ink dashes beside something that moves */
export function shakeMarks(x, y, a = 1, s = 1) { ctx.save(); ctx.globalAlpha = a; for (const k of [-1, 1]) for (let i = 0; i < 3; i++) stroke([[x + k * (90 + i * 6) * s, y - 40 + i * 36], [x + k * (130 + i * 6) * s, y - 52 + i * 40]], P.ink, 8); ctx.restore(); }
export function sweatDrop(x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -34); ctx.quadraticCurveTo(26, 6, 0, 24); ctx.quadraticCurveTo(-26, 6, 0, -34); ctx.fillStyle = P.paper; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.stroke(); ctx.restore(); }
