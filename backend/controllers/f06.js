const fs = require("fs");
const path = require("path");

const JOBS_PATH = path.join(__dirname, "../data/jobs.json");
const JOB_VECTORS_PATH = path.join(__dirname, "../data/job-vectors.json");

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return raw ? JSON.parse(raw) : [];
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function asDemandValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  if (parsed < 1) return 1;
  if (parsed > 5) return 5;
  return Math.round(parsed);
}

function generateJobVector(taskRequirements = {}) {
  return [
    asDemandValue(taskRequirements.visualMonitoring),
    asDemandValue(taskRequirements.phoneCalls),
    asDemandValue(taskRequirements.fineMotorInput),
    asDemandValue(taskRequirements.sustainedFocus),
    asDemandValue(taskRequirements.verbalCommunication),
  ];
}

function buildDimensions(vector) {
  return {
    visual: vector[0],
    auditory: vector[1],
    fineMotor: vector[2],
    cognitiveLoad: vector[3],
    verbalComm: vector[4],
  };
}

function upsertJobVector(jobId, vector) {
  const vectors = readJson(JOB_VECTORS_PATH);
  const existingIndex = vectors.findIndex((item) => item.jobId === jobId);
  const entry = {
    id: existingIndex >= 0 ? vectors[existingIndex].id : `jv${Date.now()}`,
    jobId,
    vector,
    dimensions: buildDimensions(vector),
    generatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    vectors[existingIndex] = { ...vectors[existingIndex], ...entry };
  } else {
    vectors.push(entry);
  }

  writeJson(JOB_VECTORS_PATH, vectors);
  return entry;
}

exports.generateAndSaveJobVector = (req, res) => {
  try {
    const { jobId } = req.body || {};
    if (!jobId) {
      return res.status(400).json({ error: "jobId is required" });
    }

    const jobs = readJson(JOBS_PATH);
    const jobIndex = jobs.findIndex((item) => item.id === jobId);
    if (jobIndex < 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (!job.taskRequirements) {
      return res.status(400).json({
        error: "Selected job has no taskRequirements from F04 sliders.",
      });
    }

    const vector = generateJobVector(job.taskRequirements);
    const savedVector = upsertJobVector(jobId, vector);

    jobs[jobIndex] = {
      ...job,
      jobVectorId: savedVector.id,
    };
    writeJson(JOBS_PATH, jobs);

    return res.json({
      message: "Job vector generated successfully",
      jobVector: savedVector,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to generate job vector" });
  }
};

exports.getJobVector = (req, res) => {
  try {
    const { jobId } = req.params;
    const vectors = readJson(JOB_VECTORS_PATH);
    const jobVector = vectors.find((item) => item.jobId === jobId);
    return res.json({ jobVector: jobVector || null });
  } catch (error) {
    return res.status(500).json({ error: "Unable to load job vector" });
  }
};

exports.generateJobVector = generateJobVector;
exports.upsertJobVector = upsertJobVector;
