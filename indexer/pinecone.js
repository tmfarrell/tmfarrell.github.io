const { Pinecone } = require('@pinecone-database/pinecone');
const path = require('path');

// Load environment variables from the parent directory's .env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

class PineconeManager {
  constructor() {
    this.apiKey = process.env.PINECONE_API_KEY;
    this.indexName = process.env.PINECONE_INDEX;
    
    if (!this.apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }
    
    if (!this.indexName) {
      throw new Error('PINECONE_INDEX environment variable is required');
    }

    this.pinecone = new Pinecone({
      apiKey: this.apiKey
    });
    
    this.index = null;
  }

  /**
   * Initialize connection to Pinecone index
   */
  async initialize() {
    try {
      this.index = this.pinecone.index(this.indexName);
      console.log(`Connected to Pinecone index: ${this.indexName}`);
    } catch (error) {
      throw new Error(`Failed to connect to Pinecone index: ${error.message}`);
    }
  }

  /**
   * Upsert records to Pinecone using native embedding functionality (v7.1.0 API)
   */
  async upsertRecords(chunks, namespace = 'default', batchSize = 25) {
    if (!this.index) {
      throw new Error('Pinecone index not initialized. Call initialize() first.');
    }

    // Format chunks for Pinecone's v7.1.0 native embedding format
    const records = chunks.map(chunk => ({
      id: chunk.id,
      text: chunk.content, // Field name must match the index field mapping
      ...chunk.metadata // Other metadata fields as top-level properties
    }));

    // Process in smaller batches with rate limiting to avoid token limits
    const batches = this.createBatches(records, batchSize);
    let successCount = 0;
    let failureCount = 0;

    console.log(`Processing ${records.length} records in ${batches.length} batches (batch size: ${batchSize})`);
    console.log('Using conservative rate limiting to avoid token limits...\n');

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      try {
        console.log(`Upserting batch ${i + 1}/${batches.length} (${batch.length} records) to namespace: ${namespace}...`);
        
        // Calculate estimated tokens for this batch (rough estimate: ~100 tokens per record)
        const estimatedTokens = batch.reduce((total, record) => {
          return total + (record.text?.length || 0) / 4; // Rough token estimate
        }, 0);
        
        console.log(`  Estimated tokens: ${Math.round(estimatedTokens)}`);
        
        // Use the correct v7.1.0 API format
        await this.index.namespace(namespace).upsertRecords({ records: batch });
        successCount += batch.length;
        
        console.log(`  ✅ Success! (${successCount}/${records.length} total)`);
        
        // Progressive delay to respect rate limits (250k tokens/minute = ~4167 tokens/second)
        // With conservative batching, wait longer between requests
        const delayMs = i < batches.length - 1 ? this.calculateRateLimit(estimatedTokens) : 0;
        if (delayMs > 0) {
          console.log(`  ⏱️  Waiting ${delayMs}ms to respect rate limits...`);
          await this.delay(delayMs);
        }
        
      } catch (error) {
        console.error(`❌ Failed to upsert batch ${i + 1}:`, error.message);
        failureCount += batch.length;
        
        // Handle rate limit errors specifically
        if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
          console.log(`  ⏸️  Rate limit hit, waiting 30 seconds before retry...`);
          await this.delay(30000); // Wait 30 seconds for rate limits
        }
        
        // Retry failed batch once
        try {
          console.log(`  🔄 Retrying batch ${i + 1}...`);
          await this.delay(2000); // Additional delay before retry
          await this.index.namespace(namespace).upsertRecords({ records: batch });
          successCount += batch.length;
          failureCount -= batch.length;
          console.log(`  ✅ Retry successful!`);
        } catch (retryError) {
          console.error(`  ❌ Retry failed for batch ${i + 1}:`, retryError.message);
        }
      }
    }

    return {
      total: records.length,
      successful: successCount,
      failed: failureCount
    };
  }

  /**
   * Query records from Pinecone using text query (v7.1.0 native embedding)
   */
  async queryRecords(queryText, topK = 10, namespace = 'default', filter = null) {
    if (!this.index) {
      throw new Error('Pinecone index not initialized. Call initialize() first.');
    }

    try {
      const searchOptions = {
        query: {
          topK: topK,
          inputs: { text: queryText }
        }
      };

      if (filter) {
        searchOptions.query.filter = filter;
      }

      const result = await this.index.namespace(namespace).searchRecords(searchOptions);
      return result;
    } catch (error) {
      throw new Error(`Failed to query records: ${error.message}`);
    }
  }

  /**
   * Get index stats
   */
  async getIndexStats() {
    if (!this.index) {
      throw new Error('Pinecone index not initialized. Call initialize() first.');
    }

    try {
      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      throw new Error(`Failed to get index stats: ${error.message}`);
    }
  }

  /**
   * Delete records by IDs
   */
  async deleteRecords(ids, namespace = 'default') {
    if (!this.index) {
      throw new Error('Pinecone index not initialized. Call initialize() first.');
    }

    try {
      await this.index.namespace(namespace).deleteMany(ids);
      console.log(`Deleted ${ids.length} records from index`);
    } catch (error) {
      throw new Error(`Failed to delete records: ${error.message}`);
    }
  }

  /**
   * Create batches from array
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Calculate delay needed to respect rate limits
   */
  calculateRateLimit(estimatedTokens) {
    // Rate limit: 250k tokens per minute = ~4167 tokens per second
    const maxTokensPerSecond = 4167;
    const safetyFactor = 0.7; // Use only 70% of the limit for safety
    const safeTokensPerSecond = maxTokensPerSecond * safetyFactor;
    
    if (estimatedTokens > safeTokensPerSecond) {
      // If batch exceeds safe rate, calculate required delay
      const requiredSeconds = estimatedTokens / safeTokensPerSecond;
      return Math.max(2000, Math.round(requiredSeconds * 1000)); // Minimum 2 seconds
    }
    
    return 2000; // Default 2 second delay between batches
  }

  /**
   * Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Legacy method names for backward compatibility
  async upsertVectors(chunks, namespace = 'default', batchSize = 100) {
    return this.upsertRecords(chunks, namespace, batchSize);
  }

  async queryVectors(queryText, topK = 10, namespace = 'default') {
    return this.queryRecords(queryText, topK, namespace);
  }

  async deleteVectors(ids, namespace = 'default') {
    return this.deleteRecords(ids, namespace);
  }
}

module.exports = PineconeManager;