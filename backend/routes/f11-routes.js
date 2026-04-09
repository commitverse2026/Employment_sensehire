const express = require("express");
const router = express.Router();
const { login, getCandidate } = require("../controllers/f11");

router.post("/login", login);
router.get("/candidate/:id", getCandidate);

module.exports = router;