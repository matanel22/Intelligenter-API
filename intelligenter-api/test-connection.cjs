const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('📅 Current time:', result.rows[0].current_time);
    console.log('🗄️ PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
    
    // Test our tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name IN ('domains', 'requests', 'domain_analyses')
    `);
    
    console.log('📊 Available tables:', tables.rows.map(row => row.table_name).join(', '));
    
    // Test inserting a sample domain
    const testResult = await client.query(`
      INSERT INTO domains (domain, status) 
      VALUES ('test-connection.com', 'onAnalysis') 
      ON CONFLICT (domain) DO NOTHING
      RETURNING id, domain, status, created_at
    `);
    
    if (testResult.rows.length > 0) {
      console.log('✅ Test domain inserted:', testResult.rows[0]);
    } else {
      console.log('ℹ️ Test domain already exists');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();