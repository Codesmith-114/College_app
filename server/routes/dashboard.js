import express from 'express';
import { Attendance } from '../models/Attendance.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to verify user (simplified - add proper JWT verification)
const authMiddleware = (req, res, next) => {
    const userId = req.query.userId || req.body.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User ID required' });
    }
    req.userId = userId;
    next();
};

// GET: Overall dashboard data
router.get('/data', authMiddleware, async (req, res) => {
    try {
        const { userId } = req;

        // Fetch user info
        const user = await User.findById(userId).select('-encryptedPassword');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch attendance data
        const attendanceRecords = await Attendance.find({ userId })
            .sort({ lastUpdated: -1 });

        // Calculate overall attendance
        const totalClassesAttended = attendanceRecords.reduce((sum, a) => sum + a.classesAttended, 0);
        const totalClassesCount = attendanceRecords.reduce((sum, a) => sum + a.totalClasses, 0);
        const overallAttendance = totalClassesCount > 0
            ? Math.round((totalClassesAttended / totalClassesCount) * 100)
            : 0;

        // Calculate safe skips
        const mandateThreshold = 0.75;
        const safeSkips = totalClassesCount > 0
            ? Math.floor((totalClassesAttended / mandateThreshold) - totalClassesCount)
            : 0;

        // Fetch upcoming tasks
        const upcomingTasks = await Task.find({
            userId,
            dueDate: { $gte: new Date() }
        })
            .sort({ dueDate: 1 })
            .limit(5);

        // Fetch today's schedule (classes scheduled for today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysClasses = await Task.find({
            userId,
            type: 'EXAM',
            dueDate: { $gte: today, $lt: tomorrow }
        }).sort({ dueDate: 1 });

        // Attendance status breakdown
        const attendanceStatus = {
            safe: attendanceRecords.filter(a => a.status === 'SAFE').length,
            atRisk: attendanceRecords.filter(a => a.status === 'AT_RISK').length,
            critical: attendanceRecords.filter(a => a.status === 'CRITICAL').length
        };

        res.json({
            user: {
                name: user.name,
                email: user.email,
                department: user.department,
                semester: user.semester,
                themePreferences: user.themePreferences
            },
            attendance: {
                overall: overallAttendance,
                safeSkips,
                subjects: attendanceRecords.map(a => ({
                    id: a._id,
                    name: a.subjectName,
                    code: a.subjectCode,
                    percentage: Math.round(a.percentage),
                    attended: a.classesAttended,
                    total: a.totalClasses,
                    status: a.status
                })),
                summary: attendanceStatus
            },
            tasks: {
                upcoming: upcomingTasks.map(t => ({
                    id: t._id,
                    title: t.title,
                    dueDate: t.dueDate,
                    type: t.type,
                    status: t.status,
                    priority: t.priority
                })),
                todaysClasses: todaysClasses.map(c => ({
                    id: c._id,
                    title: c.title,
                    time: c.dueDate,
                    subject: c.subject
                }))
            }
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// GET: Detailed attendance for a subject
router.get('/attendance/:subjectId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const { subjectId } = req.params;

        const attendance = await Attendance.findOne({
            _id: subjectId,
            userId
        });

        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        res.json({
            subject: attendance.subjectName,
            code: attendance.subjectCode,
            attended: attendance.classesAttended,
            total: attendance.totalClasses,
            percentage: Math.round(attendance.percentage),
            status: attendance.status,
            threshold: attendance.mandateThreshold,
            professor: attendance.professor
        });
    } catch (error) {
        console.error('Attendance detail error:', error);
        res.status(500).json({ error: 'Failed to fetch attendance details' });
    }
});

// GET: Tasks
router.get('/tasks', authMiddleware, async (req, res) => {
    try {
        const { userId } = req;
        const { status, type } = req.query;

        const query = { userId };
        if (status) query.status = status;
        if (type) query.type = type;

        const tasks = await Task.find(query)
            .sort({ dueDate: 1 })
            .limit(20);

        res.json({
            tasks: tasks.map(t => ({
                id: t._id,
                title: t.title,
                description: t.description,
                dueDate: t.dueDate,
                status: t.status,
                type: t.type,
                priority: t.priority,
                subject: t.subject
            }))
        });
    } catch (error) {
        console.error('Tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

export default router;
