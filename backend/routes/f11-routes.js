const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/f11");

router.get("/login", loginUser);

module.exports = router;