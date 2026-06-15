import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Attendance } from '../models/Attendance';
import { Timetable } from '../models/Timetable';
import { encrypt } from '../utils/crypto';
import { syncCollegePortal } from '../services/scraperService';

const router = Router();

// 1. Configure Portal Credentials
router.post('/config', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Portal username and password are required.' });
    }

    const encryptedPassword = encrypt(password);
    
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.portalCredentials = {
      username,
      passwordEncrypted: encryptedPassword
    };

    await user.save();
    return res.json({ message: 'College portal configuration updated and encrypted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 2. Sync Real-Time Academic Portal Data (Scraper Trigger & Local Cache Seeder)
router.post('/sync', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const credentials = user.portalCredentials;
    if (!credentials || !credentials.username || !credentials.passwordEncrypted) {
      // If credentials aren't saved yet, use guest/demo accounts to show dashboard integration
      console.log(`[SyncAPI] No credentials set. Performing guest/demo sync for college: ${user.college}`);
      credentials.username = 'demo_user';
      credentials.passwordEncrypted = encrypt('demo_password');
    }

    // Trigger Puppeteer or mock sync
    const data = await syncCollegePortal(user.college, credentials.username, credentials.passwordEncrypted);

    // Save/Overwrite Attendance in cache
    await Attendance.deleteMany({ userId: user._id });
    const attendanceDocs = data.attendance.map(a => ({
      userId: user._id,
      subjectName: a.subjectName,
      attendedClasses: a.attendedClasses,
      totalClasses: a.totalClasses,
      requiredPercentage: 75 // University default mandate
    }));
    await Attendance.insertMany(attendanceDocs);

    // Save/Overwrite Timetable in cache
    await Timetable.deleteMany({ userId: user._id });
    const timetableDocs = data.timetable.map(t => ({
      userId: user._id,
      dayOfWeek: t.dayOfWeek,
      subjectName: t.subjectName,
      startTime: t.startTime,
      endTime: t.endTime,
      roomCode: t.roomCode,
      facultyName: t.facultyName
    }));
    await Timetable.insertMany(timetableDocs);

    // Note: Internal Marks and Seating arrangements are returned dynamically in the response
    // rather than fully stored as they change often. They are cached in the browser or saved locally.
    return res.json({
      message: 'Dashboard synced successfully with college portal.',
      lastSyncTime: new Date(),
      data
    });
  } catch (err) {
    return res.status(500).json({ message: 'Portal sync failed: ' + (err as Error).message });
  }
});

export default router;
