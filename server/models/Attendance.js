import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    subjectName: {
        type: String,
        required: true
    },
    subjectCode: {
        type: String,
        required: true,
        index: true
    },
    classesAttended: {
        type: Number,
        default: 0,
        min: 0
    },
    totalClasses: {
        type: Number,
        default: 0,
        min: 0
    },
    percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    mandateThreshold: {
        type: Number,
        default: 75
    },
    professor: String,
    status: {
        type: String,
        enum: ['SAFE', 'AT_RISK', 'CRITICAL'],
        default: 'SAFE'
    },
    semester: Number,
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'attendance'
});

// Calculate percentage before saving
AttendanceSchema.pre('save', function (next) {
    if (this.totalClasses > 0) {
        this.percentage = (this.classesAttended / this.totalClasses) * 100;

        // Update status based on percentage
        if (this.percentage >= this.mandateThreshold) {
            this.status = 'SAFE';
        } else if (this.percentage >= this.mandateThreshold - 10) {
            this.status = 'AT_RISK';
        } else {
            this.status = 'CRITICAL';
        }
    }
    next();
});

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
