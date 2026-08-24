#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Recover the media assets that Manus hosted but never exported into the repo.
#
# WHY this exists: Home.tsx references 12 files under /manus-storage/. Those
# were served by Manus's storage layer, not from client/public/. The GitHub
# export copied the code but not the bytes, so a correct build still renders
# a black page with no logo and no hero video.
#
# The old Manus deployment is the only known source. Run this NOW, before that
# deployment is reaped — after that these files are unrecoverable from here.
#
# Usage:  bash scripts/fetch-manus-assets.sh
# ---------------------------------------------------------------------------
set -euo pipefail

SRC="https://herotemplate-vpfrikna.manus.space/manus-storage"
DEST="client/public/manus-storage"

ASSETS=(
  "hero-bg_e417fdab.mp4"
  "galadora_logo_white_5e60196f.png"
  "logo-apple_4f9addc7.png"
  "logo-amazon_75a9eb0e.png"
  "logo-meta_cb5bdfc7.png"
  "logo-openai_37e989e1.webp"
  "logo-nvidia_df0c903a.png"
  "logo-cisco_da5af3b3.webp"
  "logo-dlr_5d97bbc3.png"
  "logo-vantage_f2326b10.webp"
  "logo-zayo_8c0fcd91.webp"
  "logo-doe_6020011e.png"
  "og-image_eefe4d00.png"
)

mkdir -p "$DEST"
fail=0

for a in "${ASSETS[@]}"; do
  printf '%-40s' "$a"
  # --fail makes curl exit non-zero on 4xx/5xx instead of writing an HTML
  # error page to disk under a .png name. Fail loud, not silently corrupt.
  if curl -sSfL --max-time 120 "$SRC/$a" -o "$DEST/$a" 2>/dev/null; then
    echo "OK  ($(du -h "$DEST/$a" | cut -f1))"
  else
    echo "FAILED"
    rm -f "$DEST/$a"
    fail=$((fail+1))
  fi
done

# og-image lives at the site root, not under manus-storage, per index.html.
[ -f "$DEST/og-image_eefe4d00.png" ] && mv "$DEST/og-image_eefe4d00.png" client/public/og-image.png

echo
if [ "$fail" -gt 0 ]; then
  echo "WARNING: $fail asset(s) could not be recovered."
  echo "The Manus deployment may already be offline. You will need to re-source"
  echo "these from your originals before the site renders correctly."
  exit 1
fi
echo "All assets recovered into $DEST"
