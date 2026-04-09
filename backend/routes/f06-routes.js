const express = require("express");
const router = express.Router();
const {
  generateAndSaveJobVector,
  getJobVector,
} = require("../controllers/f06");

router.post("/job-vector", generateAndSaveJobVector);
router.get("/job-vector/:jobId", getJobVector);

module.exports = router;
