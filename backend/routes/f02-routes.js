// F02 — Disability Profile routes
// Read FEATURE.md before starting!
//
// Files to change:
//   backend/routes/f02-routes.js          ← YOU ARE HERE
//   backend/controllers/f02.js

const express = require("express");
const router = express.Router();
const {
  getDisabilityTypes,
  saveDisabilitySelection,
} = require("../controllers/f02");

// GET /api/disability-types
// Returns all disability categories with their sub-types
router.get("/disability-types", getDisabilityTypes);

// POST /api/disability
// Saves the selected disability category and sub-type to a candidate record
router.post("/disability", saveDisabilitySelection);

module.exports = router;
