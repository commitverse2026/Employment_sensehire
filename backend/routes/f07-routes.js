const express = require("express");
const router = express.Router();

const { calculateSimilarity } = require("../controllers/f07");

// ✅ Route
router.post("/", calculateSimilarity);

// ✅ VERY IMPORTANT
module.exports = router;