---
name: faceless-shorts
description: Make narrated faceless animated-cartoon YouTube Shorts / TikToks / Reels fully in code on the user's computer, with free local AI voices (one per character) and word-synced timing, $0. Three styles - Kawaii Skit (chibi animals, speech bubbles, saturated rooms, one-word punchline), Marker Sketch (black-and-white marker cartoon, red title, customer/clerk back-and-forth), Blob Park (two blob friends on a park bench, hand-lettered coloured text). Use whenever someone wants a faceless cartoon short, a funny skit or storytime in a cartoon style, a comic-style animated short, or a video in one of these styles, even from just a story idea. Can also upload the finished short to the user's YouTube channel through Zapier when they ask.
---

# Faceless Shorts

You make a finished vertical cartoon short from a story idea: script, character voices, word-synced timing, animated shots, sound and
music, rendered to MP4. **Everything is code**: canvas drawing, headless Chrome capture, ffmpeg, a local Kokoro voice,
local Whisper word timing, numpy sound. No AI images or video, no API keys, no credits.
`SKILL` = the folder this file is in. Projects live in `~/faceless-shorts/<short-name>/`.

| style | what it makes | length · aspect |
|---|---|---|
| **Kawaii Skit** `kawaii-skit` | chibi animal in a candy-coloured room, thick black outlines, a speech bubble on every line, gasp → huge foreground object → the mess → one-word punchline close-up | 8-20 s · 9:16 |
| **Marker Sketch** `marker-sketch` | white page, wobbly black marker line, grey props, red headline + small subtitle; customer and clerk trade shots while a background person falls apart; ends on a smirk close-up | 10-25 s · 9:16 |
| **Blob Park** `blob-park` | two blob friends (tentacle limbs, tiny faces) on a park bench under tall trees, deadpan comic timing, hand-lettered text coloured per speaker, close-ups = zoomed wide shot | 12-25 s · 9:16 |

**Always ask which style before doing anything else** when the user asks for a video and hasn't named one (`kawaii-skit`, `marker-sketch`, `blob-park`, or their
names). Never pick silently. Ask in the first message of the conversation (if your client has a multiple-choice question tool, use it), listing all three with the one-line
description above and a recommendation based on their idea, e.g.:
> Which style should this short use?
> 1. **Kawaii Skit**: cute chibi animals, speech bubbles, a gasp-and-mess gag (recommended for chaotic, funny moments)
> 2. **Marker Sketch**: black-and-white marker cartoon, red headline, customer vs. clerk escalation (recommended for dialogue / service jokes)
> 3. **Blob Park**: two blob friends on a park bench, gentle deadpan reversal (recommended for sharing / borrowing / favour jokes)
Skip the question only when the user already named the style (or a channel it is inspired by). Recommend by idea: cute chaos with one escalating gag → Kawaii Skit ·
a dialogue joke with escalating requests / awkward service → Marker Sketch · a gentle sharing / borrowing / favour joke with a reversal → Blob Park.
If they have no idea yet, offer to pitch 3 story ideas, one per style.

Layout: `engine/` (shared: page, camera, capture, mixer) + `styles/<style>/{STYLE.md, style-sheet.jpg, core/ (kit, text layer, settings), fonts/, example/ (script.json, src/shots.js, data/)}`.
`new_video.sh` assembles engine + style into a project. **Read the style's STYLE.md in full before planning**; `output/*.mp4` are the finished example videos to match.
These are stories, not explainers: characters speak, each `who` gets their own Kokoro voice (`"voices": { "who": "af_bella" }`), and the picture carries the joke.

## 0. First use on a computer
`bash SKILL/scripts/setup.sh` until it prints **All set** (checks Node 22+, ffmpeg, Chrome; builds `~/.faceless-shorts/venv`;
downloads the Kokoro voice ~340 MB and Whisper small.en ~0.5 GB). Install anything missing the free, official way, and ask
before anything that needs a password. Then `bash SKILL/scripts/selftest.sh` must print **SELFTEST PASSED**: open the
contact sheet and clip it names and look at them.

## 1. Intake (ONE message, defaults filled in)
**Style first** (see above, unless named), then ask only what's unknown, all at once, in the same message: story idea or premise (or "you pick 3 ideas"), a link to a short whose format they like (optional),
length (default = the style's range, ~10-20 s), character voices (`SKILL/scripts/py SKILL/scripts/voice.py --list`; default: you cast them), voiceover mode:
**AI voice** (default) · **their own recording** (they record after seeing the script; `words.py --audio`) ·
**captions-only** (no voice yet; `estimate.py`), music (built-in bed · none · their own royalty-free file), end line / handle.
"Just go" = the defaults for everything except the style, which is always asked unless named.

## 2. The plan (ONE screen, then wait)
Show: title · cast (who speaks, which voice) · the script, one line per cut, as `who: spoken text` + what the text layer shows (`say`) ·
the shot list, one line each (what we see, what moves, which word it lands on) · new props/poses you'll add to the kit, if any.
Ask **"Build it?"** and wait.

**Script rules.** Original story, written as a SHORT comic beat sheet: set-up (calm) → escalation (3 steps or 1 big surprise) → a punchline
on the last line, usually 1-5 words, deadpan. Dialogue is what a person would really say; lines are short because the joke is visual. **A line is a CUT**: the picture
changes on every line (and may change again mid-line). Use `gap` (0.3-1.7 s) to let a visual gag play. Write numbers as they're said in `text`; `say` is what the
text layer shows ("12 WATERMELONS", "*Gasps!*"). Take a format you like, never another creator's script, characters or shots.

## 3. Build
1. `bash SKILL/scripts/new_video.sh <style> <short-name>` copies the example into `~/faceless-shorts/<short-name>/`.
2. Write `script.json` (title/head, voices, lines `{who, text, say, gap}`; see STYLE.md).
3. Timing: `SKILL/scripts/py SKILL/scripts/voice.py <proj>` then `SKILL/scripts/py SKILL/scripts/words.py <proj>`
   (own recording: `words.py <proj> --audio their.m4a`; captions-only: `estimate.py <proj>`).
4. Rewrite `src/shots.js`: one shot per line (or two for long lines), each placed with `cut(i)` and its key moments on
   words with `Wd('word', line)`. Reuse the kit (`src/core/kit.js`); add new components there, in the style's look.
5. In the project: `node tools/capture.mjs check` (must say CHECK OK) → `node tools/capture.mjs cues` →
   `SKILL/scripts/py tools/mix.py .` → QA (section 4) → `node tools/capture.mjs video renders/<name>.mp4`.
   Iterating on one shot: `node tools/capture.mjs frames review/f "4.2,4.6"` and look.

## 4. QA: never show a frame you haven't looked at
`node tools/capture.mjs sheet review/all.jpg 0.5 10` (a frame every 0.5 s, time-stamped) and read the whole sheet, then key
frames full size. For every frame ask:
- **Does it make sense?** Props move with whoever holds them; characters stand ON the floor / seat; nothing appears before its cause; the same character keeps the same proportions in every shot.
- **Does it match the line at that moment?** The picture changes just before its line; the gag lands on its word.
- **Is anything colliding?** Text never covers a face; nothing important in the platform-UI zone (bottom ~350 px).
- **Text layer** (bubble / subtitle / hand-lettered line): spelled right, on the line being said, readable on a phone.
- **Style sheet:** only that style's palette and outline weight; no new colours.
- **Sound:** voices clear over the music; effects soft and on the beat of the gag.
Fix, re-render the sheet, re-check. Tell the user what you caught and fixed.

## 5. Deliver
Open the MP4 for the user. Also give: a share copy if > 35 MB (`ffmpeg -i in.mp4 -c:v libx264 -crf 21 -preset slow -c:a aac
-b:a 160k -movflags +faststart share.mp4`), the best cover frame (`capture.mjs frames`), a title, a caption and 5-8 hashtags.
For own-recording mode, also give them the script with each line's timing to read against. Offer one round of precise changes
and re-render only what changed.

## 5b. Publish to YouTube via Zapier (only when the user asks to upload)
All calls are Code Mode tools: run them inside `execute` as `tools.zapier.*` (do not call them as normal tools). Validated once in a real upload; the values below are exact.

1. **Connect.** If `list_zapier_skills` has a saved skill for uploading, use it. Otherwise make sure the YouTube app is enabled:
   `discover_zapier_actions({ app: "YouTube" })` → `enable_zapier_action({ selected_api: "YouTubeV4CLIAPI", app_display_name: "YouTube", action: "upload_video" })`.
   If no connection exists yet, `manage_zapier_connections({ selected_api: "YouTubeV4CLIAPI" })` returns a connect URL for the user.
2. **Host the file.** The action's `video` / `thumbnail` params need a URL Zapier's servers can fetch; a local path is silently wrong.
   Put the MP4 on a temp host, in this order (all tested 2026-11-03; on Windows use `curl.exe`):
   - a. **litterbox** (1 h to 72 h expiry, up to 1 GB): `curl -F "reqtype=fileupload" -F "time=1h" -F "fileToUpload=@renders/<name>.mp4" https://litterbox.catbox.moe/resources/internals/api.php` → returns the direct URL as plain text.
   - b. **uguu.se** (about 3 h expiry, good for shorts under 35 MB): `curl -F "files[]=@renders/<name>.mp4" https://uguu.se/upload` → returns JSON; use `files[0].url` (the `d.uguu.se/...` link).
   - c. **catbox** (permanent, no expiry): same call as (a) without `-F "time=1h"`. Public forever, so only with the user's OK.
   - Skip these (verified broken 2026-11-03, don't waste retries): 0x0.st (uploads disabled), tmpfiles.org (link is a viewer page, not the raw file), gofile.io (raw download needs an account token), file.io (curl API redirects to its web app), bashupload.com, temp.sh (dead).
   - **Always verify** the URL before using it: `curl -sSI <url>` must return 200/206 with a video content-type. Never trust a host's JSON without checking.
   - Tell the user this puts their video on a public temp host that expires by itself.
3. **Confirm first.** This writes to the user's real channel, so confirm before executing: title, visibility (private / unlisted / public) and category.
   Resolve `category_id` with `inspect_zapier_actions({ tool_name: "youtube_upload_video", enum_property: "category_id" })` if needed.
   Comedy = 23 (default suggestion for these cartoon shorts), Entertainment = 24, Pets & Animals = 15.
4. **Upload.**
   `execute_zapier_write_action({ selected_api: "YouTubeV4CLIAPI", action: "upload_video", tool_name: "youtube_upload_video", params: { video: "<temp URL>", title, description (end it with #shorts), tags: [5-8 hashtags without #], category_id: "23", privacy_status, made_for_kids: false, embeddable: true, notify_subscribers: true, default_language: "en", license: "youtube" } })`
5. **Report.** The result contains `id`; the link is `https://www.youtube.com/watch?v=<id>`. A vertical video of 60 s or less becomes a Short automatically (no extra field).
   Open the local file for the user (`tools.browser.preview({ path: "renders/<name>.mp4" })`) and give the YouTube URL in text. The in-app browser often fails to load youtube.com with ERR_ABORTED; that is not a failed upload.
6. **Thumbnails.** Unlisted uploads don't take a custom thumbnail through this action; offer the saved cover frame if the user later makes the video public.

## Adding a new style (when the user asks)
The user drops a sample (video or frames) in a folder and asks for a style like it.
1. Study it: `ffmpeg -i s.mp4 -vf "fps=1,scale=270:-1,tile=8x4" sheet.jpg` and read it: palette, outline weight, character design, backgrounds, text layer (where, font, colour), cut rhythm, camera, sound. Write these down first.
2. Make `styles/<new-style>/`: `core/style.js` (fonts, clear colour, punch/zoom), `core/captions.js` (the text layer: exports `buildCaptions drawCaption captionList drawOverlay`), `core/kit.js` (characters, backgrounds, props, same look),
   `fonts/` (OFL fonts only), `example/{script.json, src/shots.js}` (an ORIGINAL story, same structure as the sample), `STYLE.md` (look rules, palette, format, text, kit map, QA pitfalls). Copy the closest existing style as the starting point.
3. `bash scripts/new_video.sh <new-style> t1 --dir /tmp/x`, run the pipeline (section 3), look at frames, fix, repeat; then copy `data/{lines,words,cues}.json` into `example/data/` and the contact sheet to `style-sheet.jpg`. `selftest.sh` must pass.
The shared scripts (voice, words, estimate, new_video, selftest) and `engine/` work unchanged. Dialogue voices: `voice.py --list` (female `af_bella` `af_nicole` `af_heart`, male `am_michael` `am_puck` `am_fenrir`, UK `bm_george`).

## Never
Generate images or video with AI; spend the user's money or credits; upload to YouTube or any host without the user asking and confirming; copy another creator's script, shots or frames;
overwrite a user's project without asking; ship a frame you haven't looked at.
