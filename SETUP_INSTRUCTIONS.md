// SETUP_INSTRUCTIONS.md

# Complete Setup Guide for College Portal

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd College_app
npm install
```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email or Google
   - Create a new organization (if first time)

2. **Create a Cluster**
   - Click "Create" → Select "Build a Cluster"
   - Choose "Free" tier (perfect for development)
   - Select a region closest to you
   - Click "Create Cluster" (wait ~3 minutes)

3. **Get Connection String**
   - Go to "Databases" → Your cluster
   - Click "Connect"
   - Choose "Connect with MongoDB Compass" or "Connect with Driver"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your credentials

4. **Whitelist Your IP**
   - In Atlas, go to "Network Access"
   - Click "Add IP Address"
   - Click "Add Current IP Address" (or use "Allow Access from Anywhere" for dev)

### Step 3: Configure Environment

1. **Create `.env` file** in project root:
```bash
# Copy from .env.example
cp .env.example .env
```

2. **Edit `.env` file:**
```env
# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/college_portal?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_12345_change_this
ENCRYPTION_KEY=your_32_character_encryption_key
```

### Step 4: Seed Database with Sample Data

```bash
npm run seed
```

You'll see:
```
✅ Database seeded successfully!

Test Credentials:
Portal ID: BIT2024001
Password: password123
Email: alex.johnson@college.edu
```

### Step 5: Start the Server

```bash
npm run dev
```

Output should show:
```
🚀 Server running on http://localhost:5000
📊 Dashboard API: http://localhost:5000/api/dashboard
🔐 Auth API: http://localhost:5000/api/auth
```

✅ Backend is ready!

---

## Frontend Setup

If you have a React frontend project:

### Step 1: Install Frontend Dependencies
```bash
npm install axios framer-motion lucide-react
```

### Step 2: Create Environment File
```bash
# Create .env in frontend root
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Use the API Client
See `client/services/api.ts` for API integration examples.

### Step 4: Start Frontend
```bash
npm start  # Usually runs on port 3000
```

---

## Testing the API

### Using Postman or cURL

#### 1. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "portalId": "BIT2024001",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "Alex Johnson",
    "portalId": "BIT2024001",
    "email": "alex.johnson@college.edu"
  }
}
```

#### 2. **Get Dashboard Data**
```bash
curl -X GET "http://localhost:5000/api/dashboard/data?userId=user_id_here"
```

Response includes attendance, tasks, and user info.

---

## Troubleshooting

### ❌ MongoDB Connection Error
**Error:** `MongooseError: Cannot connect to MongoDB`

**Solution:**
1. Check connection string format
2. Verify IP is whitelisted in MongoDB Atlas
3. Check username/password are correct
4. Ensure database name exists

### ❌ Port 5000 Already in Use
**On Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**On Mac/Linux:**
```bash
lsof -ti :5000 | xargs kill -9
```

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure frontend URL is in CORS whitelist in `server/index.js`
- Add your frontend URL:
```javascript
origin: ['http://localhost:3000', 'http://localhost:5173', 'your-frontend-url.com'],
```

### ❌ JWT Token Invalid
**Error:** `jwt malformed`

**Solution:**
- Change `JWT_SECRET` in `.env` to something unique
- Clear old tokens from localStorage
- Login again

---

## Project Structure Explained

```
College_app/
│
├── server/                    # Express backend
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   └── Task.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js           # Login, signup, verify
│   │   └── dashboard.js      # Dashboard data endpoints
│   ├── scripts/
│   │   └── seed.js           # Sample data generator
│   └── index.js              # Server entry point
│
├── client/                    # React frontend
│   ├── services/
│   │   └── api.ts            # API client with axios
│   ├── hooks/
│   │   └── useDashboard.ts   # Data fetching hook
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   └── Login.tsx         # Login page
│   └── ...
│
├── package.json              # Dependencies
├── .env.example              # Environment template
├── .gitignore
└── README.md
```

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Create new account
- `GET /api/auth/verify` - Verify JWT token

### Dashboard
- `GET /api/dashboard/data?userId={id}` - Get all dashboard data
- `GET /api/dashboard/attendance/{subjectId}` - Get subject details
- `GET /api/dashboard/tasks?status={status}&type={type}` - Get tasks

---

## Next Steps

1. ✅ Backend running
2. ✅ Database connected
3. ✅ Sample data seeded
4. 🔄 **Next:** Integrate frontend components
5. 🔄 **Next:** Add authentication UI
6. 🔄 **Next:** Deploy to production

---

## Deployment Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Change `ENCRYPTION_KEY` to a secure key
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas with strong password
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Setup error logging
- [ ] Setup monitoring and alerts
- [ ] Use environment-specific configs

---

## Support Resources

- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)

---

**Happy Coding! 🚀**
