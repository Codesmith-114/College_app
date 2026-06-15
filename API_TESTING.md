# API Testing Collection

This guide provides cURL commands to test all API endpoints.

## Authentication Endpoints

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "portalId": "BIT2024001",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66b2a1f4c7d8e9f0a1b2c3d4",
    "name": "Alex Johnson",
    "portalId": "BIT2024001",
    "email": "alex.johnson@college.edu",
    "department": "Computer Science"
  }
}
```

### 2. Signup (Create New Account)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "portalId": "BIT2024002",
    "password": "newpassword123",
    "name": "Jane Doe",
    "email": "jane.doe@college.edu",
    "department": "Information Technology",
    "semester": 4
  }'
```

### 3. Verify Token
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Dashboard Endpoints

### 1. Get Dashboard Data
```bash
curl -X GET "http://localhost:5000/api/dashboard/data?userId=66b2a1f4c7d8e9f0a1b2c3d4"
```

**Response includes:**
- User information
- Overall attendance with safe skips
- Subject-wise attendance breakdown
- Upcoming tasks
- Today's class schedule

### 2. Get Attendance Details for a Subject
```bash
curl -X GET "http://localhost:5000/api/dashboard/attendance/66b2a1f4c7d8e9f0a1b2c3d4"
```

**Response:**
```json
{
  "subject": "Data Structures",
  "code": "CS201",
  "attended": 30,
  "total": 35,
  "percentage": 85.7,
  "status": "SAFE",
  "threshold": 75,
  "professor": "Dr. Smith"
}
```

### 3. Get Tasks (with filtering)
```bash
# Get all tasks
curl -X GET "http://localhost:5000/api/dashboard/tasks?userId=66b2a1f4c7d8e9f0a1b2c3d4"

# Get pending tasks
curl -X GET "http://localhost:5000/api/dashboard/tasks?userId=66b2a1f4c7d8e9f0a1b2c3d4&status=PENDING"

# Get assignment tasks
curl -X GET "http://localhost:5000/api/dashboard/tasks?userId=66b2a1f4c7d8e9f0a1b2c3d4&type=ASSIGNMENT"

# Get high priority exams
curl -X GET "http://localhost:5000/api/dashboard/tasks?userId=66b2a1f4c7d8e9f0a1b2c3d4&type=EXAM&status=PENDING"
```

---

## Health Check

### Server Status
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-06-15T10:30:45.123Z"
}
```

---

## Using Postman

### Import Collection

1. Open Postman
2. Create new collection "College Portal"
3. Add requests from above
4. Use variables:
   - `{{BASE_URL}}` = `http://localhost:5000/api`
   - `{{TOKEN}}` = Your JWT token (save from login response)
   - `{{USER_ID}}` = Your user ID (save from login response)

### Set up Authorization

For authenticated requests:
- Type: Bearer Token
- Token: `{{TOKEN}}`

---

## Testing Flow

1. **Create an account** (if needed)
   ```bash
   npm run seed  # Or create via signup
   ```

2. **Login** to get token and user ID
   ```bash
   # Save token and userId
   TOKEN=<from_response>
   USER_ID=<from_response>
   ```

3. **Get dashboard data**
   ```bash
   curl -X GET "http://localhost:5000/api/dashboard/data?userId=$USER_ID"
   ```

4. **View tasks**
   ```bash
   curl -X GET "http://localhost:5000/api/dashboard/tasks?userId=$USER_ID&status=PENDING"
   ```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created |
| 400 | ⚠️ Bad Request |
| 401 | 🔒 Unauthorized |
| 404 | ❌ Not Found |
| 500 | 💥 Server Error |

---

## Example Response: Dashboard Data

```json
{
  "user": {
    "name": "Alex Johnson",
    "email": "alex.johnson@college.edu",
    "department": "Computer Science",
    "semester": 5,
    "themePreferences": {
      "primaryColor": "#ec4899",
      "accentColor": "#14b8a6",
      "animationsEnabled": true
    }
  },
  "attendance": {
    "overall": 82,
    "safeSkips": 4,
    "subjects": [
      {
        "id": "66b2a1f4c7d8e9f0a1b2c3d5",
        "name": "Data Structures",
        "code": "CS201",
        "percentage": 86,
        "attended": 30,
        "total": 35,
        "status": "SAFE"
      }
    ],
    "summary": {
      "safe": 3,
      "atRisk": 1,
      "critical": 0
    }
  },
  "tasks": {
    "upcoming": [
      {
        "id": "66b2a1f4c7d8e9f0a1b2c3d6",
        "title": "Data Structures Assignment 5",
        "dueDate": "2024-06-18T23:59:59.000Z",
        "type": "ASSIGNMENT",
        "status": "PENDING",
        "priority": "HIGH"
      }
    ],
    "todaysClasses": []
  }
}
```

---

## Troubleshooting

### Authentication Errors
- Ensure `JWT_SECRET` in `.env` is set
- Token might be expired (24h expiry)
- Check token format: `Bearer <token>`

### Data Not Found
- Verify user ID is correct
- Ensure data was seeded: `npm run seed`
- Check userId exists in database

### Connection Issues
- Verify MongoDB is running/connected
- Check MongoDB URI in `.env`
- Try health check endpoint first
