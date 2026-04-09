const express = require('express')
const cors = require('cors')
const onboardingRoutes = require('./routes/f01-routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/onboarding', onboardingRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`)
})
