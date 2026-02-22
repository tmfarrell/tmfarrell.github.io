# Jekyll Pinecone Indexing Pipeline

Automated indexing script that converts Jekyll blog content into embeddings stored in Pinecone for semantic retrieval.

## Overview

This pipeline:
1. **Fetches** Jekyll blog content from `content.json`
2. **Chunks** content into 500-800 token pieces with 100 token overlap  
3. **Stores** records in Pinecone using native embedding functionality
4. **Enables** semantic search without managing embedding generation

## Content Sources

The pipeline indexes two types of content:

- **Blog Posts**: Jekyll posts with the following filters applied:
  - ✅ Must have a `categories` field (posts without categories are excluded)
  
- **Portfolio Items**: Items from `_data/portfolio.yaml` including:
  - Project descriptions from your building/portfolio page
  - Organization affiliations
  - Tags and metadata

## Prerequisites

- Node.js 18+
- Pinecone account and API key (with native embedding enabled)
- Jekyll site with `content.json` file

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables:**
   
   **Option A: Using .env file (Recommended)**
   ```bash
   # Copy the example file
   cp ../.env.example ../.env
   
   # Edit .env file with your actual API keys
   # PINECONE_API_KEY=your_pinecone_api_key 
   # PINECONE_INDEX=your_index_name
   ```
   
   **Option B: Export environment variables**
   ```bash
   export PINECONE_API_KEY="your_pinecone_api_key" 
   export PINECONE_INDEX="your_index_name"
   ```

3. **Ensure Jekyll generates `content.json`:**
   
   The `content.json` file should already be configured to:
   - Filter out posts without categories
   - Filter out posts with `hidden: true`
   - Include portfolio items from `_data/portfolio.yaml`

4. **Build your Jekyll site:**
   ```bash
   bundle exec jekyll build
   ```

## Usage

Run the indexing pipeline:

```bash
node index.js
```

The script will:
- Load content from `../content.json` (or fetch from URL if `CONTENT_URL` is set)
- Process all blog posts and portfolio items into semantic chunks
- Upload records to Pinecone with native embedding (Pinecone generates embeddings automatically)
- Enable semantic search across your content

## Configuration

### Environment Variables

The indexer automatically loads environment variables from the top-level `.env` file in your repository root.

**Required Variables:**
- `PINECONE_API_KEY` - Your Pinecone API key  
- `PINECONE_INDEX` - Name of your Pinecone index

**Optional Variables:**
- `PINECONE_INDEX_HOST` - Your index host (if using specific host)
- `PINECONE_NAMESPACE` - Namespace for records (defaults to 'jekyll-blog')
- `CONTENT_URL` - URL to fetch content.json (defaults to local file)
- `CONTENT_PATH` - Path to local content.json (defaults to ../content.json)

**Setup:**
1. Copy `.env.example` to `.env` in your repository root
2. Fill in your actual API keys and configuration

### Chunking Parameters

The chunker splits content with:
- **Max tokens:** 800
- **Min tokens:** 500  
- **Overlap:** 100 tokens

## Content Types

The pipeline processes two content types:

### Blog Posts
```json
{
  "title": "Post Title",
  "url": "/post/url",
  "content": "Post content...",
  "type": "post",
  "date": "2026-01-05",
  "categories": ["writing"],
  "tags": ["AI/ ML", "strategy"]
}
```

### Portfolio Items
```json
{
  "title": "Project Title",
  "url": "https://project-link.com",
  "content": "Project description...",
  "type": "portfolio", 
  "date": "2025-06-01",
  "org": "Organization Name",
  "tags": ["platform", "AI/ ML"]
}
```

## Record Structure

Each record stored in Pinecone (v7.1.0 format) includes:

```json
{
  "id": "content_slug_chunk_index",
  "text": "Content text for embedding...",
  "title": "Content Title",
  "url": "/content/url", 
  "content_excerpt": "First 150 characters...",
  "chunk_index": 0,
  "token_count": 756
}
```

Pinecone automatically generates embeddings from the `text` field using your index's configured embedding model.

## Testing

Run the test suite to validate chunking logic:

```bash
node test.js
```

## Performance

- Handles 100+ posts + portfolio items efficiently
- Completes indexing in under 5 minutes
- Uses Pinecone's native embedding (no external embedding API needed)
- **Smart rate limiting** to avoid token limits (250k tokens/minute)
- **Conservative batching** (25 records per batch with 2+ second delays)
- **Automatic retry logic** with exponential backoff for rate limits
- **Clean metadata** (automatically filters out null/empty values)
- Batched processing to respect API rate limits

## Idempotency

The script uses deterministic IDs based on content URL and chunk index, so running it multiple times won't create duplicates.

## Current Statistics

Based on the current site:
- **38 blog posts** (filtered by categories only, hidden posts now included)
- **14 portfolio items** from your building page
- **52 total items** indexed for semantic search

## File Structure

```
repository-root/
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Environment variables template
├── content.json       # Jekyll template for content generation
├── indexer/
│   ├── index.js           # Main indexing pipeline
│   ├── chunker.js         # Text chunking logic
│   ├── pinecone.js        # Pinecone operations
│   ├── query-example.js   # Example semantic search
│   ├── package.json       # Dependencies
│   ├── test.js            # Test suite
│   └── README.md          # This file
└── _site/
    └── content.json   # Generated JSON content (created by Jekyll build)
```