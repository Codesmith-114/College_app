import { Schema, model } from 'mongoose';

const TaskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  subjectName: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Task = model('Task', TaskSchema);
