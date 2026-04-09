const fs = require('fs');
const path = require('path');

const candidatesPath = path.join(__dirname, '../data/candidates.json');
const abilityVectorsPath = path.join(__dirname, '../data/ability-vectors.json');
const jobVectorsPath = path.join(__dirname, '../data/job-vectors.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const dimensions = ["visual", "auditory", "fineMotor", "cognitiveLoad", "verbalComm"];

const getWorstGapSummary = (candVecObj, jobVecObj) => {
  const cVec = candVecObj.vector;
  const jVec = jobVecObj.vector;
  
  let worstGap = -1;
  let worstDim = null;

  for (let i = 0; i < cVec.length; i++) {
    const gap = jVec[i] - cVec[i];
    if (gap > worstGap) {
      worstGap = gap;
      worstDim = dimensions[i];
    }
  }

  if (worstGap <= 0) {
    return "No significant gaps identified.";
  }

  const dimNames = {
    visual: "Visual capability",
    auditory: "Auditory capability",
    fineMotor: "Fine motor skills",
    cognitiveLoad: "Cognitive load",
    verbalComm: "Verbal communication"
  };

  return `${dimNames[worstDim]} is lower than what the job typically demands.`;
};

const getTierBadge = (score) => {
  if (score >= 0.9) return "Excellent";
  if (score >= 0.8) return "Good";
  if (score >= 0.7) return "Possible";
  return "Unlikely";
};

exports.getApplicantsForJob = (req, res) => {
  const jobId = req.params.jobId;
  const allCandidates = readJson(candidatesPath);
  const candidates = allCandidates.filter(c => c.appliedJobs && c.appliedJobs.includes(jobId));

  const abilityVectors = readJson(abilityVectorsPath);
  const jobVectors = readJson(jobVectorsPath);
  const jVecObj = jobVectors.find(jv => jv.jobId === jobId);

  if (!jVecObj) {
    return res.status(404).json({ message: 'Job vector not found' });
  }

  const result = candidates.map(c => {
    const cVecObj = abilityVectors.find(av => av.candidateId === c.id);
    let score = 0;
    let gapSummary = "Vectors missing";
    let tier = "Unclassifiable";
    
    if (cVecObj) {
      score = cosineSimilarity(cVecObj.vector, jVecObj.vector);
      gapSummary = getWorstGapSummary(cVecObj, jVecObj);
      tier = getTierBadge(score);
    }

    return {
      candidate: c,
      score: score,
      scorePercent: Math.round(score * 100),
      gapSummary,
      tier
    };
  });

  result.sort((a, b) => b.score - a.score);
  res.json(result);
};
