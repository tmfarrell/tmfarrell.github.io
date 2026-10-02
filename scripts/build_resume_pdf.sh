#!/usr/bin/env bash
set -euo pipefail

# Build the Jekyll site and export the resume page to a PDF using headless Chrome.
# Usage: ./scripts/build_resume_pdf.sh
#
# Output: assets/pdf/Tim_Farrell_Resume.pdf
# Override the browser with CHROME_BIN=/path/to/chrome if needed.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_PDF="$REPO_ROOT/assets/pdf/Tim_Farrell_Resume.pdf"
SITE_DIR="$REPO_ROOT/_site"
RESUME_PAGE="$SITE_DIR/resume/index.html"
TIMEOUT_SECS=60

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
  for c in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
    if [[ -x "$c" ]]; then
      CHROME_BIN="$c"
      break
    fi
  done
fi

if [[ -z "${CHROME_BIN}" ]]; then
  echo "ERROR: No Chrome/Chromium found. Install Google Chrome or set CHROME_BIN." >&2
  exit 1
fi

# Uses the gems already installed; doesn't run `bundle install`, which can rewrite Gemfile.lock.
if ! (cd "$REPO_ROOT" && bundle check >/dev/null 2>&1); then
  echo "ERROR: Gems are missing. Run 'bundle install' first, then re-run this script." >&2
  exit 1
fi

echo "→ Building site with Jekyll..."
(cd "$REPO_ROOT" && bundle exec jekyll build --quiet)

if [[ ! -f "$RESUME_PAGE" ]]; then
  echo "ERROR: Built resume page not found at $RESUME_PAGE" >&2
  exit 1
fi

echo "→ Rendering PDF with Chrome: $OUT_PDF"
PROFILE_DIR="$(mktemp -d)"
trap 'rm -rf "$PROFILE_DIR"' EXIT
rm -f "$OUT_PDF"

# Headless Chrome on macOS sometimes hangs after writing the PDF, so wait for
# the file and then stop Chrome ourselves.
"$CHROME_BIN" \
  --headless --disable-gpu --no-sandbox \
  --user-data-dir="$PROFILE_DIR" \
  --no-pdf-header-footer --print-to-pdf-no-header \
  --print-to-pdf="$OUT_PDF" \
  "file://$RESUME_PAGE" >/dev/null 2>&1 &
CHROME_PID=$!

for ((i = 0; i < TIMEOUT_SECS; i++)); do
  if ! kill -0 "$CHROME_PID" 2>/dev/null; then
    break
  fi
  if [[ -s "$OUT_PDF" ]]; then
    sleep 1
    break
  fi
  sleep 1
done
kill "$CHROME_PID" 2>/dev/null || true
wait "$CHROME_PID" 2>/dev/null || true

if [[ ! -s "$OUT_PDF" ]]; then
  echo "ERROR: Chrome did not write $OUT_PDF within ${TIMEOUT_SECS}s." >&2
  exit 1
fi

PAGES="$( (grep -ao '/Count [0-9]*' "$OUT_PDF" || true) | awk '{print $2}' | sort -n | tail -1)"
echo "✓ Wrote $OUT_PDF (${PAGES:-?} page(s))"
if [[ "${PAGES:-1}" -gt 1 ]]; then
  echo "  Note: the resume no longer fits on one page." >&2
fi
