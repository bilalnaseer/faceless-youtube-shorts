// Boot: style fonts → script.json + timing → captions → shots. draw(t) renders film time t (a pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots(), captions().
import { W, H, setCtx, ctx, clamp, eo, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { STYLE } from './core/style.js';
import { buildCaptions, drawCaption, captionList, drawOverlay } from './core/captions.js';
import { buildShots } from './shots.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.fillStyle = STYLE.clear; ctx.fillRect(0, 0, W, H);
  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at, lt = t - sh.at;
  // camera: optional punch-in on the cut + a slow push across the shot
  const punch = 1 + (STYLE.punch || 0) * (1 - eo(clamp(lt / 0.3)));
  const drift = 1 + (sh.zoom ?? STYLE.zoom ?? 0.04) * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [540, 900];
  ctx.save(); ctx.translate(cx, cy); ctx.scale(punch * drift, punch * drift); ctx.translate(-cx, -cy);
  sh.draw(lt, d, t, sh);
  ctx.restore();
  ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  drawCaption(t, sh, lt);                       // the style's text layer (bubble / subtitle / hand-lettered line)
  drawOverlay(t);                               // watermark, title, etc.
  // fade OUT only: the first frame is the video's thumbnail, so it must be a full picture
  if (STYLE.fade) { const f = clamp((T.dur - t) / 0.3); if (f < 1) { ctx.fillStyle = STYLE.fade; ctx.globalAlpha = 1 - f; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } }
}

(async () => {
  try {
    for (const f of STYLE.fonts) { const ff = new FontFace(f.family, `url(${f.file})`, { weight: String(f.weight || 400) }); document.fonts.add(await ff.load()); }
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    buildCaptions(script);
    const { shots, cues } = buildShots();
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script;
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.text }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
