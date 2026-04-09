const fs = require("fs");
const path = require("path");

const USERS_PATH = path.join(__dirname, "../data/users.json");
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

const DIMENSIONS = ["visual", "auditory", "fineMotor", "cognitiveLoad", "verbalComm"];
const DIMENSION_LABELS = {
  visual: "Visual processing",
  auditory: "Auditory tasks",
  fineMotor: "Fine motor input",
  cognitiveLoad: "Sustained focus",
  verbalComm: "Verbal communication",
};

function getWorstGapSummary(candidateVector = [], jobVector = []) {
  let worstGap = null;

  for (let i = 0; i < DIMENSIONS.length; i += 1) {
    const jobDemand = Number(jobVector[i] || 0);
    const candidateAbility = Number(candidateVector[i] || 0);
    const severity = jobDemand - candidateAbility;

    if (severity <= 0) continue;

    if (!worstGap || severity > worstGap.severity) {
      worstGap = {
        key: DIMENSIONS[i],
        jobDemand,
        candidateAbility,
        severity,
      };
    }
  }

  if (!worstGap) {
    return "No significant gaps identified.";
  }

  return `${DIMENSION_LABELS[worstGap.key]} demand is ${worstGap.jobDemand}, candidate score is ${worstGap.candidateAbility}.`;
}

exports.login = (req, res) => {
  try {
    const { username, password } = req.body || {};
    const users = readJson(USERS_PATH);
    const user = users.find(
      (item) => item.username === username && item.password === password,
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      candidateId: user.candidateId || null,
      email: user.email || null,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to process login" });
  }
};

exports.getJobs = (req, res) => {
  try {
    const jobs = readJson(JOBS_PATH);
    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load jobs" });
  }
};

exports.getEmployerApplicants = (req, res) => {
  try {
    const { jobId } = req.params;
    const candidates = readJson(CANDIDATES_PATH);
    const abilityVectors = readJson(ABILITY_VECTORS_PATH);
    const jobVectors = readJson(JOB_VECTORS_PATH);

    const jobVectorEntry = jobVectors.find((entry) => entry.jobId === jobId);
    if (!jobVectorEntry || !Array.isArray(jobVectorEntry.vector)) {
      return res.json({ applicants: [] });
    }

    const applicants = candidates
      .filter((candidate) => Array.isArray(candidate.appliedJobs) && candidate.appliedJobs.includes(jobId))
      .map((candidate) => {
        const ability = abilityVectors.find((entry) => entry.candidateId === candidate.id);
        const candidateVector = ability?.vector || [];
        const similarity = cosineSimilarity(candidateVector, jobVectorEntry.vector);
        const score = Math.round(similarity * 100);

        return {
          id: candidate.id,
          fullName: candidate.fullName,
          preferredRole: Array.isArray(candidate.preferredRoles) ? (candidate.preferredRoles[0] || "Not specified") : "Not specified",
          location: candidate.location || "Not specified",
          score,
          tier: getTier(score),
          gapSummary: getWorstGapSummary(candidateVector, jobVectorEntry.vector),
        };
      })
      .sort((a, b) => b.score - a.score);

    return res.json({ applicants });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load applicants" });
  }
};
const rawCandidates = require("../data/candidates.json");

exports.getCandidates = (req, res) => {
  const transformed = rawCandidates.map((c) => {
    // If already formatted → return as is
    if (c.name) return c;

    // Convert old format → new format
    return {
      id: c.id,
      name: c.fullName,
      role: c.preferredRoles?.[0] || "Candidate",
      score: c.profileComplete || 70,
      summary: c.bio || "No summary available",
      gapSummary: "Skill gap analysis pending"
    };
  });

  res.json(transformed);
};
