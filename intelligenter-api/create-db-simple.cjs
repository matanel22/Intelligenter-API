const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    const dbName = process.env.DB_NAME || 'intelligenter_api';
    
    // Try to create database with template0
    try {
      await client.query(`CREATE DATABASE ${dbName} WITH TEMPLATE template0`);
      console.log(`Database "${dbName}" created successfully!`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`Database "${dbName}" already exists.`);
      } else {
        throw err;
      }
    }
    
  } catch (error) {
    console.error('Error creating database:', error.message);
    // Continue anyway, maybe the database already exists
  } finally {
    await client.end();
  }
}

createDatabase();