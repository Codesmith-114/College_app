import { Schema, model } from 'mongoose';

const AttendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectName: { type: String, required: true },
  attendedClasses: { type: Number, required: true, default: 0, min: 0 },
  totalClasses: { type: Number, required: true, default: 0, min: 0 },
  requiredPercentage: { type: Number, required: true, default: 75, min: 0, max: 100 }
});

export const Attendance = model('Attendance', AttendanceSchema);
