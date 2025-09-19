const express = require('express');
const auth = require('../middleware/auth');
const Booth = require('../models/Booth');
const Election = require('../models/Election');

const router = express.Router();

// @route   GET /api/booth/all
// @desc    Get all booths for an election
// @access  Public
router.get('/all/:electionId', async (req, res) => {
  try {
    const booths = await Booth.find({ 
      electionId: req.params.electionId,
      isActive: true 
    });
    
    res.json(booths);
  } catch (error) {
    console.error('Get booths error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/booth/active
// @desc    Get all booths for the active election
// @access  Public
router.get('/active', async (req, res) => {
  try {
    // Find active election
    const activeElection = await Election.findOne({ status: 'active' });
    
    if (!activeElection) {
      return res.json({ booths: [] }); // Return empty array instead of error
    }
    
    const booths = await Booth.find({ 
      electionId: activeElection._id,
      isActive: true 
    });
    
    res.json({ booths });
  } catch (error) {
    console.error('Get active booths error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/booth/:id
// @desc    Get specific booth details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id);
    
    if (!booth) {
      return res.status(404).json({ error: 'Booth not found' });
    }
    
    res.json(booth);
  } catch (error) {
    console.error('Get booth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
