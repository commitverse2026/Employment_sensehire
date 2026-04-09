const fs = require("fs");
const path = require("path");

// Path to JSON
const TYPES_PATH = path.join(__dirname, "../data/disability-types.json");
const DATA_PATH = path.join(__dirname, "../data/disabilities.json");

// GET /api/disability-types
exports.getDisabilityTypes = (req, res) => {
  const data = JSON.parse(fs.readFileSync(TYPES_PATH, "utf8"));
  res.json(data);
};

// POST /api/disability
exports.saveDisability = (req, res) => {
  const { category, subtype } = req.body;

  if (!category || !subtype) {
    return res.status(400).json({ message: "All fields required" });
  }

  let existing = [];

  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  }

  const newEntry = {
    id: "d" + (existing.length + 1),
    category,
    subtype
  };

  existing.push(newEntry);

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2));

  res.json({ message: "Disability saved", data: newEntry });
};