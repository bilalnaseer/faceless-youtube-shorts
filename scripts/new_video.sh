#!/bin/bash
# Start a new video: engine + a style's kit + the style's working example (script + shots), so it renders straight away.
#   bash new_video.sh <style> <short-name> [--dir <parent>]     → ~/faceless-shorts/<short-name>/
#   bash new_video.sh --list                                    the styles
set -eu
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
if [ "${1:-}" = "--list" ]; then for d in "$SKILL"/styles/*/; do [ -d "$d" ] && echo "$(basename "$d")"; done; exit 0; fi
USAGE="usage: new_video.sh <style> <short-name> [--dir <parent>]   (styles: $(ls "$SKILL/styles" | tr '\n' ' '))"
STYLE="${1:?$USAGE}"; NAME="${2:?$USAGE}"; shift 2
PARENT="$HOME/faceless-shorts"
while [ $# -gt 0 ]; do case "$1" in --dir) PARENT="${2:?}"; shift 2 ;; *) echo "unknown option $1" >&2; exit 2 ;; esac; done
S="$SKILL/styles/$STYLE"
[ -d "$S/example" ] || { echo "no style '$STYLE' ($USAGE)" >&2; exit 2; }
DST="$PARENT/$NAME"
[ -e "$DST" ] && { echo "$DST already exists: pick another name" >&2; exit 2; }
mkdir -p "$PARENT" "$DST"
cp -R "$SKILL/engine/." "$DST/"                       # index.html, src/main.js, src/core/{lib,timing}.js, tools/
mkdir -p "$DST/fonts"; cp -R "$S/fonts/." "$DST/fonts/"
cp -R "$S/core/." "$DST/src/core/"                    # the style's kit.js, captions.js, style.js
cp -R "$S/example/." "$DST/"                          # script.json, src/shots.js, data/
mkdir -p "$DST/renders" "$DST/review"
rm -f "$DST/data/narration.wav" "$DST/data/mix.wav"
echo "$DST"
echo "style: $STYLE. Read $S/STYLE.md, then rewrite script.json + src/shots.js"
