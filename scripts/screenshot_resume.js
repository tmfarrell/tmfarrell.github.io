#!/usr/bin/env node
/**
 * Render a PNG preview of the resume using the page's print CSS.
 * Requires: npm i puppeteer-core
 * Uses the system Chrome if available.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

async function resolveChromePath() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  for (const cand of candidates) {
    try {
      await fs.promises.access(cand, fs.constants.X_OK);
      return cand;
    } catch {}
  }
  return null;
}

(async () => {
  const puppeteer = require('puppeteer-core');
  const repoRoot = path.resolve(__dirname, '..');
  const srcHtml = process.argv[2] || path.join(os.tmpdir(), 'resume_print.html');
  const outPng = process.argv[3] || '/opt/cursor/artifacts/resume-preview.png';

  const chromePath = await resolveChromePath();
  if (!chromePath) {
    console.error('ERROR: No Chrome/Chromium found. Set CHROME_BIN.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  try {
    const page = await browser.newPage();
    // Use print styles to match the PDF output
    await page.emulateMediaType('print');
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 2 });

    const fileUrl = `file://${srcHtml}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outPng, fullPage: true });
    console.log(`✓ Wrote PNG preview: ${outPng}`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

