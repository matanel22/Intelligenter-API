const { Client } = require('pg');
require('dotenv').config();

async function testAnalysisService() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Test 1: Add a domain via API
    console.log('📝 Test 1: Adding domain "example.com" to database...');
    const insertResult = await client.query(`
      INSERT INTO domains (domain, status) 
      VALUES ('example.com', 'onAnalysis') 
      ON CONFLICT (domain) DO UPDATE SET status = 'onAnalysis'
      RETURNING id, domain, status
    `);
    console.log('✅ Domain added:', insertResult.rows[0]);
    console.log('');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Check for analysis results
    console.log('📊 Test 2: Checking analysis results...');
    const domainResult = await client.query(`
      SELECT 
        d.id,
        d.domain,
        d.status,
        d.reputation_score,
        d.is_malicious,
        d.vt_data,
        d.whois_data,
        d.last_updated
      FROM domains d
      WHERE d.domain = 'example.com'
    `);

    if (domainResult.rows.length > 0) {
      const domain = domainResult.rows[0];
      console.log('Domain Status:', domain.status);
      console.log('Reputation Score:', domain.reputation_score || 'Not analyzed yet');
      console.log('Is Malicious:', domain.is_malicious !== null ? domain.is_malicious : 'Not analyzed yet');
      console.log('Last Updated:', domain.last_updated || 'Never');
      console.log('');

      if (domain.vt_data) {
        console.log('🔍 VirusTotal Data:');
        const vt = domain.vt_data.data.attributes;
        console.log('  - Malicious detections:', vt.last_analysis_stats.malicious);
        console.log('  - Clean detections:', vt.last_analysis_stats.harmless);
        console.log('  - Reputation:', vt.reputation);
        console.log('');
      }

      if (domain.whois_data) {
        console.log('📋 Whois Data:');
        console.log('  - Registrar:', domain.whois_data.registrar);
        console.log('  - Created:', new Date(domain.whois_data.creation_date).toLocaleDateString());
        console.log('  - Expires:', new Date(domain.whois_data.expiration_date).toLocaleDateString());
        console.log('  - Status:', domain.whois_data.status);
        console.log('');
      }
    }

    // Test 3: Check analysis records
    console.log('📈 Test 3: Checking analysis records...');
    const analysisResult = await client.query(`
      SELECT 
        da.*,
        d.domain
      FROM domain_analyses da
      JOIN domains d ON da.domain_id = d.id
      WHERE d.domain = 'example.com'
      ORDER BY da.analyzed_at DESC
      LIMIT 1
    `);

    if (analysisResult.rows.length > 0) {
      const analysis = analysisResult.rows[0];
      console.log('✅ Latest Analysis Found:');
      console.log('  - Domain:', analysis.domain);
      console.log('  - Overall Score:', analysis.score, '/100');
      console.log('  - Performance:', analysis.metrics.performance);
      console.log('  - SEO:', analysis.metrics.seo);
      console.log('  - Security:', analysis.metrics.security);
      console.log('  - Accessibility:', analysis.metrics.accessibility);
      console.log('  - Analyzed at:', new Date(analysis.analyzed_at).toLocaleString());
      console.log('  - Suggestions:');
      analysis.suggestions.forEach((suggestion, index) => {
        console.log(`    ${index + 1}. ${suggestion}`);
      });
    } else {
      console.log('⏳ No analysis results yet (analysis might still be running)');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testAnalysisService();