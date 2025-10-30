# Step 3 - Basic REST API Testing

This document shows how to test the new REST API endpoints.

## Endpoints

### POST /api/domains/post
Accepts a domain and adds a new record with status = "onAnalysis"

**Request Body:**
```json
{
  "domain": "example.com"
}
```

**Responses:**

1. **New domain (201):**
```json
{
  "message": "Domain added and sent for analysis",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    "vt_data": null,
    "whois_data": null,
    "last_updated": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

2. **Domain already in analysis (200):**
```json
{
  "message": "Domain is already being analyzed",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

3. **Domain exists but ready (200):**
```json
{
  "message": "Domain sent for analysis",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    "last_updated": "2024-01-01T00:01:00.000Z"
  }
}
```

### GET /api/domains/get?domain=example.com
Gets domain information or adds to analysis if not found

**Query Parameters:**
- `domain` (required): The domain name to search for

**Responses:**

1. **Domain exists (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "domain": "example.com",
    "status": "ready",
    "vt_data": {...},
    "whois_data": {...},
    "last_updated": "2024-01-01T00:05:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

2. **Domain doesn't exist (201):**
```json
{
  "success": true,
  "message": "Domain added to analysis list",
  "data": {
    "id": 2,
    "domain": "newdomain.com",
    "status": "onAnalysis",
    "vt_data": null,
    "whois_data": null,
    "last_updated": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Testing with curl

### Test POST endpoint:
```bash
curl -X POST http://localhost:3000/api/domains/post \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

### Test GET endpoint:
```bash
curl "http://localhost:3000/api/domains/get?domain=example.com"
```

## Business Logic

1. **POST /post**:
   - Check if domain exists
   - If exists and status = "onAnalysis" → return message
   - If exists and status = "ready" → update to "onAnalysis" and trigger analysis
   - If doesn't exist → create new domain with "onAnalysis" status

2. **GET /get**:
   - If domain exists → return domain data
   - If doesn't exist → add to analysis list with "onAnalysis" status

3. **Mock Analysis**:
   - Analysis is triggered asynchronously using setTimeout
   - After 1 second, the domain status changes from "onAnalysis" to "ready"
   - Analysis results are stored in the database

## Database Flow

1. Domain added with `status = "onAnalysis"`
2. Mock analysis runs (1 second delay)
3. Analysis results stored in `domain_analyses` table
4. Domain status updated to `status = "ready"`
5. Domain `last_updated` field updated