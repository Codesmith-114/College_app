import { Schema, model } from 'mongoose';

const TimetableSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek: { 
    type: String, 
    required: true, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
  },
  subjectName: { type: String, required: true },
  startTime: { type: String, required: true }, // e.g., '09:00 AM'
  endTime: { type: String, required: true }, // e.g., '09:50 AM'
  roomCode: { type: String, default: 'Online / N/A' },
  facultyName: { type: String, default: 'TBD' }
});

export const Timetable = model('Timetable', TimetableSchema);
