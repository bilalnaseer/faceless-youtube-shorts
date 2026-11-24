# Marker Sketch: black-and-white marker cartoons with a red title, 9:16

A white page, thick wobbly black marker line, **no colour except the red headline**, flat grey props that fade into the page. Two characters
trade shots (the customer asks, the clerk reacts) while a background character falls apart; the list of requests escalates; it ends on an extreme close-up
of the customer's smirk. Studied from a ~17 s reference ("ordering right before closing"). Example: `example/` = **SHOPPING RIGHT BEFORE CLOSING** (~11 s, 8 shots).

## 1. The look
- White `#FFFFFF` page. **Marker ink `#0D0D0D`, 11 px, round caps, a 1 px hand wobble** (`K.ink`). Faces: giant circular eyes with an extra glasses ring, heavy lids (`lid`), tiny mouths.
- Props are **flat mid-grey `#737373`** (counter, list board, register, boxes) with lighter grey details; never outlined, never coloured. The picture dissolves into the white page at the bottom (automatic fade y 1560-1730).
- Red `#E3280F` only for the title. No shadows, no gradients, no patterns.
- Animation = holds with small idle motion (breathing, blinking `lid`, eye drift), hard cuts, a very slow push (`zoom` 0.03). No bouncy camera.

## 2. Format
1080x1920, 30 fps, **10-25 s**. Content lives in y 300-1560 (platform UI covers the bottom). Shape: hook line → 3 escalating items, each = customer shot (speaking) + cashier shot
(cut at ~60 % of the line, background character in a worse state each time) → close-up of the customer: "Um…". Give item lines a long `gap` (0.9 s) so the cashier reaction breathes.
Cast: `K.doug` (box-head customer, origin = neck) · `K.ray` (round head + cap, cashier) · `K.gus` (background person: pose 0 wave, 1 panic jump, 2 flattened, 3 head-hug).

## 3. Text
Fixed red two-line **title** from `script.json` `"head": "SHOPPING RIGHT|BEFORE CLOSING"` (Oswald 700, 96 px) and, under it, a small black all-caps **subtitle** = the current line's `say` (else `text`),
Bangers 58 px, changes on every line. `nosub: true` hides it. Voices: `voices: { "doug": "am_michael" }`; silent characters need no line.

## 4. Kit
Characters above (`doug({lid, look:[x,y], mouth:'small|talk|o|grin|smirk|meh', hand:'chin|wave|point|none', brow, tilt})`, `ray({lid, look, mouth})`, `gus({pose})`).
Props: `counterLine greyTablet register pile melon ice cactus shakeMarks sweatDrop`; `K.ink(points, w)` / the shape helpers for new line art (keep 11 px, round caps).
Shots: customer/cashier helper pattern is in `example/src/shots.js` (`customer(id, at, item)`, `cashier(id, at, pose, item)`); `cut(i) = L(i)-0.05`, `mid(i)` = 62 % into line i.
Cues: `pop squeak thud bonk wah gasp zip ding`.

## 5. QA pitfalls
- Title overlapping the subtitle (keep subtitle y 286) · anything coloured · grey props outlined in black · a character cropped through the face (keep heads inside x 60-1020).
- Flat-lying Gus must be visible (not off the left edge) · fade zone: nothing important below y 1560.
