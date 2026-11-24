# Faceless Shorts: a free skill for animated-cartoon YouTube Shorts

Narrated faceless cartoon shorts (YouTube Shorts, TikTok, Reels) made 100% in code on your own computer: script, a separate AI voice per
character, word-synced timing, animation, sound effects and music, rendered to MP4. No AI video, no API keys, no credits.
Works as a skill for Claude Code and OpenCode-style agents: give it a story idea and a style, and it writes, animates, checks and renders the short.

## Styles and where they come from

The three looks in this repo are **studied from, and inspired by, the YouTube channels below**. The characters, stories, dialogue and all artwork in this repo are
original code-drawn creations; no footage, characters or scripts from these channels are included. Please go and support the original creators.

| Style | Inspired by | What it makes |
|---|---|---|
| `marker-sketch` | **[Nutshell Animations](https://www.youtube.com/@NutshellAnimations/)** | black-and-white marker cartoon, red headline, small subtitle, customer vs. clerk |
| `blob-park` | **[The Land of Boggs](https://www.youtube.com/@TheLandofBoggs/)** | two blob friends on a park bench, deadpan timing, hand-lettered text coloured per speaker |
| `kawaii-skit` | **[Chikn Nuggit](https://www.youtube.com/@chiknnuggit/)** | chibi animals in candy-coloured rooms, speech bubbles, one-word punchline |

## The three example videos

Each style ships with a complete, original example project (`styles/<style>/example/`) that renders as-is. Press play to see each style:

<table>
<tr>
<td align="center" valign="top" width="33%">
<b>Shopping Right Before Closing (~13 s)</b><br>
<sub><code>marker-sketch</code> · inspired by <a href="https://www.youtube.com/@NutshellAnimations/">Nutshell Animations</a></sub><br><br>



https://github.com/user-attachments/assets/77b89c4f-9b51-42aa-ae9a-78d136bb5d65



</td>
<td align="center" valign="top" width="33%">
<b>The Balloon (~12 s)</b><br>
<sub><code>blob-park</code> · inspired by <a href="https://www.youtube.com/@TheLandofBoggs/">The Land of Boggs</a></sub><br><br>



https://github.com/user-attachments/assets/42316dbd-1057-4bab-8912-d2e4fb9ae9b8




</td>
<td align="center" valign="top" width="33%">
<b>The Flour Incident (~7 s)</b><br>
<sub><code>kawaii-skit</code> · inspired by <a href="https://www.youtube.com/@chiknnuggit/">Chikn Nuggit</a></sub><br><br>




https://github.com/user-attachments/assets/8361ef75-5d45-4b1a-a210-fc7c680e860e




</td>
</tr>
</table>

The MP4 files are also in [`examples/`](examples/).

Render any of them yourself (after setup, below):
```bash
bash scripts/new_video.sh blob-park demo     # copies engine + style + example into ~/faceless-shorts/demo
cd ~/faceless-shorts/demo
S=/path/to/faceless-youtube-shorts            # where you cloned this repo
$S/scripts/py $S/scripts/voice.py . && $S/scripts/py $S/scripts/words.py .   # voices + word timing
node tools/capture.mjs cues && $S/scripts/py tools/mix.py .                  # sound effects + music
node tools/capture.mjs video renders/demo.mp4                                # the MP4
```
To make your own story instead, just ask the agent; it runs the whole pipeline (`SKILL.md`, section 3).

## How it works
`script.json` → Kokoro voices (local, free, one per character) → Whisper word timings (local, free) → shots drawn in code, each cut placed on its line →
procedural sound effects + music → headless Chrome captures every frame → ffmpeg renders the MP4. The agent checks a contact sheet of the whole video before you ever see it.
Optional: when you ask, it uploads the finished short to your YouTube channel through Zapier (it confirms title, visibility and category first).

## Install the skill
**Needs:** Node.js 22+, ffmpeg, Google Chrome, Python 3.10+, ~1 GB for the voice and Whisper models (the setup script installs what it can).
On Windows run the scripts in Git Bash.

1. Download the repo: `git clone https://github.com/bilalnaseer/faceless-youtube-shorts.git`
2. Put (or symlink) the folder where your agent loads skills, for example:
   - Claude Code: `~/.claude/skills/faceless-shorts/`
   - OpenCode: `~/.config/opencode/skills/faceless-shorts/` (or the skills folder your OpenCode version uses; the folder only needs `SKILL.md` at its root)
3. In that folder run `bash scripts/setup.sh` (prints "All set") and `bash scripts/selftest.sh` (prints "SELFTEST PASSED").
4. Start a new agent session and ask, for example: *"Make a Blob Park short about two friends sharing an umbrella."*

## Layout
`SKILL.md` (what the agent follows) · `engine/` (shared renderer: page, camera, capture, mixer) · `scripts/` (setup, selftest, new_video, voice, words, estimate) ·
`styles/<style>/` (`style-sheet.jpg`, `STYLE.md`, `core/` kit + text layer, `fonts/`, `example/`) · `examples/` (the three finished example videos) · `output/` (your own renders, git-ignored) · `sample-videos/` (reference clips, git-ignored).

## Adding your own style
Drop a short reference clip in a folder and ask the agent for a style like it; `SKILL.md` ("Adding a new style") describes the steps.
Only copy the *look* (palette, line weight, layout, pacing). Write your own characters and stories.

## Licenses
The code, stories and drawings in this repo are original and free to use in your videos. Fonts (Fredoka, Oswald, Bangers, Patrick Hand, Kalam): SIL Open Font License 1.1.
Installed on first use: Kokoro-82M (Apache-2.0) via kokoro-onnx (MIT), faster-whisper + Whisper small.en (MIT), numpy, scipy.
The channel names above belong to their owners and are mentioned only as credit for the visual inspiration.
