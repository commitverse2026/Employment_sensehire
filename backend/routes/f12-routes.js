const express = require('express');
const router = express.Router();

// ✅ FIX THIS LINE
const { getApplicants, getJobs } = require('../controllers/f12');

router.get('/jobs', getJobs);
router.get('/applicants/:jobId', getApplicants);

module.exports = router;