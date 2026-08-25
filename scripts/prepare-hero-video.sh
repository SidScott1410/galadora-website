#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Encode a source video into a web-ready hero background and install it,
# plus a poster frame, into client/public/media/.
#
#   bash scripts/prepare-hero-video.sh ~/Desktop/galadora.hero.mp4
#
# WHY re-encode rather than just copy the file:
#
#   1. GitHub blocks any file over 100MB and warns over 50MB. A camera or
#      editor export is frequently in that range.
#   2. Without `-movflags +faststart` the moov atom sits at the END of the
#      file, so browsers must download the whole thing before the first frame
#      paints. On a 20MB file over hotel wifi that is a visibly dead hero.
#   3. Safari and iOS refuse to decode 10-bit or yuv444 footage. `yuv420p` is
#      the only pixel format that plays everywhere.
#   4. The video is muted, looping, and sits behind a scrim. Audio is pure
#      waste and high bitrate is invisible. CRF 30 is the right trade here.
# ---------------------------------------------------------------------------
set -euo pipefail

SRC="${1:-}"
DEST_DIR="client/public/media"
OUT="$DEST_DIR/galadora-hero.mp4"
POSTER="$DEST_DIR/galadora-hero-poster.jpg"

if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "usage: bash scripts/prepare-hero-video.sh <path-to-source-video>" >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it:  brew install ffmpeg" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

echo "Source: $SRC ($(du -h "$SRC" | cut -f1))"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,duration \
  -of default=noprint_wrappers=1 "$SRC" || true
echo

echo "Encoding..."
ffmpeg -y -loglevel error -stats -i "$SRC" \
  -c:v libx264 \
  -profile:v main \
  -pix_fmt yuv420p \
  -crf 30 \
  -preset slow \
  -vf "scale='min(1920,iw)':-2:flags=lanczos" \
  -r 30 \
  -an \
  -movflags +faststart \
  "$OUT"

echo "Extracting poster frame..."
# Pull from 1s in; frame 0 is often a fade-from-black that makes a dull poster.
ffmpeg -y -loglevel error -ss 1 -i "$OUT" -frames:v 1 -q:v 4 \
  -vf "scale='min(1920,iw)':-2" "$POSTER"

SIZE_BYTES=$(wc -c < "$OUT")
SIZE_MB=$((SIZE_BYTES / 1024 / 1024))

echo
echo "Wrote $OUT       ($(du -h "$OUT" | cut -f1))"
echo "Wrote $POSTER  ($(du -h "$POSTER" | cut -f1))"
echo

# Fail loud rather than letting a push get rejected by GitHub later.
if [ "$SIZE_MB" -ge 100 ]; then
  echo "ERROR: ${SIZE_MB}MB exceeds GitHub's 100MB hard file limit." >&2
  echo "Re-run with a higher CRF (try 34) or trim the clip shorter." >&2
  exit 1
elif [ "$SIZE_MB" -ge 25 ]; then
  echo "WARNING: ${SIZE_MB}MB is heavy for a background loop."
  echo "Every visitor downloads this. Consider CRF 34, 1280px, or a shorter loop."
else
  echo "Size OK for a hero background loop."
fi
