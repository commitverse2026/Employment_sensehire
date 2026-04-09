const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/f10");

router.post("/", getRecommendations);

module.exports = router;
const express = require('express');
const router = express.Router();

const f10Controller = require('../controllers/f10');

// F10 specification: POST /api/recommendations
router.post('/', f10Controller.getRecommendations);

module.exports = router;
