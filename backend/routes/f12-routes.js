const express = require('express');
const router = express.Router();
const f12Controller = require('../controllers/f12');

router.get('/employer/applicants/:jobId', f12Controller.getApplicantsForJob);

module.exports = router;
