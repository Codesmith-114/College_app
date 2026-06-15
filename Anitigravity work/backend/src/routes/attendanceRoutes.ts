import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { Attendance } from '../models/Attendance';
import { calculateAttendanceStats, calculateOverallStats } from '../utils/attendanceCalculator';

const router = Router();

// 1. Fetch Attendance + Predictive Metrics
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const records = await Attendance.find({ userId: req.user?.id });
    
    // Map database records to analytical profiles
    const analytics = records.map(record => {
      return calculateAttendanceStats(
        record.subjectName,
        record.attendedClasses,
        record.totalClasses,
        record.requiredPercentage
      );
    });

    const overall = calculateOverallStats(records);

    return res.json({
      subjects: analytics,
      overall
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 2. Add Attendance Record Manually (For tracking extra modules)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subjectName, attendedClasses, totalClasses, requiredPercentage } = req.body;
    
    if (!subjectName) {
      return res.status(400).json({ message: 'Subject name is required.' });
    }

    const newAttendance = new Attendance({
      userId: req.user?.id,
      subjectName,
      attendedClasses: attendedClasses || 0,
      totalClasses: totalClasses || 0,
      requiredPercentage: requiredPercentage || 75
    });

    await newAttendance.save();
    return res.status(201).json(newAttendance);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 3. Update Attendance Record
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { attendedClasses, totalClasses, requiredPercentage } = req.body;
    
    const record = await Attendance.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    if (attendedClasses !== undefined) record.attendedClasses = attendedClasses;
    if (totalClasses !== undefined) record.totalClasses = totalClasses;
    if (requiredPercentage !== undefined) record.requiredPercentage = requiredPercentage;

    await record.save();
    return res.json(record);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

export default router;
