#!/usr/bin/env bash
set -euo pipefail

# Build the Jekyll site and export the resume page to a PDF using headless Chrome.
# Usage: ./scripts/build_resume_pdf.sh
#
# Output: assets/pdf/Tim_Farrell_Resume.pdf

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_PDF="$REPO_ROOT/assets/pdf/Tim_Farrell_Resume.pdf"
SITE_DIR="$REPO_ROOT/_site"
RESUME_PAGE="$SITE_DIR/resume/index.html"

# Pick a Chrome binary
CHROME_BIN="${CHROME_BIN:-}"
if [[ -z "${CHROME_BIN}" ]]; then
  for c in google-chrome-stable google-chrome chromium-browser chromium chrome; do
    if command -v "$c" >/dev/null 2>&1; then
      CHROME_BIN="$(command -v "$c")"
      break
    fi
  done
fi

if [[ -z "${CHROME_BIN}" ]]; then
  echo "ERROR: No Chrome/Chromium found. Please install google-chrome or chromium." >&2
  exit 1
fi

echo "→ Building site with Jekyll..."
(
  cd "$REPO_ROOT"
  bundle config set --local path 'vendor/bundle' >/dev/null 2>&1 || true
  bundle install >/dev/null
  bundle exec jekyll build
)

if [[ ! -f "$RESUME_PAGE" ]]; then
  echo "ERROR: Built resume page not found at $RESUME_PAGE" >&2
  exit 1
fi

echo "→ Rendering PDF with Chrome: $OUT_PDF"
"$CHROME_BIN" \
  --headless --disable-gpu --no-sandbox \
  --print-to-pdf="$OUT_PDF" \
  --print-to-pdf-no-header \
  "file://$RESUME_PAGE"

echo "✓ Wrote $OUT_PDF"
