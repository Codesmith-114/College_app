import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        default: 'PENDING'
    },
    type: {
        type: String,
        enum: ['ASSIGNMENT', 'EXAM', 'PERSONAL', 'PROJECT'],
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
    },
    subject: String,
    submittedAt: Date,
    grade: String,
    notes: String
}, {
    timestamps: true,
    collection: 'tasks'
});

export const Task = mongoose.model('Task', TaskSchema);
