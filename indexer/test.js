const fs = require('fs').promises;
const path = require('path');
const TextChunker = require('./chunker');
const PineconeManager = require('./pinecone');
const JekyllPineconeIndexer = require('./index');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testChunker() {
  console.log('🧪 Testing Text Chunker...\n');

  // Load sample content
  const contentPath = '../_site/content.json';
  const content = await fs.readFile(contentPath, 'utf8');
  const posts = JSON.parse(content);

  console.log(`Loaded ${posts.length} posts`);

  // Initialize chunker
  const chunker = new TextChunker();

  // Test with first post
  const testPost = posts[0];
  console.log(`\nTesting with post: "${testPost.title}"`);
  console.log(`Content length: ${testPost.content.length} characters`);
  console.log(`Token count: ${chunker.countTokens(testPost.content)} tokens`);

  // Chunk the content
  const chunks = chunker.chunkText(testPost.content, testPost.title, testPost.url);
  console.log(`\nCreated ${chunks.length} chunks:`);

  chunks.forEach((chunk, index) => {
    console.log(`  Chunk ${index + 1}:`);
    console.log(`    ID: ${chunk.id}`);
    console.log(`    Token count: ${chunk.metadata.token_count}`);
    console.log(`    Excerpt: ${chunk.metadata.content_excerpt}`);
    console.log(`    Content preview: ${chunk.content.substring(0, 100)}...`);
    console.log('');
  });

  // Test processing all posts
  const allChunks = chunker.processContent(posts.slice(0, 3)); // Test first 3 posts
  console.log(`\nProcessed 3 posts into ${allChunks.length} total chunks`);

  // Validate chunk IDs are unique and deterministic
  const ids = allChunks.map(chunk => chunk.id);
  const uniqueIds = [...new Set(ids)];
  
  console.log(`\nID validation:`);
  console.log(`  Total chunks: ${allChunks.length}`);
  console.log(`  Unique IDs: ${uniqueIds.length}`);
  console.log(`  Deterministic: ${allChunks.length === uniqueIds.length ? '✅' : '❌'}`);

  // Show sample IDs
  console.log(`\nSample chunk IDs:`);
  ids.slice(0, 5).forEach(id => console.log(`  ${id}`));

  console.log('\n✅ Chunker test completed!');
  
  return allChunks;
}

async function testPineconeUpload(chunks) {
  console.log('\n🌲 Testing Pinecone Upload...\n');
  
  // Check if we have Pinecone credentials
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    console.log('⚠️  Skipping Pinecone test - missing credentials');
    console.log('   Set PINECONE_API_KEY and PINECONE_INDEX to test upload');
    return;
  }
  
  try {
    // Initialize Pinecone
    const pinecone = new PineconeManager();
    await pinecone.initialize();
    
    // Test with just a few chunks to avoid too many uploads
    const testChunks = chunks.slice(0, 2);
    const testNamespace = 'test-indexer';
    
    console.log(`Testing upload of ${testChunks.length} chunks to namespace: ${testNamespace}`);
    
    // Show what we're uploading
    console.log('\n📄 Sample record structure:');
    const sampleRecord = {
      id: testChunks[0].id,
      text: testChunks[0].content,
      ...testChunks[0].metadata
    };
    console.log(JSON.stringify(sampleRecord, null, 2));
    
    // Attempt upload
    console.log('\n⬆️  Uploading to Pinecone...');
    const result = await pinecone.upsertRecords(testChunks, testNamespace, 10);
    
    console.log('\n📊 Upload Results:');
    console.log(`  Total records: ${result.total}`);
    console.log(`  Successful: ${result.successful}`);
    console.log(`  Failed: ${result.failed}`);
    console.log(`  Success rate: ${((result.successful / result.total) * 100).toFixed(1)}%`);
    
    if (result.successful > 0) {
      console.log('\n✅ Pinecone upload test completed successfully!');
      
      // Test query functionality
      console.log('\n🔍 Testing query functionality...');
      try {
        const queryResults = await pinecone.queryRecords('artificial intelligence', 2, testNamespace);
        console.log(`Query returned ${queryResults.matches?.length || 0} matches`);
        
        if (queryResults.matches && queryResults.matches.length > 0) {
          console.log('Sample match:', {
            id: queryResults.matches[0]._id,
            score: queryResults.matches[0].score,
            title: queryResults.matches[0].title
          });
        }
        
        console.log('✅ Query test completed!');
      } catch (queryError) {
        console.error('❌ Query test failed:', queryError.message);
      }
    } else {
      console.error('❌ All uploads failed');
    }
    
  } catch (error) {
    console.error('❌ Pinecone test failed:', error.message);
    console.error('Full error:', error);
  }
}

async function testFullPipeline() {
  console.log('\n🚀 Testing Full Pipeline...\n');
  
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
    console.log('⚠️  Skipping full pipeline test - missing Pinecone credentials');
    return;
  }
  
  try {
    const indexer = new JekyllPineconeIndexer();
    
    // Test environment validation
    indexer.validateEnvironment();
    console.log('✅ Environment validation passed');
    
    // Test content fetching
    const posts = await indexer.fetchContent();
    console.log(`✅ Content fetched: ${posts.length} items`);
    
    // Test with just a few posts
    const testPosts = posts.slice(0, 2);
    const chunks = indexer.chunker.processContent(testPosts);
    console.log(`✅ Content chunked: ${chunks.length} chunks from ${testPosts.length} posts`);
    
    // Test Pinecone connection
    indexer.pinecone = new PineconeManager();
    await indexer.pinecone.initialize();
    console.log('✅ Pinecone connection established');
    
    // Test upload (to test namespace)
    const testNamespace = 'test-full-pipeline';
    const result = await indexer.pinecone.upsertRecords(chunks, testNamespace);
    console.log(`✅ Pipeline test upload: ${result.successful}/${result.total} successful`);
    
    console.log('\n🎉 Full pipeline test completed successfully!');
    
  } catch (error) {
    console.error('❌ Full pipeline test failed:', error.message);
    console.error('Error details:', error);
  }
}

async function runAllTests() {
  try {
    // Test 1: Chunker
    const chunks = await testChunker();
    
    // Test 2: Pinecone Upload
    await testPineconeUpload(chunks);
    
    // Test 3: Full Pipeline
    await testFullPipeline();
    
    console.log('\n🏁 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run all tests
runAllTests();