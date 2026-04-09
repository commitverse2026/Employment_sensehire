const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const candidatesPath = path.join(__dirname, '../data/candidates.json');
const jobsPath = path.join(__dirname, '../data/jobs.json');
const abilityVectorsPath = path.join(__dirname, '../data/ability-vectors.json');
const jobVectorsPath = path.join(__dirname, '../data/job-vectors.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

exports.login = (req, res) => {
  const { username, password } = req.body;
  const users = readJson(usersPath);
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Also return necessary context data for dashboards since this is a limited hackathon environment
  const commonData = {
    jobs: readJson(jobsPath),
    abilityVectors: readJson(abilityVectorsPath),
    jobVectors: readJson(jobVectorsPath)
  };

  if (user.role === 'candidate') {
    const candidates = readJson(candidatesPath);
    const candidate = candidates.find(c => c.id === user.candidateId);
    return res.json({ user, candidate, ...commonData });
  } else if (user.role === 'employer') {
    return res.json({ user, ...commonData });
  } else {
    return res.status(403).json({ message: 'Unknown role' });
  }
};

exports.getCandidate = (req, res) => {
  const candidates = readJson(candidatesPath);
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
  res.json(candidate);
};
