const express = require("express");
const router = express.Router();
const { getJobs } = require("../controllers/f13");

router.get("/jobs", getJobs);

module.exports = router;