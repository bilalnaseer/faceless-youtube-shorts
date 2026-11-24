// Blob Park text layer: small hand-lettered ALL-CAPS line near the top, coloured by who speaks (script "colors": { who: "#hex" }),
// no bubble. A line stays on screen until the next line begins. "nosub": true hides it. Handle watermark bottom-left ("handle").
import { ctx, W, H, clamp, lerp, seg, eob } from './lib.js';
import { T } from './timing.js';

let caps = [], colors = {}, handle = '';
export function buildCaptions(script) {
  colors = Object.assign({ default: '#2C8FA3' }, script.colors || {}); handle = script.handle || '';
  caps = [];
  script.lines.forEach((ln, i) => { if (ln.nosub) return; caps.push({ line: i, s: T.lines[i].start - 0.04, text: String(ln.say ?? ln.text).toUpperCase(), col: colors[ln.who] || colors.default, y: ln.y ?? 150 }); });
  caps.forEach((c, k) => { const nx = caps[k + 1]; c.e = nx ? nx.s : T.dur; if (!nx || nx.s - T.lines[c.line].end > 0.8) c.e = Math.min(c.e, T.lines[c.line].end + 0.6); });
  return caps;
}
export const captionList = () => caps;
export function drawCaption(t) {
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c) return;
  const lt = t - c.s, a = clamp(lt / 0.08), sc = lt < 0.18 ? lerp(0.9, 1, eob(seg(lt, 0, 0.18))) : 1;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, c.y); ctx.scale(sc, sc);
  ctx.font = '400 90px Hand'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '1px';
  const w = ctx.measureText(c.text).width * 0.82, k = Math.min(1, 940 / w); ctx.scale(0.82 * k, k);
  ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.strokeText(c.text, 0, 0);
  ctx.fillStyle = c.col; ctx.fillText(c.text, 0, 0); ctx.restore(); ctx.letterSpacing = '0px';
}
export function drawOverlay() {
  if (!handle) return;
  ctx.save(); ctx.font = '400 38px Hand'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = 'rgba(70,60,20,.55)'; ctx.fillText(handle.toUpperCase(), 40, H - 120); ctx.restore();
}
