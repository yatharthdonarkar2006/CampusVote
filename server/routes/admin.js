const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const users = await User.find().select('-password -otp -otpExpiry');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/users/:id/approve
// @desc    Approve a user (admin only)
// @access  Private/Admin
router.post('/users/:id/approve', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password -otp -otpExpiry');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// =============== Additional Admin Endpoints ===============

// @route   GET /api/admin/elections
// @desc    Get all elections (admin only)
// @access  Private/Admin
router.get('/elections', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const elections = await Election.find(filter).sort({ startDate: -1 });
    res.json(elections);
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/candidates
// @desc    Get candidates, optionally filtered by electionId (admin only)
// @access  Private/Admin
router.get('/candidates', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { electionId, isApproved } = req.query;
    const filter = {};
    if (electionId) filter.electionId = electionId;
    if (typeof isApproved !== 'undefined') filter.isApproved = isApproved === 'true';

    const candidates = await Candidate.find(filter)
      .populate('userId', 'name email branch year')
      .populate('electionId', 'title status startDate endDate')
      .sort({ position: 1, createdAt: -1 });

    res.json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/candidates/:id/approve
// @desc    Approve candidate (admin only)
// @access  Private/Admin
router.post('/candidates/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, approvedBy: req.user.id, approvedAt: new Date() },
      { new: true }
    )
      .populate('userId', 'name email branch year')
      .populate('electionId', 'title');

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ message: 'Candidate approved successfully', candidate });
  } catch (error) {
    console.error('Approve candidate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
