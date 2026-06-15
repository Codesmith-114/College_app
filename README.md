# College Portal Dashboard

A comprehensive student portal with attendance tracking, task management, and real-time notifications.

## Features

✨ **Dashboard**
- Overall attendance tracking
- Subject-wise attendance breakdown
- Upcoming tasks and assignments
- Today's class schedule
- Quick action shortcuts

📊 **Attendance Tracking**
- Real-time attendance percentage
- Safe skip calculator
- Status indicators (Safe, At Risk, Critical)
- Historical tracking

📋 **Task Management**
- Assignments and exams
- Priority-based sorting
- Status tracking (Pending, In Progress, Completed)
- Due date notifications

🎨 **Customization**
- Theme preferences (Dark/Light)
- Color customization
- Animation controls

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

**Database:**
- MongoDB Atlas (Cloud)

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account
- Git

## Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd College_app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/college_portal?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string and update `MONGODB_URI` in `.env`
5. Whitelist your IP address in MongoDB Atlas

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates sample user, attendance, and task data for testing.

Test credentials after seeding:
- Portal ID: `BIT2024001`
- Password: `password123`

## Running the Application

### Development Mode

```bash
# Start backend server (runs on port 5000)
npm run dev

# In another terminal, start frontend (port 3000)
# If you have a frontend setup configured
npm start
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Dashboard
- `GET /api/dashboard/data?userId={userId}` - Get complete dashboard data
- `GET /api/dashboard/attendance/{subjectId}` - Get subject attendance details
- `GET /api/dashboard/tasks?status={status}&type={type}` - Get filtered tasks

## Project Structure

```
College_app/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Attendance.js       # Attendance schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   └── dashboard.js       # Dashboard endpoints
│   ├── scripts/
│   │   └── seed.js            # Database seeding script
│   └── index.js               # Server entry point
├── client/
│   ├── services/
│   │   └── api.ts             # API client
│   ├── hooks/
│   │   └── useDashboard.ts    # Dashboard data hook
│   └── ...                     # React components
├── dashborad                  # Dashboard component
├── schema.js                  # Database schemas
├── sidebar                    # Sidebar styles
├── package.json
├── .env.example
└── README.md
```

## Database Schema

### User
```javascript
{
  portalId: String,
  email: String,
  name: String,
  encryptedPassword: String,
  department: String,
  semester: Number,
  themePreferences: Object,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance
```javascript
{
  userId: ObjectId,
  subjectName: String,
  subjectCode: String,
  classesAttended: Number,
  totalClasses: Number,
  percentage: Number,
  status: String, // 'SAFE' | 'AT_RISK' | 'CRITICAL'
  updatedAt: Date
}
```

### Task
```javascript
{
  userId: ObjectId,
  title: String,
  dueDate: Date,
  status: String, // 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  type: String,   // 'ASSIGNMENT' | 'EXAM' | 'PERSONAL' | 'PROJECT'
  priority: String, // 'LOW' | 'MEDIUM' | 'HIGH'
  subject: String
}
```

## Usage Examples

### Frontend - Using the Dashboard Hook

```typescript
import { useDashboard } from './hooks/useDashboard';

function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const { data, loading, error, refetch } = useDashboard(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {data?.user.name}</h1>
      <p>Overall Attendance: {data?.attendance.overall}%</p>
      <p>Safe to skip: {data?.attendance.safeSkips} classes</p>
    </div>
  );
}
```

### Backend - Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "portalId": "BIT2024001",
    "password": "password123"
  }'
```

## Deployment

### Deploy Backend on Heroku/Railway

```bash
git push heroku main
```

### Deploy Frontend on Vercel

```bash
npm run build
vercel
```

## Troubleshooting

### MongoDB Connection Error
- Verify your MongoDB Atlas connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Check if database name is correct

### CORS Errors
- Ensure frontend URL is added to CORS whitelist in `server/index.js`
- Check if API URL is correctly configured in frontend

### Port Already in Use
```bash
# Kill process on port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti :5000 | xargs kill -9
```

## Security Notes

⚠️ **Before Production:**
- Change `JWT_SECRET` and `ENCRYPTION_KEY`
- Enable HTTPS
- Add proper input validation
- Implement rate limiting
- Use environment-specific configurations
- Add proper error handling
- Implement refresh token mechanism

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoint documentation

## Roadmap

- [ ] Real-time notifications
- [ ] WebSocket for live updates
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Integration with university portal
- [ ] Email notifications
- [ ] Calendar integration
