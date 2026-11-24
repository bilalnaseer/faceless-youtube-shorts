# Blob Park: two blob friends on a park bench, 9:16

Soft, sunny and deadpan. A teal-to-cream gradient sky, scalloped olive tree crowns, ochre trunks, a green lawn and a brown bench; two simple blob characters with
**tentacle limbs and tiny faces**; the camera is always the same park, just zoomed in or panned up. Text is a small hand-lettered line coloured by who is talking.
Studied from a ~22 s reference (sharing food on a bench, reversal on the punchline). Example: `example/` = **THE BALLOON** (~12 s, 8 shots).

## 1. The look
- **Thin 5 px black outline** on everything; flat fills (a single translucent white highlight allowed). Palette (`K.P`): sky `#7FF5E0 → #B9F6C9 → #FCEFA6`, grass `#97CC63`, trunk `#C99A33`, crown `#6B6A34`, bench `#8E5A2B`,
  Bloo `#9BEBFF` + pink tentacle `#F26FBF` + purple foot `#B57CEF`, Orby `#FA9115` + yellow squiggles `#FFD92E`.
- Faces are minimal: two eyeballs with pupils (`eyes: open|wide|sleepy|angry|happy|closed`) and a one-line mouth. Emotion = eyelids, eyebrows, mouth, and posture, not extra drawing.
- **Close-ups are the wide scene zoomed** (`K.scene(cx, cy, zoom, fn)`; wide = 1.3 about (540,1240), close 1.8-2.2 about a character's head). Never redraw a different background for a close-up.
- Sky shots: `K.park(dy)` with dy 700-1500 pans the camera up; draw world objects inside `ctx.translate(0, dy)`.

## 2. Format
1080x1920, 30 fps, **12-25 s**, 6-12 shots, long holds (1-3 s) and slow pushes. Beats: wide setup → ask (close-up) → hand-over (insert) → reaction → the turn (wide or sky) → deadpan close-up of the loser → wide on the empty bench.
Gaps 0.35-1.7 s; the biggest gap goes on the visual gag (the float-away).

## 3. Text
Hand-lettered ALL-CAPS (Patrick Hand, narrowed 0.82x, 90 px), no bubble, near the top (y 150), **coloured per speaker**: `"colors": { "orby": "#D9731A", "bloo": "#2A96AB" }`, `"handle": "@yourchannel"` watermark bottom-left.
Line: `{ "who": "bloo", "text": "I said hold it.", "say": "I SAID HOLD IT.", "gap": 0.6 }` (`say` optional; `y` moves the line; `nosub: true` hides it). Voices per `who` in `voices`.

## 4. Kit
`K.park(dy)` · `K.bench()` (seat top y 1160, centre 540) · `K.scene(cx,cy,zoom,fn)` ·
`K.bloo({x,y,s,flip,eyes,look,mouth:'flat|o|smile|frown|grit',arm:'rest|up|out',armT,tip,hold,lean,squash})` ·
`K.orby({…,eyes:'open|wide|happy|sparkle|teary|sad|closed',mouth:'smile|grin|o|open|frown|bite',armUp,hands,hold,dangle})` ·
props `balloon cloud sparkles sweatDrop bird`. Sit characters at y = 1150 (bench seat), x 390 / 700.
Cues: `pop squeak sparkle whoosh giggle zip wah`.

## 5. QA pitfalls
- Arms raised behind the head are barely visible: keep hands ≥ 420 px above the feet. · Text over bright canopy: keep the white halo (already in captions.js).
- In sky shots check that no tree crown block floats mid-screen (use dy ≥ 1400). · Characters must sit ON the bench seat (y 1150 + dy).
