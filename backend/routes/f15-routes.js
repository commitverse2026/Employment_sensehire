const express = require('express')
const router = express.Router()
const { saveProfile } = require('../controllers/f15')

router.post('/profile', async (req, res) => {
  try {
    const profile = req.body
    const savedProfile = await saveProfile(profile)

    res.status(200).json({
      message: 'Profile saved successfully',
      profile: savedProfile,
    })
  } catch (error) {
    console.error('F15 saveProfile error:', error)
    const status = error.message && /required/i.test(error.message) ? 422 : 500
    res.status(status).json({
      error: error.message || 'Unable to save profile',
    })
  }
})

module.exports = router
