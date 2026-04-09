const candidates = require('../data/candidates.json');
const jobs = require('../data/jobs.json');

// ✅ ADD THIS FUNCTION
const getJobs = (req, res) => {
  res.json(jobs);
};

const getApplicants = (req, res) => {
  try {
    const { jobId } = req.params;

    const job = jobs.find((j) => j.id == jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const filtered = candidates.filter((c) =>
      c.appliedJobs?.includes(jobId)
    );

    const result = filtered.map((c) => {
      const score = getScore();

      return {
        ...c,
        compatibilityScore: score,
        tier: getTier(score),
        gapSummary: getGap(),
      };
    });

    result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// helpers
const getScore = () => Math.floor(Math.random() * 100);

const getTier = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Possible';
  return 'Unlikely';
};

const getGap = () => 'Needs improvement in required skills';

// ✅ IMPORTANT: EXPORT IT
module.exports = { getApplicants, getJobs };