const { Client } = require('pg');
require('dotenv').config();

async function checkTables() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  });

  try {
    await client.connect();
    console.log('Connected to intelligenter_api database');
    
    // Check tables
    const result = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position;
    `);
    
    console.log('\nTables and columns created:');
    console.log('=====================================');
    
    let currentTable = '';
    result.rows.forEach(row => {
      if (row.table_name !== currentTable) {
        if (currentTable !== '') console.log('');
        console.log(`\n📊 ${row.table_name.toUpperCase()} TABLE:`);
        console.log('-------------------------------------');
        currentTable = row.table_name;
      }
      console.log(`  ${row.column_name} | ${row.data_type} | ${row.is_nullable === 'YES' ? 'nullable' : 'not null'} | ${row.column_default || 'no default'}`);
    });
    
    // Check indexes
    const indexes = await client.query(`
      SELECT tablename, indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('domains', 'requests', 'domain_analyses')
      ORDER BY tablename, indexname;
    `);
    
    console.log('\n\n📋 INDEXES CREATED:');
    console.log('=====================================');
    indexes.rows.forEach(row => {
      console.log(`${row.tablename}.${row.indexname}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();