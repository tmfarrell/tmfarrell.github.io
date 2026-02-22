const { encoding_for_model } = require('tiktoken');

class TextChunker {
  constructor() {
    this.encoding = encoding_for_model('text-embedding-3-small');
    this.maxTokens = 800;
    this.minTokens = 500;
    this.overlap = 100;
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
    // Create deterministic ID
    const slug = this.createSlug(title, url);
    const id = `${slug}_chunk_${index}`;
    
    // Create content excerpt (first 150 characters)
    const excerpt = content.length > 150 
      ? content.substring(0, 147) + '...'
      : content;

    // Filter out null/undefined values from metadata
    const cleanMetadata = this.filterNullValues({
      title,
      url,
      content_excerpt: excerpt,
      chunk_index: index,
      token_count: this.countTokens(content),
      // Include all original metadata from content.json
      ...originalMetadata
    });

    return {
      id,
      content,
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
   * Create a URL-safe slug from title and URL
   */
  createSlug(title, url) {
    // Use URL path if available, otherwise fallback to title
    if (url && url !== '/') {
      return url.replace(/^\//, '').replace(/\//g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    }
    
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_');
  }

  /**
   * Process all posts and return chunked data
   */
  processContent(posts) {
    const allChunks = [];
    
    for (const post of posts) {
      // Extract original metadata (exclude title, url, content as they're handled separately)
      const { title, url, content, ...originalMetadata } = post;
      
      const chunks = this.chunkText(post.content, post.title, post.url, originalMetadata);
      allChunks.push(...chunks);
    }

    return allChunks;
  }
}

module.exports = TextChunker;