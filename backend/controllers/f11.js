// F11 Controller — Candidate Dashboard

const fs = require("fs");
const path = require("path");

const USERS_PATH = path.join(__dirname, "../data/users.json");
const CANDIDATES_PATH = path.join(__dirname, "../data/candidates.json");
const JOBS_PATH = path.join(__dirname, "../data/jobs.json");
const ABILITY_VECTORS_PATH = path.join(
  __dirname,
  "../data/ability-vectors.json",
);
const JOB_VECTORS_PATH = path.join(__dirname, "../data/job-vectors.json");

/**
 * POST /api/login
 * Validates username/password against users.json
 * Returns candidate data if valid
 */
const login = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    // Read users.json
    const usersData = fs.readFileSync(USERS_PATH, "utf-8");
    const users = JSON.parse(usersData);

    // Find user by username and password
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Only allow candidates to log in
    if (user.role !== "candidate") {
      return res
        .status(403)
        .json({ message: "Only candidates can login here" });
    }

    // Get candidate data
    const candidatesData = fs.readFileSync(CANDIDATES_PATH, "utf-8");
    const candidates = JSON.parse(candidatesData);

    const candidate = candidates.find((c) => c.id === user.candidateId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    res.json({
      success: true,
      user,
      candidate,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * GET /api/candidate/:userId
 * Returns candidate profile with recommended jobs
 */
const getCandidateProfile = (req, res) => {
  try {
    const { userId } = req.params;

    const candidatesData = fs.readFileSync(CANDIDATES_PATH, "utf-8");
    const candidates = JSON.parse(candidatesData);

    const candidate = candidates.find((c) => c.userId === userId);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(candidate);
  } catch (error) {
    console.error("Error getting candidate:", error);
    res.status(500).json({ message: "Error fetching candidate" });
  }
};

/**
 * GET /api/jobs
 * Returns all jobs from jobs.json
 */
const getJobs = (req, res) => {
  try {
    const jobsData = fs.readFileSync(JOBS_PATH, "utf-8");
    const jobs = JSON.parse(jobsData);
    res.json(jobs);
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

/**
 * GET /api/vectors
 * Returns all vectors (ability vectors + job vectors combined)
 * This allows the frontend to calculate compatibility scores
 */
const getVectors = (req, res) => {
  try {
    const abilityData = fs.readFileSync(ABILITY_VECTORS_PATH, "utf-8");
    const jobData = fs.readFileSync(JOB_VECTORS_PATH, "utf-8");

    const abilityVectors = JSON.parse(abilityData);
    const jobVectors = JSON.parse(jobData);

    // Return both vectors combined
    res.json([...abilityVectors, ...jobVectors]);
  } catch (error) {
    console.error("Error getting vectors:", error);
    res.status(500).json({ message: "Error fetching vectors" });
  }
};

module.exports = {
  login,
  getCandidateProfile,
  getJobs,
  getVectors,
};
