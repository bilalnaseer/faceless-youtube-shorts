# Kawaii Skit: chibi-animal comedy skits, 9:16

Saturated, cute, fast. A big-headed animal in a candy-coloured room, **thick black outlines**, a speech bubble on every line, extreme
close-ups on the reaction, a cut every 1-2 s. Studied from a ~8 s reference (humming in a doorway → gasp → huge foreground object →
the mess → one-word punchline close-up). Example to copy: `example/` = **THE FLOUR INCIDENT** (~9 s, 5 shots).

## 1. The look (don't break)
- **One 8 px near-black outline (`#1B1008`) on every character and prop.** Flat fills, ONE lighter highlight shape per object. No gradients, no shadows.
- Palette (`K.P`): warm wallpaper stripes `#FBDA84`/`#F6C96C`, pink tile floor `#F9C4C4`, teal door `#2A97A0`, fur brown `#7B4A22`, cream `#F8D98C`,
  mint prop `#9FE8C8`, danger red `#D3262B`, cabinet orange `#DD5A38`. Strong complementary pairs (teal door on yellow wall, purple stool on pink floor).
- **Characters:** round head ~1/2 of body height, big cheek tufts, tiny nose, half-lidded black "chill" eyes by default; they flip to huge white
  eyes + tiny pupils + open mouth on shock. Tail swings. Squash on every jump (`squash`).
- **Backgrounds** are real rooms in simple perspective: door frame with a view of the next room, kitchen with a window. Keep key action between y 450 and 1300.
- Tone: cute and a little unhinged. One gag per video, escalating: calm → shock → "what happened here" → one deadpan word.

## 2. Format
1080x1920, 30 fps, **8-15 s** (up to 25 s for a longer skit). 4-8 lines, **one line = one cut** (a long line may span two shots: cut with `L(i)+x`).
Beats: (1) calm wide shot, character humming/doing something (2) gasp, bag drops (3) foreground-object shot ("FLOUR!") with the character tiny in the background
(4) the mess, wide (5) close-up of the culprit/result, **one-word punchline in an orange bubble**. Use long `gap`s after lines (0.5-1.3 s) so shots breathe.

## 3. Text = the speech bubble
`script.json` line: `{ "who": "mochi", "text": "Ahhh!", "say": "*Gasps!*", "gap": 0.35, "bub": { "x":540, "y":200, "tx":540, "ty":390, "c":"orange" }, "hold": 1.6 }`
- `text` is spoken by the voice; `say` is what the bubble shows (sound effects in `*stars*`, shouts in CAPS). Default `say` = `text`.
- `bub`: centre x,y · tail tip tx,ty (point it at the speaker's mouth) · colour `cream` (default) | `orange` (punchline) | `pink` | `mint` | `white`. `hold`: seconds to keep the bubble after the line ends. `nobub: true` = no bubble.
- Black Fredoka 104 px, white 11 px border. Voices: `voices: { "mochi": "af_bella", "biscuit": "am_puck" }` (one voice per `who`).

## 4. Kit (`src/core/kit.js`, `import * as K`)
Scenes: `K.hall({swing})` doorway hall · `K.kitchen()` · `K.wallpaper()`.
Characters: `K.mochi({x,y,s,eyes,mouth,armL,armR,hold,holdL,tail,hair,bob,tilt,squash,look,t})` fox-pup (origin = feet, 420 px at s=1) ·
`K.biscuit({…,flour 0..1,hold})` cream pup · `K.faceClose({…})` full-screen face. Eyes `chill|wide|happy|closed|dot|sparkle|dizzy`; mouths `cat|o|open|smile|flat` (mochi), `w|o|open` (biscuit).
Props/FX: `groceryBag whisk egg flourSack stool puff(x,y,r,u) sparkle exclaim sweat speedLines fgHulk`. New topic = new props in the same look (8 px outline, flat + one highlight).
Engine: shots `{id, at, cam, zoom, note, draw(lt,d,t)}` · `cut(i)` = `L(i)-0.06` · cues `cue(t,'gasp'|'bonk'|'poof'|'crash'|'wah'|'giggle'|'squeak'|'ding'|…)`.

## 5. QA pitfalls
- A bubble tail not pointing at the speaker; bubble covering the face (keep faces below y 450 in wide shots, or move `bub.y`).
- Characters floating: feet y must equal the floor/stool top. Props held must use `hold` (follows the hand).
- Shots under 0.5 s feel like glitches except the gasp. Give the punchline close-up ≥ 1.2 s.
