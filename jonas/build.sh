#!/bin/sh
# Rebuild "JONAS — o homem que fugiu de Deus" from scratch: voice -> timeline/subtitles -> score -> mix -> picture -> master.
set -e
LIB=${LIB:-$HOME/lemo-opuscar}
HERE=$(cd "$(dirname "$0")" && pwd)
export LIB PYTHONIOENCODING=utf-8 MSYS_NO_PATHCONV=1
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
PY="$LIB/.venv/Scripts/python.exe"; [ -x "$PY" ] || PY="$LIB/.venv/bin/python"
cd "$LIB"
"$PY" core/tts/tts_zh.py "$HERE/lines.json" "$HERE/voice" --voice pt-BR-AntonioNeural --rate=-6% --pitch=-4Hz   # narration (edge-tts, cached)
"$PY" core/tts/asr_check.py "$HERE/lines.json" "$HERE/voice" --lang pt --model small                          # every line heard back
node "$HERE/tools/make_timeline.mjs"                                                                             # out/timeline.json + cues.json
"$PY" core/render/srt.py "$HERE/cues.json" "$HERE/jonas.srt"
"$PY" "$HERE/music/score.py"
"$PY" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video.mp4"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/jonas.mp4" 24 0          # no grain: keeps knife edges crisp
node core/render/still.mjs "$HERE" 87 --out "$HERE/out" && cp "$HERE/out/t_87.jpg" "$HERE/poster.jpg"
# ---- the vertical Short (1080x1920, ~65 s): same paintings, vertical framing, segments from timeline.mjs SHORT_SEGS
"$PY" "$HERE/tools/short.py"
"$PY" core/render/srt.py "$HERE/out/short_cues.json" "$HERE/jonas_short.srt"
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --q 'short=1' --out "$HERE/out/short_video.mp4"
sh core/render/mux.sh "$HERE/out/short_video.mp4" "$HERE/out/short_mix.wav" "$HERE/jonas_short.mp4" 24 0
