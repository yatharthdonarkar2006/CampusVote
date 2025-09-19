const express = require('express');
const auth = require('../middleware/auth');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

const router = express.Router();

// @route   GET /api/voting/candidates/:electionId
// @desc    List candidates for an election grouped by position
// @access  Private
router.get('/candidates/:electionId', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const candidates = await Candidate.find({
      electionId: req.params.electionId,
      isApproved: true,
      isActive: true
    }).populate('userId', 'name branch year');

    // Group by position
    const grouped = candidates.reduce((acc, c) => {
      if (!acc[c.position]) acc[c.position] = [];
      acc[c.position].push({
        _id: c._id,
        name: c.userId?.name,
        manifesto: c.manifesto,
        position: c.position
      });
      return acc;
    }, {});

    res.json({ election: { id: election._id, title: election.title }, candidates: grouped });
  } catch (error) {
    console.error('List candidates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/voting/cast-vote
// @desc    Cast a vote
// @access  Private
router.post('/cast-vote', auth, async (req, res) => {
  try {
    const { electionId, candidateId, position } = req.body;

    // Check if election is active
    const election = await Election.findById(electionId);
    if (!election || election.status !== 'active') {
      return res.status(400).json({ error: 'Election is not active' });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      electionId,
      voterId: req.user.id,
      position
    });

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for this position' });
    }

    // Create new vote
    const vote = new Vote({
      electionId,
      voterId: req.user.id,
      candidateId,
      position,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await vote.save();

    res.json({ message: 'Vote cast successfully', vote });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/voting/results/:electionId
// @desc    Get election results summary by position and candidate
// @access  Private/Admin (for now keep public summary)
router.get('/results/:electionId', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const aggregation = await Vote.aggregate([
      { $match: { electionId: election._id } },
      { $group: { _id: { candidateId: '$candidateId', position: '$position' }, count: { $sum: 1 } } },
      { $lookup: { from: 'candidates', localField: '_id.candidateId', foreignField: '_id', as: 'candidate' } },
      { $unwind: '$candidate' },
      { $lookup: { from: 'users', localField: 'candidate.userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { position: '$_id.position', candidateId: '$_id.candidateId', votes: '$count', name: '$user.name' } },
      { $sort: { position: 1, votes: -1 } }
    ]);

    // Group by position for easier consumption
    const results = aggregation.reduce((acc, row) => {
      if (!acc[row.position]) acc[row.position] = [];
      acc[row.position].push({ candidateId: row.candidateId, name: row.name, votes: row.votes });
      return acc;
    }, {});

    res.json({ election: { id: election._id, title: election.title }, results });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
