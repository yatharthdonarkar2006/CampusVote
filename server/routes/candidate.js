const express = require('express');
const auth = require('../middleware/auth');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/candidates';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
    }
  }
});

// Handle multiple file uploads
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idProof', maxCount: 1 },
  { name: 'manifestoFile', maxCount: 1 }
]);

// @route   POST /api/candidate/register
// @desc    Register as a candidate
// @access  Private
router.post('/register', auth, uploadFields, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get active election
    const activeElection = await Election.findOne({ status: 'active' });
    // Allow registration even if no active election
    let electionId = null;
    if (activeElection) {
      electionId = activeElection._id;
    }

    // Check if user is already a candidate for any election
    const existingCandidate = await Candidate.findOne({
      userId: req.user.id
    });

    if (existingCandidate) {
      return res.status(400).json({ error: 'You are already registered as a candidate' });
    }

    // Process form data
    const { position, manifesto, experience, achievements, goals, contactPhone } = req.body;
    let socialMedia = {};
    
    if (req.body.socialMedia) {
      try {
        socialMedia = JSON.parse(req.body.socialMedia);
      } catch (e) {
        console.error('Error parsing social media:', e);
      }
    }

    // Create achievements array
    const achievementsArray = [];
    if (achievements) {
      achievementsArray.push({
        title: 'Achievements',
        description: achievements,
        year: new Date().getFullYear()
      });
    }

    // Create new candidate
    const candidate = new Candidate({
      userId: req.user.id,
      position,
      manifesto,
      achievements: achievementsArray,
      electionId: electionId, // Use the electionId variable which can be null
      experience,
      goals,
      contactPhone,
      socialMedia,
      photoUrl: req.files.photo ? `/uploads/candidates/${req.files.photo[0].filename}` : null,
      idProofUrl: req.files.idProof ? `/uploads/candidates/${req.files.idProof[0].filename}` : null,
      manifestoFileUrl: req.files.manifestoFile ? `/uploads/candidates/${req.files.manifestoFile[0].filename}` : null
    });

    await candidate.save();

    res.status(201).json({
      message: 'Candidate registration successful. Your application is under review.',
      candidate
    });
  } catch (error) {
    console.error('Candidate registration error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation error', details: errors });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   GET /api/candidate/me
// @desc    Get current user's candidate profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user.id })
      .populate('electionId', 'title status startDate endDate')
      .populate('userId', 'name email branch year rollNumber');

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate profile not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Get candidate profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/candidate/all
// @desc    Get all approved candidates
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const candidates = await Candidate.find({ isApproved: true, isActive: true })
      .populate('userId', 'name email branch year rollNumber')
      .populate('electionId', 'title status');

    res.json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/candidate/:id
// @desc    Get candidate by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('userId', 'name email branch year rollNumber')
      .populate('electionId', 'title status startDate endDate');

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;