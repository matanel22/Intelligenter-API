# 🚀 How to Run the Intelligenter API Project

This guide shows how to set up and run the Intelligenter API project locally.

## 📋 Prerequisites

- **Node.js 20+** and **npm**
- **PostgreSQL 16** installed and running
- **Redis 7** installed and running

---

## 💻 Local Development Setup

### Setup Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd Intelligenter-API

# 2. Install dependencies
npm install

# 3. Start PostgreSQL and Redis services
# Ensure PostgreSQL is running on port 5432
# Ensure Redis is running on port 6379

# 4. Create database
createdb intelligenter_db

# 5. Configure environment
cp .env.template .env
# Edit .env with your local database settings:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=intelligenter_db
# REDIS_HOST=localhost
# REDIS_PORT=6379


# 6. Run database migrations
npm run migrate

# 7. Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Commands
```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production build
npm start

# Run migrations
npm run migrate

# Database operations
npx knex migrate:latest
npx knex migrate:rollback
npx knex migrate:make migration_name
```

---

## 🧪 Testing the API

Once the application is running, test these endpoints:

### Health Check
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Domain Analysis
```bash
# Submit domain for analysis
curl -X POST http://localhost:3000/api/domains/post \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'

# Get analysis results
curl "http://localhost:3000/api/domains/get?domain=example.com"
```

### Expected Response
```json
{
  "id": 1,
  "domain": "example.com",
  "status": "completed",
  "analysis": {
    "virusTotal": {...},
    "whois": {...},
    "reputation": {...}
  }
}
```

---

## 📁 Project Structure

```
Intelligenter-API/
├── src/                    # Source code
│   ├── app.ts             # Main application
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── services/          # External services
│   └── models/            # Data models
├── migrations/            # Database migrations
├── docker-compose.yml     # Docker orchestration
├── dockerfile             # Container definition
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── knexfile.cjs          # Database config
└── .env.template         # Environment template
```

---

## 🔧 Troubleshooting

### Common Issues





**Migration Errors**
```bash
# Reset database (WARNING: loses data)
dropdb intelligenter_db
createdb intelligenter_db
npm run migrate
```

**Build Errors**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf dist/
npm run build
```

### Environment Variables

Required variables in `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=intelligenter_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development


# External APIs (optional)

```




## 📚 Additional Resources

- **API Documentation**: Check `src/routes/` for available endpoints
- **Database Schema**: See `migrations/` folder
- **Docker Logs**: `docker-compose logs -f [service]`
- **Health Monitoring**: Visit `http://localhost:3000/health`

---

## 🆘 Need Help?

1. **Check application logs**: Check terminal output from `npm run dev`
2. **Verify services**: Ensure PostgreSQL and Redis are running
3. **Test connectivity**: `curl http://localhost:3000/health`
4. **Reset database**: `dropdb intelligenter_db && createdb intelligenter_db && npm run migrate`

