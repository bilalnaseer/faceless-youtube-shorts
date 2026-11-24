// SHOPPING RIGHT BEFORE CLOSING: marker-sketch example. 5 lines → 8 shots. Item lines alternate customer shot → cashier shot
// (with the stock boy losing it behind her). A shot: { id, at, cam, zoom, note, draw(lt, d, t) }.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.05);
  const mid = (i) => L(i) + (Le(i) - L(i)) * 0.62;                       // the cut to the cashier, partway through the line

  // customer at the counter, thinking / ordering
  const customer = (id, at, item, o = {}) => add({ id, at, cam: [540, 800], zoom: 0.035, note: `customer, ${item}`,
    draw(lt, d, t) {
      K.counterLine(1430, 1290);
      K.greyTablet(640, 1090, 1.55, 0.14, 'LIST');
      const think = o.hand ?? 'chin';
      K.doug({ x: 360, y: 1330 + Math.sin(lt * 2) * 3, s: 1.9, lid: o.lid ?? 0.45, look: o.look ?? [0.3 + Math.sin(lt * 1.5) * 0.1, -0.5], mouth: o.mouth ?? 'talk', hand: think, t: lt, tilt: Math.sin(lt * 1.6) * 0.012, brow: o.brow ?? 0 });
    } });
  // cashier shot with the stock boy going to pieces behind
  const cashier = (id, at, pose, item) => add({ id, at, cam: [700, 800], zoom: 0.04, note: `cashier, stock boy pose ${pose} (${item})`,
    draw(lt, d, t) {
      ctx.fillStyle = '#C6C6C6'; ctx.fillRect(330, 330, 800, 1130);
      K.gus({ x: 150, y: 1470, s: 1.4, pose, t: lt });
      if (pose === 1) { K.pile(150, 1470, 1.2, 4, 3); }
      if (pose === 2) { K.shakeMarks(170, 1200, clamp(lt * 4), 1.3); }
      K.ray({ x: 770, y: 1260 + Math.sin(lt * 2.2) * 3, s: 1.65, lid: 0.12, look: [-0.1 + Math.sin(lt * 2) * 0.05, 0.75], mouth: 'grin', t: lt });
      K.register(700, 1400, 1.9);
      if (pose === 3) K.sweatDrop(980, 760, 1.6);
    } });

  customer('S01', cut(0), 'thinking', { mouth: 'small', hand: 'chin', look: [0.4, -0.6] });
  cue(0.2, 'pop', { gain: 0.5 });

  customer('S02', cut(1), '12 watermelons', { mouth: 'talk' });  cashier('S03', mid(1), 1, 'jumping');
  cue(mid(1), 'squeak', { gain: 0.8 }); cue(mid(1) + 0.25, 'thud', { gain: 0.6 });

  customer('S04', cut(2), '8 bags of ice', { mouth: 'talk', look: [0.2, -0.2] });  cashier('S05', mid(2), 2, 'flat');
  cue(mid(2), 'bonk'); cue(mid(2) + 0.3, 'wah', { gain: 0.5 });

  customer('S06', cut(3), '5 cacti', { mouth: 'talk', hand: 'chin', brow: 1 });  cashier('S07', mid(3), 3, 'head hug');
  cue(mid(3), 'gasp', { gain: 0.8 });

  // final: extreme close-up smirk
  add({ id: 'S08', at: cut(4), cam: [540, 900], zoom: 0.06, note: 'close-up: "Um..."',
    draw(lt, d, t) {
      const z = lerp(2.8, 3.1, eio(clamp(lt / d)));
      K.doug({ x: 540, y: 1640, s: z, lid: 0.55, look: [0.2, -0.3], mouth: lt > 0.5 ? 'smirk' : 'small', hand: 'none', t: lt, tilt: 0.02 });
    } });
  cue(cut(4), 'zip'); cue(cut(4) + 0.5, 'ding', { gain: 0.6 });
  return { shots: S, cues: CUES };
}
