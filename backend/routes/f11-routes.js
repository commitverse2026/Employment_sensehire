const express = require('express')
const { loginCandidate, getCandidateData } = require('../controllers/f11')

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const payload = await loginCandidate(req.body)
    res.status(200).json(payload)
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({
      error: error.message || 'Login failed',
    })
  }
})

router.get('/candidate/:id', async (req, res) => {
  try {
    const payload = await getCandidateData(req.params.id)
    res.status(200).json(payload)
  } catch (error) {
    const status = error.status || 500
    res.status(status).json({
      error: error.message || 'Unable to fetch candidate',
    })
  }
})

module.exports = router
