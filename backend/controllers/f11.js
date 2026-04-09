const fs = require("fs");
const path = require("path");

const CANDIDATES_PATH = path.join(__dirname, "../data/candidates.json");
const JOBS_PATH = path.join(__dirname, "../data/jobs.json");
const ABILITY_VECTORS_PATH = path.join(__dirname, "../data/ability-vectors.json");
const JOB_VECTORS_PATH = path.join(__dirname, "../data/job-vectors.json");

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw ? JSON.parse(raw) : [];
}

function cosineSimilarity(vecA = [], vecB = []) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
    return 0;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i += 1) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  const a = Math.sqrt(magA);
  const b = Math.sqrt(magB);
  if (a === 0 || b === 0) return 0;

  return dot / (a * b);
}

function getTier(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Possible";
  return "Unlikely";
}

exports.getCandidateById = (req, res) => {
  try {
    const { id } = req.params;
    const candidates = readJson(CANDIDATES_PATH);
    const candidate = candidates.find((item) => item.id === id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    return res.json({ candidate });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load candidate profile" });
  }
};

exports.getCandidateDashboard = (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidates = readJson(CANDIDATES_PATH);
    const jobs = readJson(JOBS_PATH);
    const abilityVectors = readJson(ABILITY_VECTORS_PATH);
    const jobVectors = readJson(JOB_VECTORS_PATH);

    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const candidateVector = abilityVectors.find(
      (item) => item.candidateId === candidateId,
    )?.vector;

    if (!Array.isArray(candidateVector)) {
      return res.json({ candidate, bestFit: null, rankedJobs: [] });
    }

    const rankedJobs = jobs
      .map((job) => {
        const vector = jobVectors.find((entry) => entry.jobId === job.id)?.vector;
        if (!Array.isArray(vector)) return null;

        const score = Math.round(cosineSimilarity(candidateVector, vector) * 100);
        return {
          id: job.id,
          title: job.title || "Untitled role",
          company: job.company || "Unknown company",
          score,
          tier: getTier(score),
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    return res.json({
      candidate,
      bestFit: rankedJobs[0] || null,
      rankedJobs,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load candidate dashboard" });
  }
};
const users = require("../data/users.json");
const candidates = require("../data/candidates.json");

exports.loginUser = (req, res) => {
  const { username } = req.query;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.json({ success: false });
  }

  const candidate = candidates.find((c) => c.userId === user.id);

  // Dummy job scoring
  const jobs = [
    { id: 1, title: "Frontend Developer", company: "Google" },
    { id: 2, title: "Backend Engineer", company: "Amazon" },
    { id: 3, title: "UI Designer", company: "Adobe" }
  ].map((job) => ({
    ...job,
    score: Math.floor(Math.random() * 40) + 60 // random 60–100
  }));

  // Sort
  jobs.sort((a, b) => b.score - a.score);

  res.json({
    success: true,
    profileComplete: candidate.profileComplete,
    bestJob: jobs[0],
    jobs
  });
};
