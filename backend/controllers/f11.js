const fs = require('fs').promises
const path = require('path')

const USERS_FILE = path.join(__dirname, '../data/users.json')
const CANDIDATES_FILE = path.join(__dirname, '../data/candidates.json')
const JOBS_FILE = path.join(__dirname, '../data/jobs.json')
const ABILITY_VECTORS_FILE = path.join(__dirname, '../data/ability-vectors.json')
const JOB_VECTORS_FILE = path.join(__dirname, '../data/job-vectors.json')

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  return JSON.parse(content)
}

async function getCandidateData(candidateId) {
  const [candidates, jobs, abilityVectors, jobVectors] = await Promise.all([
    readJson(CANDIDATES_FILE),
    readJson(JOBS_FILE),
    readJson(ABILITY_VECTORS_FILE),
    readJson(JOB_VECTORS_FILE),
  ])

  const candidate = candidates.find((item) => item.id === candidateId)
  if (!candidate) {
    const error = new Error('Candidate not found')
    error.status = 404
    throw error
  }

  return {
    candidate,
    jobs,
    abilityVectors,
    jobVectors,
  }
}

async function loginCandidate(payload = {}) {
  const username = String(payload.username || '').trim().toLowerCase()
  const password = String(payload.password || '')

  if (!username || !password) {
    const error = new Error('Username and password are required')
    error.status = 400
    throw error
  }

  const users = await readJson(USERS_FILE)
  const user = users.find(
    (item) => item.username.toLowerCase() === username
      && item.password === password
      && item.role === 'candidate'
  )

  if (!user || !user.candidateId) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const data = await getCandidateData(user.candidateId)

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      candidateId: user.candidateId,
      email: user.email,
    },
    ...data,
  }
}

module.exports = {
  loginCandidate,
  getCandidateData,
}
