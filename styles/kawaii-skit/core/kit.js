// Kawaii Skit kit: thick-outlined chibi animals in saturated flat rooms. Everything: flat fills, ONE 8 px black outline,
// a lighter highlight shape, no gradients. Import as `* as K`.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, spring, rnd, wob, circle, ell, rr, poly, blob, blobPath, limb, stroke, fillAll, at } from './lib.js';

export const P = {
  ink: '#1B1008', stripeA: '#FBDA84', stripeB: '#F6C96C', wallDeep: '#F2B467', pink: '#F9C4C4', pinkTile: '#F4AFB0', floorLine: '#FFE3E3',
  teal: '#2A97A0', tealDark: '#1F7C86', white: '#FFFFFF', cream: '#F8D98C', fur: '#F1A25A', furDark: '#7B4A22', furBelly: '#A9703A',
  cheek: '#C8643A', earIn: '#F59AAF', mint: '#9FE8C8', mintDark: '#6FCBA6', maroon: '#4B1624', red: '#D3262B', purple: '#B63CC4', purpleDark: '#8B2A98',
  cab: '#DD5A38', cabDark: '#B8452A', glass: '#CFE0FA', glass2: '#A9C4F0', flour: '#FFFFFF', flourShade: '#E8E2F2', pinkSkin: '#F7B7B0', pinkDeep: '#EE9A98',
};
export const OL = 8;                                           // the outline weight
const o = (fill) => { if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.lineJoin = 'round'; ctx.stroke(); };

// ───────── backgrounds ─────────
export function wallpaper(y0 = -400, y1 = 1300, x0 = -400, x1 = W + 400) {
  fillAll(P.stripeA);
  ctx.fillStyle = P.stripeB; for (let x = x0 - 60; x < x1; x += 160) ctx.fillRect(x, y0, 80, y1 - y0);
}
function floorTiles(y, vx = 540) {
  ctx.fillStyle = P.pink; ctx.fillRect(-400, y, W + 800, H - y + 400);
  ctx.strokeStyle = P.floorLine; ctx.lineWidth = 6;
  for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(vx + i * 60, y); ctx.lineTo(vx + i * 230, H + 300); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { const yy = y + Math.pow(k / 5, 1.7) * (H + 300 - y); ctx.beginPath(); ctx.moveTo(-400, yy); ctx.lineTo(W + 400, yy); ctx.stroke(); }
}
/** hallway: striped wall, a white-framed doorway at the middle with a view into the next room, an open teal door, pink tiles. */
export function hall(opts = {}) {
  const { floorY = 1240, doorX = 330, doorW = 440, doorTop = 330, swing = 1 } = opts;
  wallpaper(-400, floorY + 6); floorTiles(floorY);
  ctx.fillStyle = '#F7B684'; ctx.fillRect(-400, floorY - 28, W + 800, 28);                         // skirting
  // light switch on the wall
  rr(26, 860, 54, 96, 10); ctx.fillStyle = P.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#E4D2B8'; ctx.stroke();
  rr(40, 884, 26, 18, 4); ctx.fillStyle = '#E4D2B8'; ctx.fill(); rr(40, 914, 26, 18, 4); ctx.fill();
  // doorway: white frame, view of an orange room beyond
  rr(doorX - 36, doorTop - 36, doorW + 72, floorY - doorTop + 36, 8); ctx.fillStyle = P.white; ctx.fill();
  ctx.fillStyle = '#F4A862'; ctx.fillRect(doorX, doorTop, doorW, floorY - doorTop);
  ctx.fillStyle = '#EFA05C'; for (let x = doorX + 20; x < doorX + doorW; x += 110) ctx.fillRect(x, doorTop, 50, floorY - doorTop);
  ctx.fillStyle = '#F7B7B7'; ctx.fillRect(doorX, floorY - 150, doorW, 150);                             // far floor
  ctx.fillStyle = '#F5D9C6'; ctx.fillRect(doorX, floorY - 170, doorW, 22);
  // open door, hinged on the right, seen at an angle (teal slab with two inset panels)
  const dx = doorX + doorW + 36;
  poly([[dx, doorTop - 36], [dx + 250 * swing, doorTop - 120], [dx + 250 * swing, floorY + 60], [dx, floorY]], P.teal, P.ink, OL);
  poly([[dx + 30 * swing, doorTop + 20], [dx + 200 * swing, doorTop - 40], [dx + 200 * swing, doorTop + 330], [dx + 30 * swing, doorTop + 380]], P.tealDark, null);
  poly([[dx + 30 * swing, doorTop + 500], [dx + 200 * swing, doorTop + 520], [dx + 200 * swing, floorY - 10], [dx + 30 * swing, floorY - 50]], P.tealDark, null);
  circle(dx + 12, floorY - 380, 22, '#FFD866', P.ink, 6);                                                 // knob
  return { floorY, doorX, doorW, doorTop };
}
/** kitchen wall for the mess scenes: cabinets, a window, stripes, tiled floor. */
export function kitchen(opts = {}) {
  const { floorY = 1300 } = opts;
  wallpaper(-400, floorY + 6); floorTiles(floorY, 700);
  rr(-80, -80, 360, 520, 0); ctx.fillStyle = P.cab; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke();
  rr(-60, 340, 320, 70, 0); ctx.fillStyle = P.cabDark; ctx.fill();
  rr(380, 60, 560, 620, 22); ctx.fillStyle = P.white; ctx.fill(); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke();       // window frame
  rr(410, 90, 500, 560, 12); ctx.fillStyle = P.glass; ctx.fill();
  poly([[410, 90], [560, 90], [410, 400]], P.glass2); poly([[690, 90], [910, 90], [910, 260], [560, 650], [410, 650]], P.glass2);
  ctx.fillStyle = P.white; ctx.fillRect(650, 90, 36, 560);
  ctx.fillStyle = '#F7B684'; ctx.fillRect(-400, floorY - 28, W + 800, 28);
  return { floorY };
}
// ───────── characters ─────────
const EYES = {
  chill(x, y, s) {                  // heavy-lidded black ovals (flat top lid), tiny highlight
    ctx.beginPath(); ctx.ellipse(x, y, 34 * s, 28 * s, 0, 0, TAU); ctx.fillStyle = P.ink; ctx.fill();
    ctx.fillStyle = P.cream; ctx.fillRect(x - 40 * s, y - 40 * s, 80 * s, 30 * s); ctx.fillStyle = P.ink; ctx.fillRect(x - 38 * s, y - 14 * s, 76 * s, 7 * s);
    circle(x + 10 * s, y + 6 * s, 6 * s, '#fff');
  },
  wide(x, y, s, look = 0) {         // giant white eyes with tiny pupils
    ell(x, y, 38 * s, 46 * s, '#fff', P.ink, 7); circle(x + look * 8, y + 4 * s, 8 * s, P.ink);
  },
  happy(x, y, s) { ctx.beginPath(); ctx.arc(x, y + 10 * s, 28 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 9; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); },
  closed(x, y, s) { ctx.beginPath(); ctx.arc(x, y - 6 * s, 28 * s, Math.PI * 0.12, Math.PI * 0.88); ctx.lineWidth = 9; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); },
  dot(x, y, s) { ell(x, y, 17 * s, 22 * s, P.ink); circle(x + 5 * s, y - 7 * s, 6 * s, '#fff'); },
  sparkle(x, y, s) { ell(x, y, 30 * s, 36 * s, P.ink); circle(x + 8 * s, y - 10 * s, 10 * s, '#fff'); circle(x - 9 * s, y + 10 * s, 5 * s, '#fff'); },
  dizzy(x, y, s, t = 0) { ell(x, y, 30 * s, 30 * s, '#fff', P.ink, 6); ctx.beginPath(); for (let a = 0; a < 12; a += 0.4) { const r = a * 2.2 * s; ctx.lineTo(x + Math.cos(a + t * 8) * r, y + Math.sin(a + t * 8) * r); } ctx.lineWidth = 5; ctx.strokeStyle = P.ink; ctx.stroke(); },
};
/** MOCHI, the fox-pup hero. Origin = bottom centre of the feet; ~420 px tall at s=1.
 *  opts: x y s flip · eyes 'chill'|'wide'|'happy'|'closed'|'dot'|'sparkle'|'dizzy' · mouth 'cat'|'o'|'open'|'smile'|'flat'
 *        armL armR (angle rad, 0 = hanging, up = negative for the right arm) · hold(x, y) draws a prop AT the right hand
 *        tail (swing -1..1) · hair true · bob (px) · look (-1..1) · squash (1 = normal) · t (time, for dizzy/idle) */
export function mochi(op = {}) {
  const { x = 540, y = 1100, s = 1, flip = false, eyes = 'chill', mouth = 'cat', armL = 0.3, armR = -0.3, tail = 0, hair = true, bob = 0, look = 0, squash = 1, t = 0, hold = null, holdL = null, tilt = 0 } = op;
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(tilt); ctx.scale((flip ? -1 : 1) * s, s * squash);
  // tail: striped, behind the body
  ctx.save(); ctx.translate(74, -76); ctx.rotate(-0.5 + tail * 0.35);
  ctx.beginPath(); ctx.ellipse(70, -6, 112, 46, 0, 0, TAU); ctx.fillStyle = P.fur; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = P.furDark; for (let k = 0; k < 4; k++) { const bx = -10 + k * 48; ctx.beginPath(); ctx.moveTo(bx, -50); ctx.lineTo(bx + 30, 0); ctx.lineTo(bx, 50); ctx.lineTo(bx + 20, 50); ctx.lineTo(bx + 50, 0); ctx.lineTo(bx + 20, -50); ctx.closePath(); ctx.fill(); }
  ctx.restore(); ctx.beginPath(); ctx.ellipse(70, -6, 112, 46, 0, 0, TAU); ctx.lineWidth = OL; ctx.strokeStyle = P.ink; ctx.stroke();
  ctx.restore();
  // legs
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 40, -26, 32, 28, 0, 0, TAU); o(P.furDark); }
  // body
  ctx.beginPath(); ctx.ellipse(0, -118, 82, 84, 0, 0, TAU); o(P.furDark);
  ctx.beginPath(); ctx.ellipse(-26, -150, 20, 36, 0.4, 0, TAU); ctx.fillStyle = '#946033'; ctx.fill();                       // highlight
  // arms (left = viewer's left)
  const arm = (sx, ang, prop) => {
    const sh = [sx * 70, -150], L = 74, hx = sh[0] + Math.sin(ang) * L * sx * -1 + sx * 6, hy = sh[1] + Math.cos(ang) * L;
    const hand = [sx > 0 ? sh[0] + Math.sin(-ang) * L : sh[0] - Math.sin(ang) * L, sh[1] + Math.cos(ang) * L];
    limb(sh, hand, -sx * 8, 40, P.furDark, P.ink, 6); circle(hand[0], hand[1], 24, P.furDark, P.ink, 6);
    if (prop) prop(hand[0], hand[1]);
    return hand;
  };
  arm(-1, armL, holdL); arm(1, -armR * -1 > 0 ? armR : armR, hold);
  // head
  const hy = -262, bobH = Math.sin(t * 3) * 0;
  for (const sx of [-1, 1]) {                                                                                                   // ears
    ctx.save(); ctx.translate(sx * 82, hy - 78); ctx.rotate(sx * 0.38);
    ctx.beginPath(); ctx.moveTo(-44, 30); ctx.quadraticCurveTo(-40, -62, 4, -64); ctx.quadraticCurveTo(50, -50, 46, 30); ctx.closePath(); o(P.furDark);
    ctx.beginPath(); ctx.moveTo(-24, 22); ctx.quadraticCurveTo(-22, -34, 6, -40); ctx.quadraticCurveTo(30, -30, 28, 22); ctx.closePath(); ctx.fillStyle = P.white; ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, 0, 15, 24, 0, 0, TAU); ctx.fillStyle = P.earIn; ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(0, hy, 124, 100, 0, 0, TAU); o(P.cream);
  for (const sx of [-1, 1]) {                                                                                                   // white cheek tufts
    ctx.beginPath(); ctx.moveTo(sx * 106, hy - 28); ctx.lineTo(sx * 156, hy - 10); ctx.lineTo(sx * 118, hy + 8); ctx.lineTo(sx * 148, hy + 36); ctx.lineTo(sx * 96, hy + 52); ctx.closePath(); o(P.white);
    ctx.beginPath(); ctx.moveTo(sx * 72, hy + 22); ctx.quadraticCurveTo(sx * 66, hy + 54, sx * 52, hy + 70); ctx.lineWidth = 9; ctx.strokeStyle = P.cheek; ctx.lineCap = 'round'; ctx.stroke();   // tear marks
  }
  ctx.beginPath(); ctx.ellipse(0, hy + 44, 60, 40, 0, 0, TAU); ctx.fillStyle = P.white; ctx.fill();                              // muzzle patch
  if (hair) {                                                                                                                   // golden fringe
    ctx.beginPath(); ctx.moveTo(-96, hy - 40); ctx.quadraticCurveTo(-90, hy - 118, -10, hy - 108); ctx.quadraticCurveTo(70, hy - 120, 100, hy - 40);
    ctx.quadraticCurveTo(70, hy - 74, 28, hy - 50); ctx.quadraticCurveTo(10, hy - 80, -18, hy - 54); ctx.quadraticCurveTo(-50, hy - 74, -96, hy - 40); ctx.closePath(); o('#F2BC5E');
    ctx.beginPath(); ctx.moveTo(-60, hy - 80); ctx.quadraticCurveTo(-20, hy - 100, 30, hy - 92); ctx.lineWidth = 7; ctx.strokeStyle = '#FBDD9A'; ctx.stroke();
  }
  // face
  const ex = 54, ey = hy + 2;
  const E = EYES[eyes] || EYES.chill; E(-ex + look * 4, ey, 1, t); E(ex + look * 4, ey, 1, t);
  if (eyes === 'wide') { ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * ex - 28, ey - 64); ctx.quadraticCurveTo(sx * ex, ey - 82, sx * ex + 28, ey - 62); ctx.stroke(); } }
  ell(0, hy + 34, 14, 10, P.ink); circle(-3, hy + 31, 3.5, '#fff');                                                               // nose
  const my = hy + 62;
  if (mouth === 'cat') { ctx.beginPath(); ctx.moveTo(-18, my - 14); ctx.quadraticCurveTo(-9, my + 8, 0, my - 6); ctx.quadraticCurveTo(9, my + 8, 18, my - 14); ctx.lineWidth = 6; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (mouth === 'o') { ell(0, my + 8, 22, 32, '#4A1620', P.ink, 6); ell(0, my + 22, 14, 10, '#E8727E'); }
  else if (mouth === 'open') { ctx.beginPath(); ctx.moveTo(-40, my - 10); ctx.quadraticCurveTo(0, my + 12, 40, my - 10); ctx.quadraticCurveTo(34, my + 56, 0, my + 56); ctx.quadraticCurveTo(-34, my + 56, -40, my - 10); ctx.closePath(); o('#4A1620'); ell(0, my + 40, 20, 12, '#E8727E'); }
  else if (mouth === 'smile') { ctx.beginPath(); ctx.arc(0, my - 22, 28, Math.PI * 0.15, Math.PI * 0.85); ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); }
  else { stroke([[-20, my], [20, my]], P.ink, 7); }
  ctx.restore();
}
/** BISCUIT, the cream pup. Origin = bottom centre. flour 0..1 dusts it white. opts: x y s eyes ('dot'|'wide'|'happy'|'closed'|'sparkle') mouth ('w'|'o'|'open') arm (whisk raise) hold(x,y) */
export function biscuit(op = {}) {
  const { x = 540, y = 1100, s = 1, flip = false, eyes = 'dot', mouth = 'w', flour = 0, bob = 0, hold = null, armR = -0.9, armL = 0.5, squash = 1, t = 0, look = 0 } = op;
  const body = flour > 0.5 ? P.flour : '#F8E4C0', shade = flour > 0.5 ? P.flourShade : '#E9CFA0';
  ctx.save(); ctx.translate(x, y + bob); ctx.scale((flip ? -1 : 1) * s, s * squash);
  ctx.save(); ctx.translate(-92, -70); ctx.rotate(0.5 + Math.sin(t * 14) * 0.25); ctx.beginPath(); ctx.ellipse(-22, 0, 36, 20, 0, 0, TAU); o(body); ctx.restore();   // wagging tail
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 48, -22, 36, 26, 0, 0, TAU); o(body); }
  ctx.beginPath(); ctx.ellipse(0, -120, 100, 96, 0, 0, TAU); o(body);
  ctx.beginPath(); ctx.ellipse(0, -80, 66, 56, 0, 0, TAU); ctx.fillStyle = shade; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1;
  const arm = (sx, ang, prop) => { const sh = [sx * 78, -140], hand = [sh[0] + Math.sin(sx * ang) * 70 + sx * 10, sh[1] + Math.cos(ang) * 64]; limb(sh, hand, 0, 36, body, P.ink, 6); circle(hand[0], hand[1], 22, body, P.ink, 6); if (prop) prop(hand[0], hand[1]); };
  arm(-1, armL); arm(1, armR, hold);
  // head
  const hy = -270;
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 112, hy - 22); ctx.rotate(sx * (0.35 + Math.sin(t * 5 + sx) * 0.05)); ctx.beginPath(); ctx.ellipse(0, 30, 40, 78, 0, 0, TAU); o(flour > 0.5 ? P.flourShade : '#C98A52'); ctx.restore(); }
  ctx.beginPath(); ctx.ellipse(0, hy, 128, 108, 0, 0, TAU); o(body);
  ctx.beginPath(); ctx.ellipse(0, hy + 46, 62, 44, 0, 0, TAU); ctx.fillStyle = shade; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1;
  const E = EYES[eyes] || EYES.dot; E(-52 + look * 4, hy - 4, 1, t); E(52 + look * 4, hy - 4, 1, t);
  ell(0, hy + 34, 20, 15, P.ink); circle(-5, hy + 29, 5, '#fff');
  const my = hy + 60;
  if (mouth === 'w') { ctx.beginPath(); ctx.moveTo(-30, my - 8); ctx.quadraticCurveTo(-15, my + 20, 0, my - 4); ctx.quadraticCurveTo(15, my + 20, 30, my - 8); ctx.lineWidth = 6; ctx.strokeStyle = P.ink; ctx.lineCap = 'round'; ctx.stroke(); }
  else if (mouth === 'o') { ell(0, my + 6, 20, 28, '#4A1620', P.ink, 6); }
  else { ctx.beginPath(); ctx.moveTo(-38, my - 8); ctx.quadraticCurveTo(0, my + 14, 38, my - 8); ctx.quadraticCurveTo(30, my + 50, 0, my + 50); ctx.quadraticCurveTo(-30, my + 50, -38, my - 8); ctx.closePath(); o('#4A1620'); ell(0, my + 34, 18, 11, '#E8727E'); }
  if (flour > 0) { for (let i = 0; i < 26; i++) { const a = rnd(i) * TAU, r = Math.sqrt(rnd(i + 40)) * 112; ctx.globalAlpha = clamp(flour * 1.4 - 0.2); circle(Math.cos(a) * r, hy + Math.sin(a) * r * 0.85, 4 + rnd(i + 9) * 9, '#fff', P.flourShade, 2); } ctx.globalAlpha = 1; }
  ctx.restore();
}
/** full-screen close-up of Biscuit's flour-covered face (the "Bald." beat). pose 0..1 settles, sparkle on the dome. */
export function faceClose(op = {}) {
  const { x = 540, y = 1180, s = 3, flour = 1, eyes = 'dot', mouth = 'w', t = 0, shine = 0 } = op;
  biscuit({ x, y: y + 270 * s, s, flour, eyes, mouth, t, armR: -0.2, armL: 0.2 });
  if (shine > 0) sparkle(x - 90 * s, y - 100 * s, 120 * shine, shine);
}
// ───────── props & fx ─────────
export function sparkle(x, y, r, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = a; ctx.beginPath();
  ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0); ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r); ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0); ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r);
  ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
export function groceryBag(x, y, s = 1, rot = 0) {                                    // the mint bag she carries (centre = hand)
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-52, -30, 104, 80, 24); o(P.mint); rr(-40, -22, 40, 56, 16); ctx.fillStyle = '#C9F5E2'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-34, -30); ctx.quadraticCurveTo(0, -78, 34, -30); ctx.lineWidth = 9; ctx.strokeStyle = P.ink; ctx.stroke();
  ctx.restore();
}
export function whisk(x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-10, -10, 20, 90, 10); o('#8A5A3A');
  ctx.beginPath(); ctx.ellipse(0, -62, 26, 56, 0, 0, TAU); ctx.lineWidth = 7; ctx.strokeStyle = P.ink; ctx.stroke(); ctx.fillStyle = '#E8EEF5'; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.ellipse(0, -62, 11, 56, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
export function egg(x, y, s = 1, rot = 0, cracked = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (!cracked) { ctx.beginPath(); ctx.ellipse(0, 0, 26, 34, 0, 0, TAU); o('#FFF4E6'); }
  else { ctx.beginPath(); ctx.ellipse(0, 6, 44, 20, 0, 0, TAU); o('#fff'); ell(0, 4, 17, 13, '#FFC83D', P.ink, 5); }
  ctx.restore();
}
/** soft cartoon flour puff: overlapping circles that grow and fade. u = 0..1 age. */
export function puff(x, y, r, u, a = 1) {
  const e = eo(clamp(u)); ctx.save(); ctx.globalAlpha = a * (1 - clamp((u - 0.55) / 0.45));
  for (let i = 0; i < 7; i++) { const an = i / 7 * TAU + rnd(i) * 0.6, d = r * (0.4 + 0.5 * e) * (0.7 + rnd(i + 3) * 0.5); circle(x + Math.cos(an) * d, y + Math.sin(an) * d * 0.8 - e * r * 0.3, r * (0.5 + rnd(i + 7) * 0.3) * (0.6 + 0.6 * e), '#fff', '#E3DDEE', 5); }
  circle(x, y - e * r * 0.2, r * 0.7 * (0.6 + 0.5 * e), '#fff', '#E3DDEE', 5); ctx.restore();
}
export function flourSack(x, y, s = 1, rot = 0, spill = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-96, -120); ctx.quadraticCurveTo(-124, 0, -104, 108); ctx.quadraticCurveTo(0, 138, 104, 108); ctx.quadraticCurveTo(124, 0, 96, -120); ctx.quadraticCurveTo(0, -150, -96, -120); ctx.closePath(); o('#EBD7B0');
  ctx.beginPath(); ctx.moveTo(-80, -130); ctx.quadraticCurveTo(-60, -176, -20, -150); ctx.quadraticCurveTo(0, -190, 30, -152); ctx.quadraticCurveTo(70, -176, 84, -130); ctx.quadraticCurveTo(0, -112, -80, -130); ctx.closePath(); o('#D9C08F');
  rr(-60, -50, 120, 96, 16); ctx.fillStyle = P.red; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = P.ink; ctx.stroke();
  ctx.font = '600 46px Fredoka'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText('FLOUR', 0, -2);
  if (spill) { ctx.beginPath(); ctx.moveTo(-60, 104); ctx.quadraticCurveTo(0, 150 + 50 * spill, 60, 104); ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
}
export function stool(x, y, s = 1) {                                                   // purple step stool, origin = bottom centre
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 120, -150); ctx.lineTo(sx * 160, 0); ctx.lineTo(sx * 120, 0); ctx.lineTo(sx * 90, -150); ctx.closePath(); o(P.purpleDark); }
  rr(-150, -190, 300, 50, 16); o(P.purple); rr(-130, -176, 120, 14, 7); ctx.fillStyle = '#D77AE0'; ctx.fill();
  rr(-134, -90, 268, 26, 8); o(P.purple);
  ctx.restore();
}
export function exclaim(x, y, s = 1, a = 1) { ctx.save(); ctx.globalAlpha = a; for (const k of [-1, 0, 1]) { const an = -Math.PI / 2 + k * 0.6; stroke([[x + Math.cos(an) * 60 * s, y + Math.sin(an) * 60 * s], [x + Math.cos(an) * 120 * s, y + Math.sin(an) * 120 * s]], P.ink, 9); } ctx.restore(); }
export function sweat(x, y, s = 1, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(24, 6, 0, 22); ctx.quadraticCurveTo(-24, 6, 0, -30); o('#9FD8F5'); ctx.restore(); }
export function speedLines(cx, cy, a = 1, n = 18, r0 = 520, r1 = 1300) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const an = i / n * TAU + rnd(i) * 0.2, k = 0.75 + rnd(i + 5) * 0.25; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0 * k, cy + Math.sin(an) * r0 * k); ctx.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1); ctx.stroke(); } ctx.restore(); }
/** big dark foreground shape for the "something huge in front of the camera" shots (a sack seen from behind, cropped). */
export function fgHulk(x, y, s = 1, color = P.maroon, accent = P.red) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-700, -520); ctx.quadraticCurveTo(-180, -640, 200, -420); ctx.quadraticCurveTo(420, -260, 380, 0); ctx.quadraticCurveTo(300, 260, -700, 420); ctx.closePath(); o(color);
  ctx.beginPath(); ctx.moveTo(-700, -420); ctx.quadraticCurveTo(-220, -520, 120, -330); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.stroke();
  poly([[-600, -80], [-120, -210], [-60, 20], [-540, 190]], accent, P.ink, OL);
  ctx.restore();
}
