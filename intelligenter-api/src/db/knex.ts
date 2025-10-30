import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'intelligenter_api'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    extension: 'ts'
  },
  seeds: {
    directory: './seeds'
  },
  // Properly handle JSON/JSONB columns
  wrapIdentifier: (value: string, origImpl: (value: string) => string) => origImpl(value),
  postProcessResponse: (result: any) => result
};

export const db = knex(config);
export { knex };
export default db;