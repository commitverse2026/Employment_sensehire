const express = require("express");
const router = express.Router();

const { generateJobVector } = require("../controllers/f06");

router.post("/generate", generateJobVector);

module.exports = router;