#!/bin/sh
# Build one film of "Ecos da Escritura": sh build.sh <slug> [WxH]   (default 1080x1920 vertical Short; 1920x1080 horizontal)
set -e
SLUG=$1; SIZE=${2:-1080x1920}; LIB=${LIB:-$HOME/lemo-opuscar}
HERE=$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)
export LIB PYTHONIOENCODING=utf-8 MSYS_NO_PATHCONV=1
PY="$LIB/.venv/Scripts/python.exe"; [ -x "$PY" ] || PY="$LIB/.venv/bin/python"
D="$HERE/stories/$SLUG"
cd "$LIB"
[ -f "$D/voice/dur.json" ] || "$PY" core/tts/tts_zh.py "$D/lines.json" "$D/voice" --voice pt-BR-AntonioNeural --rate=-6% --pitch=-4Hz
node "$HERE/tools/make_timeline.mjs" "$SLUG"
"$PY" core/render/srt.py "$D/cues.json" "$D/$SLUG.srt"
"$PY" "$HERE/tools/score.py" "$SLUG"
"$PY" "$HERE/tools/mix.py" "$SLUG"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size "$SIZE" --q "story=$SLUG" --out "$D/out/video.mp4"
sh core/render/mux.sh "$D/out/video.mp4" "$D/out/mix.wav" "$D/$SLUG.mp4" 24 0
