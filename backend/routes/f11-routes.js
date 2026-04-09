const express = require("express");
const router = express.Router();
const {
  getCandidateById,
  getCandidateDashboard,
} = require("../controllers/f11");

router.get("/candidate/:id", getCandidateById);
router.get("/candidate/dashboard/:candidateId", getCandidateDashboard);

module.exports = router;
