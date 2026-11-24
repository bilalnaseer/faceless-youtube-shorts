// Marker Sketch text layer: a fixed red two-line title at the top ("head": "LINE ONE|LINE TWO" in script.json) and, under it,
// a small black subtitle that changes with the line (`say`, else `text`, upper-cased). Subtitle stays until the next line.
import { ctx, W, clamp, lerp, seg, eob, grad, H } from './lib.js';
import { T } from './timing.js';

let caps = [], head = ['', ''];
export function buildCaptions(script) {
  head = (script.head || script.title || '').split('|');
  caps = script.lines.map((ln, i) => ({ line: i, s: T.lines[i].start - 0.03, text: String(ln.say ?? ln.text).toUpperCase(), nosub: !!ln.nosub }));
  caps.forEach((c, k) => { c.e = caps[k + 1] ? caps[k + 1].s : T.dur; });
  return caps;
}
export const captionList = () => caps;
export function drawCaption(t) {
  // title
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#E3280F';
  ctx.font = '700 96px Oswald'; ctx.letterSpacing = '1px';
  const fit = (s, mw) => { const w = ctx.measureText(s).width; return w > mw ? mw / w : 1; };
  head.forEach((h, i) => { const k = fit(h, 960); ctx.save(); ctx.translate(540, 112 + i * 92); ctx.scale(k, k); ctx.fillText(h, 0, 0); ctx.restore(); });
  ctx.letterSpacing = '0px';
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c || c.nosub) return;
  const lt = t - c.s, sc = lt < 0.15 ? lerp(0.85, 1, eob(seg(lt, 0, 0.15))) : 1;
  ctx.save(); ctx.translate(540, 286); ctx.scale(sc, sc); ctx.fillStyle = '#111'; ctx.font = '400 58px Bangers'; ctx.letterSpacing = '2px'; ctx.textBaseline = 'alphabetic';
  const w = ctx.measureText(c.text).width, k = w > 960 ? 960 / w : 1; ctx.scale(k, k); ctx.fillText(c.text, 0, 0); ctx.restore(); ctx.letterSpacing = '0px';
}
export function drawOverlay() {
  // soft white fade at the bottom: the picture dissolves into the page
  ctx.fillStyle = grad(0, 1560, 0, 1730, [[0, 'rgba(255,255,255,0)'], [1, '#fff']]); ctx.fillRect(0, 1560, W, H - 1560);
}
