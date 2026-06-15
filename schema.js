// models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  portalId: { type: String, required: true, unique: true },
  encryptedPassword: { type: String, required: true }, // AES-256 encrypted
  name: String,
  university: String,
  themePreferences: {
    primaryColor: { type: String, default: '#ec4899' }, // Pink default
    accentColor: { type: String, default: '#14b8a6' }, // Teal default
    animationsEnabled: { type: Boolean, default: true }
  },
  lastSynced: Date,
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);

// models/Attendance.ts
const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subjectName: String,
  subjectCode: String,
  classesAttended: Number,
  totalClasses: Number,
  percentage: Number,
  updatedAt: Date
});

export const Attendance = mongoose.model('Attendance', AttendanceSchema);

// models/Task.ts
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  dueDate: Date,
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
  type: { type: String, enum: ['ASSIGNMENT', 'EXAM', 'PERSONAL'] }
});

export const Task = mongoose.model('Task', TaskSchema);