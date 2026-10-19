#!/usr/bin/env bash
# Render one cyber banner to webp.
# Usage: render.sh <out.webp> "<url-encoded query string>"
#   e.g. render.sh public/issue/foo/cover.webp "accent=%2300F0FF&kicker=%2F%2F%20DEV%20TOOL&title=Foo|Bar&subtitle=..."
# Query params (all optional): accent(hex) kicker title(| = line break) subtitle tags(comma-sep)
#   motif(waves|bars|dots|rings|hex|qr|cards|braces|trophy|shield) badgeLvl badgeSub meta
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$1"; QUERY="${2:-}"
TMP="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=2500 --window-size=1600,900 --default-background-color=ff06070d \
  --screenshot="$TMP/shot.png" "file://$DIR/cover-template.html?$QUERY" >/dev/null 2>&1
cwebp -quiet -resize 1600 900 -q 88 "$TMP/shot.png" -o "$OUT"
rm -rf "$TMP"
echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
