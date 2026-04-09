// routes/f08-routes.js

const express = require("express");
const router = express.Router();
const { getMatchScore } = require("../controllers/f08");

router.get("/match/:jobId", getMatchScore);

module.exports = router;