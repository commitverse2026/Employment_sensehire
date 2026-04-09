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