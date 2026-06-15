import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// POST: User Login
router.post('/login', async (req, res) => {
    try {
        const { portalId, password } = req.body;

        if (!portalId || !password) {
            return res.status(400).json({ error: 'Portal ID and password are required' });
        }

        // Find user
        const user = await User.findOne({ portalId });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, portalId: user.portalId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                portalId: user.portalId,
                email: user.email,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST: User Signup
router.post('/signup', async (req, res) => {
    try {
        const { portalId, password, name, email, department, semester } = req.body;

        // Validate input
        if (!portalId || !password || !name || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ portalId }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        const user = new User({
            portalId,
            encryptedPassword: password,
            name,
            email,
            department,
            semester,
            themePreferences: {
                primaryColor: '#ec4899',
                accentColor: '#14b8a6',
                animationsEnabled: true
            }
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, portalId: user.portalId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                portalId: user.portalId,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// GET: Verify token
router.get('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, userId: decoded.userId });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Invalid token' });
    }
});

export default router;
