const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/f10");

router.post("/", getRecommendations);

module.exports = router;