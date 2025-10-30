const { Client } = require('pg');
require('dotenv').config();

async function checkMigrationStatus() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  });

  try {
    await client.connect();
    
    // Check migrations table
    const migrations = await client.query('SELECT * FROM knex_migrations ORDER BY id');
    
    console.log('📊 Migration Status:\n');
    if (migrations.rows.length === 0) {
      console.log('❌ No migrations recorded in database');
    } else {
      console.log('✅ Completed Migrations:');
      migrations.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.name} (Batch: ${row.batch})`);
        console.log(`   Ran at: ${row.migration_time}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkMigrationStatus();