// Kawaii Skit text layer: the speech bubble IS the caption. Each line shows its `say` (or `text`) in a cream bubble
// near the top (white outline, black Fredoka). Line options: "bub": { x, y, tx, ty, c } = bubble centre, tail tip, colour
// ('cream' default | 'orange' for shouts) · "nobub": true hides it. A bubble stays until the next line's bubble.
import { ctx, clamp, lerp, seg, eob, rr } from './lib.js';
import { T } from './timing.js';

const COL = { cream: ['#F4D58A', '#FFFFFF'], orange: ['#EB6420', '#FFFFFF'], pink: ['#FF9FB5', '#FFFFFF'], mint: ['#A8EBD0', '#FFFFFF'], white: ['#FFFFFF', '#2B1A12'] };
let caps = [];
export function buildCaptions(script) {
  caps = [];
  script.lines.forEach((ln, i) => {
    if (ln.nobub) return;
    const l = T.lines[i]; if (!l) return;
    caps.push({ line: i, hold: ln.hold ?? 0.5, s: l.start - 0.04, text: ln.say ?? ln.text, b: Object.assign({ x: 540, y: 200, tx: 540, ty: 390, c: 'cream' }, ln.bub || {}) });
  });
  caps.forEach((c, k) => { const nx = caps[k + 1]; c.e = nx ? nx.s : T.dur; if (!nx || nx.s - T.lines[c.line].end > 0.8) c.e = Math.min(c.e, T.lines[c.line].end + c.hold); });
  return caps;
}
export const captionList = () => caps;

export function bubble(text, x, y, tx, ty, color = 'cream', size = 104, sc = 1) {
  const [fill, edge] = COL[color] || COL.cream; const ink = color === 'white' ? '#2B1A12' : '#1B1008';
  ctx.save(); ctx.font = `600 ${size}px Fredoka`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let fs = size; let w = ctx.measureText(text).width; if (w > 820) { fs = size * 820 / w; ctx.font = `600 ${fs}px Fredoka`; w = 820; }
  const bw = w + 120, bh = fs * 1.15 + 70;
  ctx.translate(tx, ty); ctx.scale(sc, sc); ctx.translate(-tx, -ty);          // pop from the tail tip
  // tail (drawn first so the body covers its root)
  const bx = x + clamp((tx - x) * 0.35, -bw * 0.28, bw * 0.28), by = y + bh / 2 - 6;
  const tail = () => { ctx.beginPath(); ctx.moveTo(bx - 34, by - 14); ctx.quadraticCurveTo(bx - 4, by + 40, tx, ty); ctx.quadraticCurveTo(bx + 14, by + 36, bx + 40, by - 14); ctx.closePath(); };
  ctx.lineJoin = 'round'; ctx.lineWidth = 22; ctx.strokeStyle = edge; tail(); ctx.stroke(); ctx.fillStyle = fill;
  ctx.beginPath(); ctx.ellipse(x, y, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.lineWidth = 22; ctx.strokeStyle = edge; ctx.stroke();
  tail(); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.fill();
  tail(); ctx.fill(); ctx.fillStyle = ink; ctx.fillText(text, x, y + fs * 0.04);
  ctx.restore();
}
export function drawCaption(t) {
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c) return;
  const lt = t - c.s; const sc = lt < 0.22 ? lerp(0.55, 1, eob(seg(lt, 0, 0.22))) : 1;
  ctx.globalAlpha = clamp(lt / 0.06);
  bubble(c.text, c.b.x, c.b.y, c.b.tx, c.b.ty, c.b.c, c.b.size || 104, sc);
  ctx.globalAlpha = 1;
}
export function drawOverlay() {}
