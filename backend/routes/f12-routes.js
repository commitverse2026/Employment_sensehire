const express = require("express");
const router = express.Router();
const {
  login,
  getJobs,
  getEmployerApplicants,
} = require("../controllers/f12");

router.post("/login", login);
router.get("/employer/jobs", getJobs);
router.get("/employer/applicants/:jobId", getEmployerApplicants);

module.exports = router;
const { getCandidates } = require("../controllers/f12");

router.get("/candidates", getCandidates);

module.exports = router;
