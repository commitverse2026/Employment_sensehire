const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");
const candidatesPath = path.join(__dirname, "../data/candidates.json");
const abilityVectorsPath = path.join(__dirname, "../data/ability-vectors.json");

const login = (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(
    (u) => u.username === username && u.password === password && u.role === "candidate"
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const candidates = JSON.parse(fs.readFileSync(candidatesPath));
  const candidate = candidates.find((c) => c.id === user.candidateId);

  if (!candidate) {
    return res.status(404).json({ error: "Candidate profile not found" });
  }

  res.json({ user, candidate });
};

const getCandidate = (req, res) => {
  const { id } = req.params;
  const candidates = JSON.parse(fs.readFileSync(candidatesPath));
  const abilityVectors = JSON.parse(fs.readFileSync(abilityVectorsPath));

  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }

  const abilityVector = abilityVectors.find((av) => av.id === candidate.abilityVectorId);

  res.json({ candidate, abilityVector });
};

module.exports = { login, getCandidate };