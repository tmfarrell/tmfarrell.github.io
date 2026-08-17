---
name: kindle-read-post
description: Create a "read" post for this Jekyll site from a book's Kindle highlights. Use when the user provides a Kindle Notebook HTML export (the "<Book> - Notebook.html" file) or a highlights CSV (Readwise, Amazon, clippings.io), or asks you to make a reading/read post from their highlights. Parses the file, then writes a post in `_posts/` following the site's existing "re_" reading-post conventions.
---

# Kindle Highlights → Read Post

Turn a book's Kindle highlights into a polished "read" post for this blog. The post must look and read like the existing reading posts in `_posts/` (files named `YYYY-MM-DD-re_*.md` with `categories: reading`).

## When to Use

- The user hands you a Kindle Notebook HTML file (e.g. `docs/Outlive - Notebook.html`) or a highlights CSV.
- The user says things like "make a read post from my highlights", "post my Kindle notes for this book", "create a reading post for Outlive", etc.
- Do NOT use this for general writing posts — only reading posts sourced from highlights.

## How It Works

1. Locate the input file.
2. Parse it with the bundled script into JSON.
3. Confirm a few choices with the user (date, draft vs published, presentation style, tags).
4. Gather book metadata (published date, Amazon link).
5. Write the post.
6. Verify with a Jekyll build.
7. Offer follow-ups (search index, preview).

---

## Step 1 — Locate the input file

If the user didn't give a path, look for it:
- Check `docs/` for files like `<Book> - Notebook.html` (already has `docs/Outlive - Notebook.html`).
- Check `~/Downloads` for Kindle Notebook exports or CSV exports.

If you find more than one candidate, ask which one. If nothing is found, ask the user for the path.

## Step 2 — Parse the file

Run the bundled parser:

```bash
python3 .agents/skills/kindle-read-post/scripts/parse_highlights.py "<input file>" -o /tmp/highlights.json
```

Then read the output JSON. It contains:
- `title` — book title
- `author` — book author
- `highlight_count` — usable highlights (bookmarks already skipped, duplicates already removed)
- `skipped_bookmarks` — how many location bookmarks were dropped
- `highlights` — ordered list, each with `type`, `color`, `page`, `location`, `text`, and optionally `comment` (your own note on that highlight, from CSV exports)

Supported inputs:
- **Kindle Notebook HTML** — Kindle's "Notebook export" (`<Book> - Notebook.html`).
- **CSV** — Readwise / Amazon / clippings.io exports. Columns are auto-detected by header name (`Highlight`/`Quote`, `Book Title`, `Book Author`, `Location`, `Page`, `Color`, `Note`, `Type`, `Date`).

Report a one-line summary to the user: `"Outlive" by Peter Attia — 80 highlights parsed (6 bookmarks skipped).`

If the parser errors or produces something surprising, investigate before proceeding — don't write a post from garbage input.

## Step 3 — Confirm choices with the user

Ask via the question tool (batch the questions in one call). Defaults are marked "Recommended":

1. **Post date** — Today (recommended) or a specific date. Controls the filename prefix and the `date` frontmatter field.
2. **Draft or publish?** — Draft with `hidden: true` (recommended; recent posts are drafts until finished) or publish-ready (no `hidden`).
3. **Presentation style** — how to turn raw highlights into prose:
   - **Takeaways (recommended)** — matches the site's voice: each highlight gets a short first-person takeaway above it, related highlights grouped under `### Section` headings.
   - **Raw highlights** — every highlight as a blockquote, minimal commentary.
   - **Summary + best of** — a short intro, then only the strongest highlights.
4. **Tags** — propose tags based on the book's subject (see the tag rules below) and confirm. Offer "no tags" as an option.

For large notebooks (>25 highlights), also flag that you'll curate/group rather than bloat the post — confirm that's OK.

If the user can't answer right now, proceed with the recommended defaults and tell them what you chose.

## Step 4 — Book metadata

You need two things for the header table:

- **Published date** — look it up (WebSearch `"<book title>" <author> publication date`). If you can't verify it, put a best guess and tell the user to fix it, or ask.
- **Amazon link** — every reading post links the book title to an Amazon product page, e.g. `[Outlive: The Science and Art of Longevity](https://www.amazon.com/dp/0593236599)`. Search Amazon for the book if the user didn't provide a URL. If a stable `/dp/<ASIN>` link is available, prefer it. If you can't find one, ask the user.

## Step 5 — Write the post

### Filename

`_posts/YYYY-MM-DD-re_<slug>.md` where:
- `YYYY-MM-DD` is the chosen date,
- `<slug>` is the title in lowercase with non-alphanumerics replaced by `_` (e.g. `The Psychology of Money` → `re_psychology_of_money`, `Outlive` → `re_outlive`).
- Prefix with `re_` (existing convention: `re_psychology_of_money.md`, `re_7_powers.md`).

### Frontmatter

Match the existing posts exactly:

```yaml
---
toc: true
layout: post
title:  'Book Title'
date:   2025-08-14 08:00
categories: reading
hidden: true
tags: [health, longevity]
---
```

- `title` — the book title in single quotes.
- `date` — `YYYY-MM-DD HH:MM` (08:00 is the common choice).
- `categories: reading` — required, this is what puts it on the Reading page.
- `hidden: true` — only when the user chose "Draft".
- `tags` — comma-separated list inside brackets. Existing tags used on this site: `business`, `strategy`, `execution`, `leadership/ management`, `health`, `longevity`, `product`. Pick 1-3 that fit the book; put `health`/`longevity` for bio-health books.

### Header table

Immediately after the frontmatter:

```markdown
| **Book** | [Outlive: The Science and Art of Longevity](https://www.amazon.com/dp/0593236599) |
| **Author** | Peter Attia |
| **Published** | March 28, 2023 |
```

Note the format: `| **Book** | [Title](link) |`, `| **Author** | Name |`, `| **Published** | Date |`. Two blank lines follow before the body.

### Body — the important part

The site's reading posts are NOT raw dump of quotes. They are the reader's distillation: a short takeaway in the author's own words, followed by the highlight that backs it up. Model your output on these existing posts:

- `_posts/2023-06-01-re_psychology_of_money.md` — no headings; each takeaway is 1-2 sentences then a blockquote.
- `_posts/2025-10-05-re_7_powers.md` — grouped under `### Section` headings, takeaway then blockquote.
- `_posts/2024-06-02-re_effective_exec.md` — grouped under `### Section` headings, blockquotes may come before the takeaway.

**Takeaways style (recommended):**

For each highlight:
1. Write a 1-3 sentence takeaway in the first person, in the site's voice — plain, direct, opinionated, product/health lens. Short. No preamble like "This is a quote from the book". It reads like you're explaining the idea to a colleague.
2. Below it, the verbatim highlight as a blockquote (`>`).
3. Group related highlights under `### Section Heading` when they cluster into themes (Outlive → "Four Horsemen", "Exercise as the drug", "Sleep", "Nutrition").

Multi-paragraph highlights: continue with `>` on each paragraph (see `re_effective_exec.md`). Keep long highlights verbatim — this site keeps them long (see `re_psychology_of_money.md`) rather than trimming aggressively.

Use the user's own `comment` (if the CSV had one) as the takeaway or to enrich it — it's literally their note on that highlight.

**Raw style:** every highlight as a blockquote, in reading order, with blank lines between. Optionally a one-line intro.

**Summary + best of:** a short intro paragraph (your overall take on the book, 2-4 sentences), then pick the ~10 strongest highlights with brief takeaways. End with a "Read if..." line if it feels natural.

**Handling edge cases:**
- If a highlight is clearly duplicated by another (near-identical), keep one.
- If a highlight is very long (>~400 words), you may split it into two blockquotes or keep verbatim — this site prefers verbatim, so only split if it truly reads better.
- `Note` type entries (your own notes, not quotes) — weave the content into takeaways rather than blockquoting them.
- Don't invent facts or add "fake" quotes — everything in blockquotes must be verbatim from the parsed JSON.

## Step 6 — Verify

Build the site and confirm the post compiles and is picked up:

```bash
bundle exec jekyll build
```

- Fix any Jekyll errors (common: unclosed markdown table, YAML frontmatter typo, `>` inside a table).
- Confirm the file appears in `_site/reading/YYYY/MM/DD/re_<slug>/index.html` (it will if `categories: reading` is right).
- Note: `docs/` is excluded from the build (`_config.yml`), so any source HTML sitting there won't leak into the site.

## Step 7 — Follow-ups

Offer, don't assume:

- **Preview**: `bundle exec jekyll serve` and open http://localhost:4000/reading/.
- **Search index** (AI Mode): `cd indexer && npm install && node index.js` — requires `PINECONE_API_KEY` in `.env`. Only run if the user wants the post searchable.
- **Commit**: only if the user asks.

## Recipe-checks before you call the post done

- [ ] Filename is `_posts/YYYY-MM-DD-re_<slug>.md`
- [ ] Frontmatter has `layout: post`, `categories: reading`, single-quoted `title`, `date`
- [ ] `hidden: true` present iff the user chose draft
- [ ] Header table has Book (with link), Author, Published
- [ ] Every blockquote is verbatim from the parsed highlights
- [ ] Takeaways are short, first-person, and read like the existing posts
- [ ] `bundle exec jekyll build` passes with no new errors
