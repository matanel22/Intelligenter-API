# Intelligenter API

A TypeScript Express API for domain analysis and monitoring with PostgreSQL database integration.

## Project Structure

```
src/
├── app.ts                  # Main Express application
├── routes/
│   └── domainRoutes.ts    # Domain-related API routes
├── controllers/
│   └── domainController.ts # Request handling logic
├── services/
│   └── domainService.ts   # Business logic and database operations
├── db/
│   ├── knex.ts           # Database configuration
│   └── migrations/       # Database migration files
├── scheduler/
│   └── scheduler.ts      # Cron job scheduling
└── utils/
    └── validation.ts     # Input validation utilities
```

## Features

- **Domain Management**: CRUD operations for domains
- **Domain Analysis**: Automated domain analysis with scoring
- **Scheduled Tasks**: Periodic domain analysis using cron jobs
- **Database Migrations**: Knex.js for database schema management
- **Input Validation**: Comprehensive request validation
- **TypeScript**: Full TypeScript support with strict typing

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd intelligenter-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp src/.env.example .env
   ```
   
   Edit `.env` with your database configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=intelligenter_api
   ```

4. **Set up the database:**
   ```bash
   # Create database (if not exists)
   createdb intelligenter_api
   
   # Run migrations
   npx knex migrate:latest
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Domain Management

- `POST /api/domains` - Create a new domain
- `GET /api/domains` - Get all domains
- `GET /api/domains/:id` - Get domain by ID
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain

### Domain Analysis

- `POST /api/domains/:id/analyze` - Trigger domain analysis
- `GET /api/domains/:id/status` - Get domain analysis status

### Health Check

- `GET /health` - API health check

## Request/Response Examples

### Create Domain
```bash
POST /api/domains
Content-Type: application/json

{
  "name": "Example Website",
  "url": "https://example.com",
  "status": "active"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example Website",
    "url": "https://example.com",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Domains Table
- `id` - Primary key
- `name` - Domain name (string, max 100 chars)
- `url` - Domain URL (string, max 255 chars)
- `status` - Domain status (enum: 'active', 'inactive', 'analyzing')
- `lastAnalyzed` - Last analysis timestamp
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Domain Analyses Table
- `id` - Primary key
- `domainId` - Foreign key to domains table
- `score` - Overall analysis score (integer)
- `metrics` - Analysis metrics (JSON)
- `suggestions` - Improvement suggestions (JSON array)
- `analyzedAt` - Analysis timestamp

## Scheduled Tasks

The application includes a scheduler that runs:

- **Hourly Analysis**: Analyzes active domains every hour
- **Daily Cleanup**: Cleans up old analysis data at 2 AM daily

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Database Operations

```bash
# Create new migration
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest

# Rollback migrations
npx knex migrate:rollback

# Check migration status
npx knex migrate:status
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Knex.js** - SQL query builder
- **PostgreSQL** - Database
- **node-cron** - Scheduled tasks
- **dotenv** - Environment configuration

## License

ISC