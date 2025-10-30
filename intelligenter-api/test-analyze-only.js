// Direct test of the analysis function only
import { analyzeDomain, getDomainByName } from './src/services/domainService.js';

async function testAnalysis() {
  try {
    console.log('🧪 Testing Analysis Function\n');
    
    // Test on existing domain
    console.log('🔍 Running analysis on existing domain "amazon.com"...\n');
    
    const analyzedDomain = await analyzeDomain('amazon.com');
    
    console.log('✅ Analysis Complete!');
    console.log('📊 Results:', JSON.stringify(analyzedDomain, null, 2));
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testAnalysis();