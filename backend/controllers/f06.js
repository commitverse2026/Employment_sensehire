const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/job-vectors.json");

// Keyword mapping → dimensions
const keywordMap = {
  frontend: ["react", "ui", "css", "html"],
  backend: ["node", "api", "server", "express"],
  data: ["sql", "data", "analysis", "python"],
  devops: ["aws", "docker", "ci", "deployment"],
  design: ["figma", "ux", "design"]
};

function generateVector(text) {
  text = text.toLowerCase();

  let vector = {
    frontend: 0,
    backend: 0,
    data: 0,
    devops: 0,
    design: 0
  };

  Object.keys(keywordMap).forEach((key) => {
    keywordMap[key].forEach((word) => {
      if (text.includes(word)) {
        vector[key] += 20;
      }
    });
  });

  // Normalize (max 100)
  Object.keys(vector).forEach((k) => {
    if (vector[k] > 100) vector[k] = 100;
  });

  return vector;
}

exports.generateJobVector = (req, res) => {
  const { title, description } = req.body;

  const vector = generateVector(description);

  const newEntry = {
    id: Date.now(),
    title,
    vector
  };

  let existing = [];
  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath));
  }

  existing.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  res.json({
    success: true,
    data: newEntry
  });
};