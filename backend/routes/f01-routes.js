// F01 — Onboarding Form routes
const express = require('express')
const router = express.Router()
const { createCandidate } = require('../controllers/f01')

router.post('/', createCandidate)

module.exports = router
