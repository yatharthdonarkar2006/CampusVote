const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
// OTP functionality removed

const router = express.Router();

// Multer setup for parsing multipart/form-data (memory storage, since image is base64 in frontend)
const upload = multer();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register',
  upload.none(), // Parse multipart/form-data fields (no files expected, image is base64 string)
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('rollNo').trim().notEmpty().withMessage('Roll number is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('branch').isIn(['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Information Technology']).withMessage('Invalid branch'),
    body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4'),
    body('studentId').trim().notEmpty().withMessage('Student ID is required')
  ],
  async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, rollNo, email, password, branch, year, studentId, idImage } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { rollNo }, { studentId }] });
    if (user) {
      return res.status(400).json({ 
        error: 'User already exists with this email, roll number, or student ID' 
      });
    }

    // Create new user
    user = new User({
      name,
      rollNo,
      email,
      password,
      branch,
      year,
      studentId,
      idImage
    });

    // Auto-verify user; OTP flow disabled
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: user.getPublicProfile(),
          message: 'Registration successful.'
        });
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user is approved
    if (!user.isApproved) {
      return res.status(400).json({ error: 'Account not yet approved by admin' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: user.getPublicProfile()
        });
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for email verification
// @access  Private
router.post('/verify-otp', auth, async (req, res) => {
  return res.status(400).json({ error: 'OTP verification is disabled.' });
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP for email verification
// @access  Private
router.post('/resend-otp', auth, async (req, res) => {
  return res.status(400).json({ error: 'OTP is disabled; resending is not available.' });
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
