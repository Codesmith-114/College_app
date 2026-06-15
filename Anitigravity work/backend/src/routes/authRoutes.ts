import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'antigravity-jwt-secret-key-development';

// 1. Register User
router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, college } = req.body;
    
    if (!name || !email || !password || !college) {
      return res.status(400).json({ message: 'All registration fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      passwordHash,
      college
    });

    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        themePreferences: newUser.themePreferences
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 2. Login User
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        themePreferences: user.themePreferences
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 3. Get User Profile & Preferences
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

// 4. Update Dashboard Theme & Customizations
router.put('/preferences', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { accentColor, animationIntensity, compactMode } = req.body;
    
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (accentColor) user.themePreferences.accentColor = accentColor;
    if (animationIntensity) user.themePreferences.animationIntensity = animationIntensity;
    if (compactMode !== undefined) user.themePreferences.compactMode = compactMode;

    await user.save();
    return res.json({
      message: 'Theme preference saved successfully.',
      themePreferences: user.themePreferences
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error: ' + (err as Error).message });
  }
});

export default router;
