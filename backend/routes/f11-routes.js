// F11 — Candidate Dashboard routes
// Login, candidate profiles, jobs, and vectors

const express = require("express");
const router = express.Router();
const {
  login,
  getCandidateProfile,
  getJobs,
  getVectors,
} = require("../controllers/f11");

// POST /api/login
// Validates username/password against users.json
router.post("/login", login);

// GET /api/candidate/:userId
// Returns candidate profile with recommended jobs
router.get("/candidate/:userId", getCandidateProfile);

// GET /api/jobs
// Returns all jobs
router.get("/jobs", getJobs);

// GET /api/vectors
// Returns all ability and job vectors
router.get("/vectors", getVectors);

module.exports = router;
