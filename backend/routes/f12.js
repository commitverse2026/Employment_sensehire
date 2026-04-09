const express = require('express');
const router = express.Router();
const { getSortedApplicants } = require('../controllers/applicantController');

router.get('/sorted-applicants', getSortedApplicants);

module.exports = router;