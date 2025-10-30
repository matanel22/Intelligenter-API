const { Client } = require('pg');
require('dotenv').config();

async function testDirectInsert() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  });

  try {
    await client.connect();
    
    const metrics = {
      performance: 90,
      seo: 85,
      security: 95,
      accessibility: 88
    };
    
    const suggestions = [
      '✅ Domain appears safe',
      '🔐 Maintain HTTPS security',
      '📊 Monitor domain reputation regularly'
    ];
    
    console.log('Testing direct PostgreSQL insert with jsonb...');
    console.log('Metrics:', JSON.stringify(metrics));
    console.log('Suggestions:', JSON.stringify(suggestions));
    
    const result = await client.query(`
      INSERT INTO domain_analyses (domain_id, score, metrics, suggestions)
      VALUES ($1, $2, $3::jsonb, $4::jsonb)
      RETURNING *
    `, [4, 95, JSON.stringify(metrics), JSON.stringify(suggestions)]);
    
    console.log('✅ Insert successful!');
    console.log('Inserted row:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

testDirectInsert();