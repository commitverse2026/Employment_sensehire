// F01 — Onboarding Form routes
// Read FEATURE.md before starting!
//
// Files to change:
//   backend/routes/f01-onboarding.js          ← YOU ARE HERE
//   backend/controllers/f01-onboarding.controller.js

const express = require('express');
const router = express.Router();

// TODO: POST /api/onboarding
// Should read candidates.json, append new candidate, write back
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;