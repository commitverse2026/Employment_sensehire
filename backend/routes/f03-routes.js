const express = require("express");
const router = express.Router();
const { generateAbilityVector } = require("../controllers/f03");

router.post("/generate", generateAbilityVector);

module.exports = router;