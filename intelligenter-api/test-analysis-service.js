// Direct test of the analysis service
import { analyzeDomain, createDomain, getDomainByName } from './src/services/domainService.js';

async function testAnalysisService() {
  try {
    console.log('🧪 Testing Analysis Service\n');
    
    // Step 1: Create a test domain
    console.log('📝 Step 1: Creating test domain "amazon.com"...');
    const newDomain = await createDomain({
      domain: 'amazon.com',
      status: 'onAnalysis'
    });
    console.log('✅ Domain created:', {
      id: newDomain.id,
      domain: newDomain.domain,
      status: newDomain.status
    });
    console.log('');

    // Step 2: Run analysis
    console.log('🔍 Step 2: Running analysis...');
    console.log('This will simulate:');
    console.log('  - VirusTotal API call');
    console.log('  - Whois API call');
    console.log('  - Reputation scoring');
    console.log('');
    
    const analyzedDomain = await analyzeDomain('amazon.com');
    
    console.log('✅ Analysis Complete!');
    console.log('');
    console.log('📊 Results:');
    console.log('  - Domain:', analyzedDomain.domain);
    console.log('  - Status:', analyzedDomain.status);
    console.log('  - Reputation Score:', analyzedDomain.reputation_score, '/100');
    console.log('  - Is Malicious:', analyzedDomain.is_malicious);
    console.log('  - Last Updated:', analyzedDomain.last_updated);
    console.log('');

    if (analyzedDomain.vt_data) {
      console.log('🦠 VirusTotal Data:');
      const stats = analyzedDomain.vt_data.data.attributes.last_analysis_stats;
      console.log('  - Malicious detections:', stats.malicious);
      console.log('  - Suspicious detections:', stats.suspicious);
      console.log('  - Harmless detections:', stats.harmless);
      console.log('  - Undetected:', stats.undetected);
      console.log('');
    }

    if (analyzedDomain.whois_data) {
      console.log('📋 Whois Data:');
      console.log('  - Registrar:', analyzedDomain.whois_data.registrar);
      console.log('  - Created:', new Date(analyzedDomain.whois_data.creation_date).toLocaleDateString());
      console.log('  - Expires:', new Date(analyzedDomain.whois_data.expiration_date).toLocaleDateString());
      console.log('  - Status:', analyzedDomain.whois_data.status);
      console.log('  - DNSSEC:', analyzedDomain.whois_data.dnssec);
      console.log('');
    }

    console.log('✅ Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:',  error.message);
    console.error(error);
    process.exit(1);
  }
}

testAnalysisService();