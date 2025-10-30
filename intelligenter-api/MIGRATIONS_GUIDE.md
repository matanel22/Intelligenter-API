# Database Migrations Guide

## 📋 Overview

Migrations are version control for your database schema. They help you:
- Track database changes over time
- Roll back changes if needed
- Keep development and production databases in sync

## 🔧 Migration Commands

### 1. **Check Migration Status**
```bash
npx knex migrate:status --knexfile knexfile.cjs
```

### 2. **Create a New Migration**
```bash
npx knex migrate:make migration_name --knexfile knexfile.cjs
```
Example:
```bash
npx knex migrate:make add_user_roles --knexfile knexfile.cjs
```

### 3. **Run All Pending Migrations**
```bash
npx knex migrate:latest --knexfile knexfile.cjs
```

### 4. **Rollback Last Migration Batch**
```bash
npx knex migrate:rollback --knexfile knexfile.cjs
```

### 5. **Rollback All Migrations**
```bash
npx knex migrate:rollback --all --knexfile knexfile.cjs
```

## 📝 Migration Examples

### Example 1: Create a New Table
```javascript
exports.up = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('name', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['email']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
```

### Example 2: Add Columns to Existing Table
```javascript
exports.up = async function(knex) {
  await knex.schema.table('domains', (table) => {
    table.integer('reputation_score').nullable();
    table.boolean('is_malicious').defaultTo(false);
    table.text('notes').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.table('domains', (table) => {
    table.dropColumn('reputation_score');
    table.dropColumn('is_malicious');
    table.dropColumn('notes');
  });
};
```

### Example 3: Modify Existing Column
```javascript
exports.up = async function(knex) {
  await knex.schema.alterTable('domains', (table) => {
    table.string('domain', 500).notNullable().unique().alter();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('domains', (table) => {
    table.string('domain', 255).notNullable().unique().alter();
  });
};
```

### Example 4: Add Foreign Key
```javascript
exports.up = async function(knex) {
  await knex.schema.createTable('domain_tags', (table) => {
    table.increments('id').primary();
    table.integer('domain_id').unsigned().notNullable();
    table.string('tag', 100).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Foreign key
    table.foreign('domain_id')
      .references('id')
      .inTable('domains')
      .onDelete('CASCADE');
    
    // Indexes
    table.index(['domain_id']);
    table.index(['tag']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('domain_tags');
};
```

### Example 5: Add Index
```javascript
exports.up = async function(knex) {
  await knex.schema.table('requests', (table) => {
    table.index(['created_at', 'status_code'], 'requests_created_status_index');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('requests', (table) => {
    table.dropIndex(['created_at', 'status_code'], 'requests_created_status_index');
  });
};
```

### Example 6: Data Migration (Update Records)
```javascript
exports.up = async function(knex) {
  // Add new column
  await knex.schema.table('domains', (table) => {
    table.string('category', 50).nullable();
  });
  
  // Update existing records
  await knex('domains')
    .where('status', 'ready')
    .update({ category: 'analyzed' });
};

exports.down = async function(knex) {
  await knex.schema.table('domains', (table) => {
    table.dropColumn('category');
  });
};
```

## 🏗️ Column Types Reference

```javascript
// Numbers
table.increments('id')                    // Auto-incrementing primary key
table.integer('count')                    // Integer
table.bigInteger('big_count')             // Big integer
table.decimal('price', 8, 2)              // Decimal with precision

// Strings
table.string('name', 255)                 // VARCHAR(255)
table.text('description')                 // TEXT
table.enum('status', ['active', 'inactive']) // ENUM

// Booleans
table.boolean('is_active')                // Boolean

// Dates
table.timestamp('created_at')             // Timestamp
table.datetime('updated_at')              // Datetime
table.date('birth_date')                  // Date

// JSON
table.json('metadata')                    // JSON
table.jsonb('data')                       // JSONB (PostgreSQL)

// Binary
table.binary('file_data')                 // Binary

// UUID
table.uuid('identifier')                  // UUID
```

## 🔑 Constraints & Modifiers

```javascript
table.string('email').notNullable()       // NOT NULL
table.string('username').unique()         // UNIQUE
table.string('name').defaultTo('Unknown') // DEFAULT
table.integer('age').unsigned()           // UNSIGNED (for foreign keys)
table.string('old_col').nullable()        // Allow NULL
```

## 📊 Current Database Schema

### Tables Created:
1. **domains** - Store domain information
2. **requests** - Log all API requests
3. **domain_analyses** - Store analysis results

### To View Your Current Schema:
```bash
node check-tables.cjs
```

## 🚀 Best Practices

1. **Always include both `up()` and `down()`** - Make migrations reversible
2. **Test rollbacks** - Make sure `down()` properly undoes `up()`
3. **Use transactions** - Migrations are wrapped in transactions by default
4. **One change per migration** - Keep migrations focused and atomic
5. **Never modify old migrations** - Create new migrations instead
6. **Name migrations clearly** - Use descriptive names like `add_email_to_users`

## 📁 Migration Files Location

- **Source:** `src/db/migrations/*.cjs`
- **Config:** `knexfile.cjs`

## 🔄 Workflow

1. **Create migration:** `npx knex migrate:make migration_name --knexfile knexfile.cjs`
2. **Edit the migration file** in `src/db/migrations/`
3. **Run migration:** `npx knex migrate:latest --knexfile knexfile.cjs`
4. **If something goes wrong:** `npx knex migrate:rollback --knexfile knexfile.cjs`

## ✅ Your Current Migrations

```
✅ 001_create_domains_tables.cjs (COMPLETED)
   - Created: domains, requests, domain_analyses tables
   
📝 20251030125952_add_new_column.cjs (EXAMPLE - NOT RUN YET)
   - Example of adding columns to existing table
```

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `migrate:make <name>` | Create new migration |
| `migrate:latest` | Run all pending migrations |
| `migrate:rollback` | Rollback last batch |
| `migrate:status` | Check migration status |
| `migrate:list` | List all migrations |
| `migrate:up` | Run next migration |
| `migrate:down` | Rollback last migration |