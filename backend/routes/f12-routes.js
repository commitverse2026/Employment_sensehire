const express = require("express");
const router = express.Router();
const { getCandidates } = require("../controllers/f12");

router.get("/candidates", getCandidates);

module.exports = router;