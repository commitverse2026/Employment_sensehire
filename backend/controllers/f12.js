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