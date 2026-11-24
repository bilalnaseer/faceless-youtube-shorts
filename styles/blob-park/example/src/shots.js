// THE BALLOON: blob-park example. 6 lines → 8 shots. Close-ups = the same wide scene zoomed with K.scene(cx, cy, zoom, fn).
// A shot: { id, at, cam, zoom, note, draw(lt, d, t) }.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, spring, rnd } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.05);
  const mid = (i) => L(i) + (Le(i) - L(i)) * 0.55;
  const BX = 390, OX = 700, SEAT = 1150;
  const COL = ['#EF4B4B', '#FFD92E', '#B57CEF'];
  // three balloons rising from a hand point
  const bunch = (hx, hy, t, lift = 1) => [[-70, -300], [10, -360], [80, -290]].forEach(([dx, dy], i) => K.balloon(hx + dx * lift, hy + dy * lift + Math.sin(t * 2 + i) * 6, 56, COL[i], Math.sin(t * 2 + i) * 0.08, [hx, hy], t));

  // 1 · wide: Bloo with his balloons, Orby asks
  add({ id: 'S01', at: 0, note: 'wide bench, Orby looks up at the balloons', draw(lt, d, t) {
    K.scene(540, 1240, lerp(1.3, 1.4, eio(clamp(lt / d))), () => { K.park(); K.bench();
    K.bloo({ x: BX, y: SEAT, s: 1, eyes: 'sleepy', look: [0.4, 0], arm: 'up', hold: (x, y) => bunch(x, y, lt), t: lt, lean: Math.sin(lt * 1.5) * 0.01 });
    K.orby({ x: OX, y: SEAT, s: 1, eyes: 'open', look: [-0.6, -0.9], mouth: lt > 0.5 ? 'open' : 'smile', t: lt }); });
  } });
  cue(0.4, 'pop', { gain: 0.5 });

  // 2 · close on Bloo: "Okay. Hold it tight."
  add({ id: 'S02', at: cut(1), note: 'close-up Bloo, tired, agrees', draw(lt, d, t) {
    const z = lerp(2.0, 2.15, eio(clamp(lt / d)));
    K.scene(BX + 60, 880, z, () => { K.park(); K.bench();
      K.bloo({ x: BX, y: SEAT, eyes: lt < 0.25 ? 'sleepy' : 'open', look: [0.5, 0.1], mouth: Math.sin(lt * 12) > 0 && lt < d * 0.6 ? 'o' : 'flat', arm: 'up', hold: (x, y) => bunch(x, y, t), t: lt });
      K.orby({ x: OX, y: SEAT, eyes: 'open', look: [-0.5, -0.5], mouth: 'smile', t: lt }); });
  } });
  // 3 · the hand-over
  add({ id: 'S03', at: mid(1), note: 'string passes from tentacle to Orby', draw(lt, d, t) {
    const z = lerp(1.9, 2.1, eio(clamp(lt / d))), k = eo(seg(lt, 0.25, 0.7));
    K.scene(560, 1000, z, () => { K.park(); K.bench();
      const handX = lerp(BX + 250, OX - 40, k), handY = lerp(SEAT - 190, SEAT - 185, k);
      K.bloo({ x: BX, y: SEAT, eyes: 'open', look: [0.9, 0.3], arm: 'out', tip: [lerp(0, 40, k), 0], t: lt });
      K.orby({ x: OX, y: SEAT, eyes: 'wide', look: [-0.5, 0], mouth: 'o', armUp: 1, hands: [[-70, -185], [-10, -185]], t: lt });
      bunch(handX + 10, handY, t, lerp(0.8, 1, k)); });
  } });
  cue(mid(1) + 0.4, 'squeak', { gain: 0.6 });

  // 4 · Orby, delighted, holds the string
  add({ id: 'S04', at: cut(2), note: 'close-up Orby happy, sparkles', draw(lt, d, t) {
    const z = lerp(1.8, 2.0, eio(clamp(lt / d)));
    K.scene(OX, 900, z, () => { K.park(); K.bench();
      K.bloo({ x: BX, y: SEAT, eyes: 'open', look: [0.6, -0.4], arm: 'rest', t: lt });
      K.orby({ x: OX, y: SEAT, eyes: 'happy', mouth: 'grin', armUp: 1, hands: [[-26, -420], [26, -420]], t: lt, squash: 1 + Math.sin(lt * 9) * 0.015 });
      bunch(OX, SEAT - 440, t, 1.05); K.sparkles(OX + 150, 760, 60, clamp(lt * 4), lt); });
  } });
  cue(cut(2) + 0.1, 'sparkle', { dur: 0.7 });

  // 5 · Orby starts to float
  add({ id: 'S05', at: cut(3), note: 'wide: Orby lifts off, Bloo watches', draw(lt, d, t) {
    const u = eio(seg(lt, 0.25, 1.3)), rise = 620 * u, dy = 330 * u;
    ctx.save(); ctx.translate(540, 1240); ctx.scale(1.3, 1.3); ctx.translate(-540, -1240);
    ctx.save(); ctx.translate(0, dy); K.park(0); ctx.restore();                         // sky pans up with him
    ctx.save(); ctx.translate(0, dy); K.bench();
    K.bloo({ x: BX, y: SEAT, eyes: 'wide', look: [0.6, -0.9], mouth: 'o', arm: 'rest', t: lt, squash: 1 + (lt > 0.35 ? Math.sin(lt * 20) * 0.01 : 0) });
    K.orby({ x: OX, y: SEAT - rise, eyes: 'happy', mouth: 'open', armUp: 1, hands: [[-26, -420], [26, -420]], dangle: 6, t: lt });
    bunch(OX, SEAT - rise - 440, t, 1.05);
    ctx.restore(); ctx.restore();
  } });
  cue(cut(3), 'whoosh', { gain: 0.6 }); cue(cut(3) + 0.2, 'giggle', { gain: 0.7 });

  // 6 · up in the sky
  add({ id: 'S06', at: cut(3) + 1.3, note: 'sky: Orby small and high with the balloons', draw(lt, d, t) {
    const dy = 1500 + lt * 30; ctx.save(); ctx.translate(540, 1240); ctx.scale(1.3, 1.3); ctx.translate(-540, -1240); K.park(dy);
    K.cloud(120 + lt * 12, 360, 1.4); K.cloud(700 - lt * 10, 900, 1.1); K.cloud(380, 1250, 0.9);
    ctx.save(); ctx.translate(0, dy);
    K.orby({ x: 640 + Math.sin(lt * 2) * 24, y: -640 - lt * 30, s: 0.8, eyes: 'happy', mouth: 'grin', armUp: 1, hands: [[-26, -420], [26, -420]], dangle: 8, t: lt });
    bunch(640 + Math.sin(lt * 2) * 24, -640 - lt * 30 - 330, t, 0.9);
    K.bird(180, 700 - dy + 1100, 1, t); ctx.restore(); ctx.restore();
  } });

  // 7 · Bloo: "I said hold it."
  add({ id: 'S07', at: cut(4), note: 'close-up Bloo, annoyed, looking up', draw(lt, d, t) {
    const z = lerp(2.0, 2.2, eio(clamp(lt / d)));
    K.scene(BX + 40, 880, z, () => { K.park(); K.bench();
      K.bloo({ x: BX, y: SEAT, eyes: 'angry', look: [0.3, -0.8], mouth: lt < 0.8 ? 'grit' : 'flat', arm: 'rest', t: lt }); });
  } });
  cue(cut(4), 'zip', { gain: 0.5 });

  // 8 · wide, empty bench, a speck in the sky
  add({ id: 'S08', at: cut(5), note: 'wide: Bloo alone, Orby a speck above', draw(lt, d, t) {
    ctx.save(); ctx.translate(540, 1240); ctx.scale(1.3, 1.3); ctx.translate(-540, -1240); K.park(); K.bench();
    K.bloo({ x: BX, y: SEAT, eyes: lt < d * 0.45 ? 'open' : 'sleepy', look: [0.5, -0.9], mouth: 'flat', arm: 'rest', t: lt });
    const sx = 760 + lt * 10, sy = 470 - lt * 14;
    K.orby({ x: sx, y: sy + 70, s: 0.14, eyes: 'happy', mouth: 'grin', armUp: 1, hands: [[-26, -420], [26, -420]], t: lt }); bunch(sx, sy + 70 - 60, t, 0.15); ctx.restore();
  } });
  cue(cut(5) + 0.9, 'wah', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
