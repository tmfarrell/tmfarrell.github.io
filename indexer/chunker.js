const { encoding_for_model } = require('tiktoken');

class TextChunker {
  constructor() {
    this.encoding = encoding_for_model('text-embedding-3-small');
    this.maxTokens = 1000;
    this.minTokens = 500;
    this.overlap = 100;
    this.excerptLength = 250;
  }

  /**
   * Count tokens in text using tiktoken
   */
  countTokens(text) {
    return this.encoding.encode(text).length;
  }

  /**
   * Split text into chunks with token-based boundaries
   */
  chunkText(text, title = '', url = '', originalMetadata = {}) {
    // Clean text
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (!cleanText) return [];
    
    const words = cleanText.split(' ');
    const chunks = [];
    let currentChunk = '';
    let chunkIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const testChunk = currentChunk ? `${currentChunk} ${words[i]}` : words[i];
      const tokenCount = this.countTokens(testChunk);

      if (tokenCount <= this.maxTokens) {
        currentChunk = testChunk;
      } else {
        // If current chunk meets minimum token requirement, save it
        if (this.countTokens(currentChunk) >= this.minTokens) {
          chunks.push(this.createChunk(currentChunk, title, url, chunkIndex, originalMetadata));
          chunkIndex++;

          // Start new chunk with overlap
          const overlapWords = this.getOverlapWords(currentChunk);
          currentChunk = overlapWords ? `${overlapWords} ${words[i]}` : words[i];
        } else {
          // Current chunk is too small, just add the word
          currentChunk = testChunk;
        }
      }
    }

    // Add the final chunk if it exists and meets minimum requirements
    if (currentChunk && this.countTokens(currentChunk) >= this.minTokens) {
      chunks.push(this.createChunk(currentChunk, title, url, chunkIndex, originalMetadata));
    } else if (currentChunk && chunks.length === 0) {
      // If it's the only chunk, add it regardless of size
      chunks.push(this.createChunk(currentChunk, title, url, chunkIndex, originalMetadata));
    }

    return chunks;
  }

  /**
   * Get overlap words from the end of a chunk
   */
  getOverlapWords(chunk) {
    const words = chunk.split(' ');
    let overlapWords = '';
    
    for (let i = words.length - 1; i >= 0; i--) {
      const testOverlap = words.slice(i).join(' ');
      if (this.countTokens(testOverlap) <= this.overlap) {
        overlapWords = testOverlap;
      } else {
        break;
      }
    }
    
    return overlapWords;
  }

  /**
   * Create a chunk object with metadata
   */
  createChunk(content, title, url, index, originalMetadata = {}) {
    // Extract category and tags for searchable text
    const { category, tags, ...metaWithoutCategoryTags } = originalMetadata;
    
    // Create content excerpt
    const excerpt = content.length > this.excerptLength 
      ? content.substring(0, this.excerptLength - 3) + '...'
      : content;

    // Build searchable content with date, category, tags, and org appended to each chunk.
    // Date goes in the text because chat reads this field, not the metadata date.
    // Skill and about pages use a placeholder date, so leave those undated.
    let searchableContent = `[title: ${title}] ${content}`;
    const dateLabel = originalMetadata.dates || originalMetadata.date;
    if (dateLabel && category !== 'skills' && category !== 'about') {
      searchableContent = `${searchableContent} [Date: ${dateLabel}]`;
    }
    if (category) {
      searchableContent = `${searchableContent} [Category: ${category}]`;
    }
    if (tags && Array.isArray(tags) && tags.length > 0) {
      searchableContent = `${searchableContent} [Tags: ${tags.join(', ')}]`;
    }
    if (originalMetadata.org) {
      searchableContent = `${searchableContent} [Org: ${originalMetadata.org}]`;
    }

    // Create deterministic ID
    const slug = this.createSlug(title, url);
    const id = `${slug}_chunk_${index}`;

    // Filter out null/undefined values from metadata
    const cleanMetadata = this.filterNullValues({
      title,
      url,
      content_excerpt: excerpt,
      chunk_index: index,
      token_count: this.countTokens(searchableContent),
      // Include all original metadata from content.json
      ...originalMetadata
    });

    return {
      id,
      content: searchableContent,
      metadata: cleanMetadata
    };
  }

  /**
   * Filter out null, undefined, and empty values from an object
   */
  filterNullValues(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '') {
        // Handle arrays - only include non-empty arrays
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleaned[key] = value;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  }

  /**
   * Create a URL-safe slug from title and URL.
   * Title is included whenever a URL is present so roles that share an employer
   * homepage (OM1, Day Zero) do not overwrite each other on upsert.
   */
  createSlug(title, url) {
    const titleSlug = String(title || '')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_');

    if (url && url !== '/') {
      const urlSlug = url.replace(/^\//, '').replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '').replace(/_+$/g, '');
      return titleSlug ? `${urlSlug}_${titleSlug}` : urlSlug;
    }

    return titleSlug;
  }

  /**
   * Process all posts and return chunked data
   */
  processContent(posts) {
    const allChunks = [];
    
    for (const post of posts) {
      // Extract original metadata (exclude title, url, content as they're handled separately)
      const { title, url, content, ...originalMetadata } = post;
      
      const chunks = this.chunkText(content, post.title, post.url, originalMetadata);
      allChunks.push(...chunks);
    }

    return allChunks;
  }
}

module.exports = TextChunker;