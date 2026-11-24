// THE FLOUR INCIDENT: kawaii-skit example. 4 lines → 5 shots. One line = one cut (line 2 spans two shots).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot · d = shot length · t = film time.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, spring, wob, rnd, at } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);

  // 1 · humming in the doorway with the grocery bag
  { const st = cut(0);
    add({ id: 'S01', at: st, cam: [540, 800], zoom: 0.07, note: 'doorway, humming, bag swings',
      draw(lt, d, t) {
        K.hall();
        const sway = Math.sin(lt * 5) * 0.05, blink = (lt % 1.6) > 1.5;
        K.mochi({ x: 550 + Math.sin(lt * 2.5) * 6, y: 1238, s: 1.5, eyes: blink ? 'closed' : 'chill', mouth: 'cat', tilt: sway, bob: Math.abs(Math.sin(lt * 5)) * -8,
          armL: 0.25, armR: -0.2 + Math.sin(lt * 5) * 0.12, tail: Math.sin(lt * 5), hold: (x, y) => K.groceryBag(x - 6, y + 4, 1, Math.sin(lt * 5) * 0.1) });
      } });
    cue(st + 0.15, 'pop', { gain: 0.5 });
  }
  // 2 · gasp: bag drops, arms up, eyes huge
  { const st = cut(1);
    add({ id: 'S02', at: st, cam: [550, 760], zoom: 0.1, note: 'gasp, bag falls',
      draw(lt, d, t) {
        K.hall();
        const jump = Math.max(0, Math.sin(clamp(lt / 0.3) * Math.PI)) * 60, sq = 1 + Math.sin(clamp(lt / 0.25) * Math.PI) * -0.08;
        const fall = eo(clamp(lt / 0.35)); const shake = Math.sin(lt * 60) * 4 * (1 - clamp(lt / 0.8));
        K.groceryBag(lerp(600, 690, fall), lerp(900, 1130, eo(fall)), 1.5, lerp(0, 0.6, fall));
        K.mochi({ x: 550 + shake, y: 1238, s: 1.5, eyes: 'wide', mouth: 'o', armL: 2.2, armR: -2.2, bob: -jump, squash: sq, tail: Math.sin(lt * 30) * 0.4 });
        K.exclaim(550, 600 - jump, 1.1, clamp(lt * 8));
      } });
    cue(st, 'gasp'); cue(st + 0.3, 'thud', { gain: 0.5 });
  }
  // 3 · "FLOUR!": a huge dark sack fills the foreground, tiny Mochi frozen in the doorway
  { const st = cut(2);
    add({ id: 'S03', at: st, cam: [380, 1100], zoom: 0.12, note: 'foreground hulk, tiny Mochi in doorway',
      draw(lt, d, t) {
        K.hall();
        K.mochi({ x: 560, y: 1215, s: 0.62, eyes: 'wide', mouth: 'o', armL: 1.2, armR: -1.2, tail: 0 });
        K.sweat(640, 960, 0.9, clamp(lt * 4));
        K.fgHulk(lerp(-180, 20, eo(seg(lt, 0, 0.5))), 1320, 1.25);
        K.puff(260, 1560, 150, seg(lt, 0.2, 1.5), 0.9);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bonk', { gain: 0.7 });
  }
  // 4 · the mess: Biscuit on the stool, whisk in paw, flour everywhere
  { const st = L(2) + 0.7;
    add({ id: 'S04', at: st, cam: [540, 980], zoom: 0.1, note: 'kitchen mess, Biscuit whisking on stool',
      draw(lt, d, t) {
        K.kitchen();
        K.stool(450, 1470, 1.7);
        K.flourSack(830, 1330, 1.5, 0.9, 1);
        K.puff(860, 1360, 230, seg(lt, 0, 1.4), 0.95);
        for (let i = 0; i < 4; i++) K.egg(120 + i * 210 + rnd(i) * 40, 1560 + rnd(i + 3) * 200, 1.5, rnd(i) * 3, true);
        K.biscuit({ x: 450, y: 1138, s: 1.55, flour: 0.9, eyes: 'dot', mouth: 'o', t: lt, armR: -1.5 + Math.sin(lt * 18) * 0.3,
          hold: (x, y) => K.whisk(x, y - 10, 1, Math.sin(lt * 18) * 0.25 - 0.2) });
        for (let i = 0; i < 9; i++) { const u = (lt * 0.8 + i * 0.37) % 1; K.puff(150 + rnd(i) * 800, 1250 - u * 700, 40 + rnd(i + 4) * 40, u, 0.9); }
      } });
    cue(st, 'poof', { gain: 0.8 }); cue(st + 0.4, 'crash', { gain: 0.5 });
  }
  // 5 · close-up on the powdered face
  { const st = cut(3);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.06, note: 'face close-up, sparkle',
      draw(lt, d, t) {
        K.kitchen();
        const sc = lerp(3.1, 3.4, eio(clamp(lt / d)));
        K.faceClose({ x: 540, y: 1300, s: sc, flour: 1, eyes: lt > 0.5 ? 'sparkle' : 'dot', mouth: 'w', t: lt, shine: seg(lt, 0.4, 0.7) });
      } });
    cue(st, 'zip'); cue(st + 0.45, 'sparkle', { dur: 0.8 });
  }
  return { shots: S, cues: CUES };
}
