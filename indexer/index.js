const fs = require('fs').promises;
const path = require('path');
const TextChunker = require('./chunker');
const PineconeManager = require('./pinecone');

// Load environment variables from the parent directory's .env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

class JekyllPineconeIndexer {
  constructor() {
    // Initialize components
    this.chunker = new TextChunker();
    this.pinecone = null;
    
    // Configuration
    this.contentPath = process.env.CONTENT_PATH || '../_site/content.json';
    this.contentUrl = process.env.CONTENT_URL || 'https://tmfarrell.github.io/content.json';
    this.namespace = process.env.PINECONE_NAMESPACE || 'jekyll-blog';
  }

  /**
   * Main indexing pipeline
   */
  async run() {
    try {
      console.log('🚀 Starting Jekyll Pinecone indexing pipeline...\n');

      // Step 1: Validate environment
      this.validateEnvironment();

      // Initialize Pinecone after validation
      this.pinecone = new PineconeManager();

      // Step 2: Fetch content
      console.log('📖 Fetching blog content...');
      const posts = await this.fetchContent();
      console.log(`Found ${posts.length} items\n`);

      // Step 3: Chunk content
      console.log('✂️  Chunking content...');
      const chunks = this.chunker.processContent(posts);
      console.log(`Created ${chunks.length} chunks\n`);

      // Step 4: Initialize Pinecone
      console.log('🌲 Connecting to Pinecone...');
      await this.pinecone.initialize();

      // Step 5: Upsert to Pinecone (with native embedding)
      console.log('💾 Uploading records to Pinecone with native embedding...');
      const result = await this.pinecone.upsertRecords(chunks, this.namespace);
      
      // Step 6: Report results
      this.reportResults(result, posts.length, chunks.length);

      console.log('✅ Indexing pipeline completed successfully!');

    } catch (error) {
      console.error('❌ Indexing pipeline failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Validate required environment variables
   */
  validateEnvironment() {
    const required = ['PINECONE_API_KEY', 'PINECONE_INDEX'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Fetch content from Jekyll site
   */
  async fetchContent() {
    try {
      // Try to read local file first
      if (await this.fileExists(this.contentPath)) {
        console.log(`Reading content from local file: ${this.contentPath}`);
        const content = await fs.readFile(this.contentPath, 'utf8');
        
        // Debug: Show first few characters
        console.log(`File size: ${content.length} characters`);
        console.log(`First 100 characters: ${content.substring(0, 100).replace(/\n/g, '\\n')}`);
        
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.error('JSON Parse Error Details:');
          console.error(`  Message: ${parseError.message}`);
          console.error(`  Position: ${parseError.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
          
          // Show context around error position
          if (parseError.message.includes('position')) {
            const position = parseInt(parseError.message.match(/position (\d+)/)?.[1] || '0');
            const start = Math.max(0, position - 50);
            const end = Math.min(content.length, position + 50);
            console.error(`  Context: ...${content.substring(start, end).replace(/\n/g, '\\n')}...`);
          }
          
          throw parseError;
        }
      }
      
      // Fallback to HTTP fetch
      console.log(`Fetching content from: ${this.contentUrl}`);
      const response = await fetch(this.contentUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log(`Downloaded ${text.length} characters from ${this.contentUrl}`);
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Remote JSON Parse Error:');
        console.error(`  URL: ${this.contentUrl}`);
        console.error(`  Message: ${parseError.message}`);
        console.error(`  First 100 chars: ${text.substring(0, 100).replace(/\n/g, '\\n')}`);
        throw parseError;
      }
      
    } catch (error) {
      throw new Error(`Failed to fetch content: ${error.message}`);
    }
  }



  /**
   * Check if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Report indexing results
   */
  reportResults(result, postCount, chunkCount) {
    console.log('\n📊 Indexing Results:');
    console.log(`  Content processed: ${postCount} items`);
    console.log(`  Chunks created: ${chunkCount}`);
    console.log(`  Records uploaded: ${result.successful}/${result.total}`);
    
    if (result.failed > 0) {
      console.warn(`  Failed uploads: ${result.failed}`);
    }
    
    console.log(`  Success rate: ${((result.successful / result.total) * 100).toFixed(1)}%\n`);
  }
}

// Run the indexer if this file is executed directly
if (require.main === module) {
  const indexer = new JekyllPineconeIndexer();
  indexer.run();
}

module.exports = JekyllPineconeIndexer;