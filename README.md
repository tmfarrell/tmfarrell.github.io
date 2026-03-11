# tmfarrell.github.io

Built with Jekyll and hosted on GitHub Pages.

## Quick Start

```bash
# Install dependencies
bundle install

# Run locally (http://localhost:4000)
bundle exec jekyll serve

# Or just build
bundle exec jekyll build
```

## Deployment

Changes pushed to `main` auto-deploy via GitHub Pages.

## Search / AI Mode

The site includes a semantic search feature powered by Pinecone vector DB.

### Rebuild Search Index

After adding new posts or updating portfolio items:

```bash
cd indexer
npm install
node index.js
```

Requires `PINECONE_API_KEY` and `PINECONE_INDEX` in `.env`.

### Frontend Development

To iterate on the search UI without hitting the API:

1. Start the local server: `bundle exec jekyll serve`
2. Visit: `http://localhost:4000/ai-mode/?mock=true`

This loads mock results from `assets/js/search.js` (the `getMockResults` function). Edit this function to test different result formats, tags, styling, etc.

## Content

- Posts: `_posts/` (with `categories: reading` or `categories: writing`)
- Portfolio: `_data/portfolio.yaml`
- Pages: `writing.html`, `reading.html`, `building.html`, `ai-mode.html`

Running `jekyll build` generates `_site/content.json` with all searchable content.
