const express = require("express");
const router = express.Router();
const controller = require("../controllers/f13");

router.get("/jobs", controller.getJobs);

module.exports = router;
