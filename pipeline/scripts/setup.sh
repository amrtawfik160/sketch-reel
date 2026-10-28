#!/usr/bin/env bash
# One-time setup: KaTeX + fonts in ~/.cache/explainer-reel, and a Python with the audio deps.
set -euo pipefail
CACHE="$HOME/.cache/explainer-reel"
mkdir -p "$CACHE"
if [ ! -d "$CACHE/node_modules/katex" ]; then (cd "$CACHE" && npm init -y >/dev/null && npm i -s katex@0.16.11 >/dev/null); fi
[ -f "$CACHE/PlusJakartaSans.ttf" ] || curl -sL -o "$CACHE/PlusJakartaSans.ttf" "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
PY="${MER_PYTHON:-$HOME/.venvs/mer/bin/python}"
if ! "$PY" -c "import numpy, scipy, soundfile, faster_whisper" 2>/dev/null; then
  python3 -m venv "$HOME/.venvs/mer" && PY="$HOME/.venvs/mer/bin/python"
  "$PY" -m pip install -q numpy scipy soundfile faster-whisper
fi
echo "ready. python: $PY"
