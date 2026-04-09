// F02 Controller — Disability Profile
// Handles reading and writing disability type selections

const fs = require("fs");
const path = require("path");

const DISABILITY_TYPES_PATH = path.join(
  __dirname,
  "../data/disability-types.json",
);
const CANDIDATES_PATH = path.join(__dirname, "../data/candidates.json");

/**
 * GET /api/disability-types
 * Returns all 4 disability categories with their sub-types
 */
const getDisabilityTypes = (req, res) => {
  try {
    const data = fs.readFileSync(DISABILITY_TYPES_PATH, "utf-8");
    const disabilityTypes = JSON.parse(data);
    res.json(disabilityTypes);
  } catch (error) {
    console.error("Error reading disability types:", error);
    res.status(500).json({ message: "Error loading disability types" });
  }
};

/**
 * POST /api/disability
 * Saves the selected disability category and sub-type to a candidate record.
 * Expected body: { disabilityCategory, disabilitySubType, categoryId, subTypeId }
 *
 * Schema (candidates.json):
 *   - disabilityCategory: string (e.g., "Visual", "Hearing", "Motor", "Cognitive")
 *   - disabilitySubType: string (e.g., "Low Vision", "Deaf")
 */
const saveDisabilitySelection = (req, res) => {
  try {
    const { disabilityCategory, disabilitySubType } = req.body;

    if (!disabilityCategory || !disabilitySubType) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: disabilityCategory, disabilitySubType",
        });
    }

    // Read existing candidates
    let candidates = [];
    if (fs.existsSync(CANDIDATES_PATH)) {
      const data = fs.readFileSync(CANDIDATES_PATH, "utf-8");
      candidates = JSON.parse(data);
    }

    // For now, update the first candidate (or create one if none exist)
    // In production, you'd get the userId from a session/auth token
    if (candidates.length === 0) {
      candidates.push({
        id: "c999",
        userId: "u999",
        fullName: "Anonymous User",
        disabilityCategory,
        disabilitySubType,
      });
    } else {
      candidates[0].disabilityCategory = disabilityCategory;
      candidates[0].disabilitySubType = disabilitySubType;
    }

    // Write back to candidates.json
    fs.writeFileSync(CANDIDATES_PATH, JSON.stringify(candidates, null, 2));

    res.json({
      message: "Disability profile saved successfully",
      disabilityCategory,
      disabilitySubType,
    });
  } catch (error) {
    console.error("Error saving disability selection:", error);
    res.status(500).json({ message: "Error saving disability profile" });
  }
};

module.exports = {
  getDisabilityTypes,
  saveDisabilitySelection,
};
