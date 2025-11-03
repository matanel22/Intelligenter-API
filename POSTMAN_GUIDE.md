# 🚀 Postman Testing Guide - Intelligenter API

## Server Information
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

---

## 📋 Available Endpoints

### 1. Health Check
**Check if the API is running**

```
GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Intelligenter API is running"
}
```

---

### 2. POST - Add Domain for Analysis (Step 3 Endpoint)
**Add a new domain and trigger analysis**

```
POST http://localhost:3000/api/domains/post
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "domain": "example.com"
}
```

**Responses:**

**Case 1 - New Domain (201 Created):**
```json
{
  "message": "Domain added and sent for analysis",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    "vt_data": null,
    "whois_data": null,
    "reputation_score": null,
    "is_malicious": null,
    "last_updated": null,
    "created_at": "2025-10-30T13:00:00.000Z"
  }
}
```

**Case 2 - Domain Already Analyzing (200 OK):**
```json
{
  "message": "Domain is already being analyzed",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    ...
  }
}
```

**Case 3 - Domain Exists but Ready (200 OK):**
```json
{
  "message": "Domain sent for analysis",
  "domain": {
    "id": 1,
    "domain": "example.com",
    "status": "onAnalysis",
    ...
  }
}
```

---

### 3. GET - Retrieve Domain Info (Step 3 Endpoint)
**Get domain information or add to analysis if not found**

```
GET http://localhost:3000/api/domains/get?domain=example.com
```

**Query Parameters:**
- `domain` (required): The domain name to search

**Responses:**

**Case 1 - Domain Exists (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "domain": "example.com",
    "status": "ready",
    "vt_data": {
      "data": {
        "attributes": {
          "last_analysis_stats": {
            "malicious": 0,
            "harmless": 75
          },
          "reputation": 85
        }
      }
    },
    "whois_data": {
      "registrar": "GoDaddy",
      "creation_date": "2020-01-15T00:00:00.000Z",
      "expiration_date": "2026-01-15T00:00:00.000Z"
    },
    "reputation_score": 95,
    "is_malicious": false,
    "last_updated": "2025-10-30T13:00:00.000Z",
    "created_at": "2025-10-30T12:00:00.000Z"
  }
}
```

**Case 2 - Domain Doesn't Exist (201 Created):**
```json
{
  "success": true,
  "message": "Domain added to analysis list",
  "data": {
    "id": 2,
    "domain": "newdomain.com",
    "status": "onAnalysis",
    ...
  }
}
```

---

### 4. GET - All Domains
**Retrieve all domains in the database**

```
GET http://localhost:3000/api/domains
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "domain": "example.com",
      "status": "ready",
      "reputation_score": 95,
      "is_malicious": false,
      "created_at": "2025-10-30T12:00:00.000Z",
      ...
    },
    {
      "id": 2,
      "domain": "test.com",
      "status": "onAnalysis",
      ...
    }
  ]
}
```

---

### 5. GET - Domain by ID
**Get specific domain by ID**

```
GET http://localhost:3000/api/domains/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "domain": "example.com",
    "status": "ready",
    ...
  }
}
```

**Error (404 Not Found):**
```json
{
  "error": "Domain not found"
}
```

---

### 6. POST - Create Domain (CRUD)
**Manually create a domain (advanced)**

```
POST http://localhost:3000/api/domains
Content-Type: application/json
```

**Body:**
```json
{
  "domain": "manual-test.com",
  "status": "onAnalysis"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "domain": "manual-test.com",
    "status": "onAnalysis",
    "created_at": "2025-10-30T13:00:00.000Z",
    ...
  }
}
```

---

### 7. PUT - Update Domain
**Update domain information**

```
PUT http://localhost:3000/api/domains/1
Content-Type: application/json
```

**Body:**
```json
{
  "status": "ready",
  "reputation_score": 88
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "domain": "example.com",
    "status": "ready",
    "reputation_score": 88,
    "last_updated": "2025-10-30T13:05:00.000Z",
    ...
  }
}
```

---

### 8. DELETE - Remove Domain
**Delete a domain from the database**

```
DELETE http://localhost:3000/api/domains/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Domain deleted successfully"
}
```

---

### 9. POST - Trigger Analysis (Manual)
**Manually trigger analysis for a specific domain**

```
POST http://localhost:3000/api/domains/1/analyze
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "domain": "example.com",
    "status": "ready",
    "vt_data": {...},
    "whois_data": {...},
    "reputation_score": 95,
    "is_malicious": false,
    "last_updated": "2025-10-30T13:10:00.000Z"
  }
}
```

---

### 10. GET - Domain Status
**Check current status of a domain**

```
GET http://localhost:3000/api/domains/1/status
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "ready",
    "last_updated": "2025-10-30T13:10:00.000Z"
  }
}
```

---

## 🧪 Testing Workflow

### Quick Start Testing (5 minutes):

1. **Test Health Check**
   ```
   GET http://localhost:3000/health
   ```

2. **Add a Domain**
   ```
   POST http://localhost:3000/api/domains/post
   Body: {"domain": "google.com"}
   ```

3. **Wait 1-2 seconds** (for mock analysis to complete)

4. **Check Domain Status**
   ```
   GET http://localhost:3000/api/domains/get?domain=google.com
   ```
   - Should show `status: "ready"`
   - Should have `vt_data` and `whois_data`
   - Should have `reputation_score`

5. **Add Another Domain**
   ```
   POST http://localhost:3000/api/domains/post
   Body: {"domain": "facebook.com"}
   ```

6. **List All Domains**
   ```
   GET http://localhost:3000/api/domains
   ```

---

## 📊 Test Scenarios

### Scenario 1: New Domain Workflow
1. POST `/post` with new domain → 201 Created, status: "onAnalysis"
2. Wait 1-2 seconds
3. GET `/get?domain=...` → 200 OK, status: "ready" with full data

### Scenario 2: Duplicate Domain
1. POST `/post` with existing domain → 200 OK
2. Message: "Domain is already being analyzed" or "Domain sent for analysis"

### Scenario 3: Domain Not Found
1. GET `/get?domain=nonexistent.com` → 201 Created
2. Domain added to analysis queue

### Scenario 4: CRUD Operations
1. POST `/domains` → Create
2. GET `/domains` → Read all
3. GET `/domains/1` → Read one
4. PUT `/domains/1` → Update
5. DELETE `/domains/1` → Delete

---

## 🔧 Common Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## 💡 Tips for Testing

1. **Use Postman Variables**:
   - Create environment variable: `baseUrl = http://localhost:3000`
   - Use `{{baseUrl}}/api/domains` in requests

2. **Save Responses**:
   - Use Tests tab to save domain IDs
   ```javascript
   pm.environment.set("domainId", pm.response.json().data.id);
   ```

3. **Chain Requests**:
   - Create domain → Save ID → Use in GET/PUT/DELETE

4. **Test Data**:
   Use different domains:
   - google.com
   - facebook.com
   - microsoft.com
   - github.com
   - stackoverflow.com

5. **Monitor Console**:
   - Watch server logs for analysis progress
   - Look for: "🔍 Starting analysis for: ..."

---

## 🐛 Troubleshooting

**Server not responding?**
- Check if server is running: `npm run dev`
- Verify port 3000 is not in use
- Check server logs for errors

**Analysis not completing?**
- Wait at least 1-2 seconds after POST
- Check domain status with GET request
- Look at server console for "✅ Analysis complete"

**Database errors?**
- Ensure PostgreSQL is running
- Check database connection in `.env`
- Run migrations: `npx knex migrate:latest --knexfile knexfile.cjs`

---

## 📦 Postman Collection Import

Create a new collection in Postman and add these requests. You can also export this as a JSON collection file to share with your team!

Happy Testing! 🎉