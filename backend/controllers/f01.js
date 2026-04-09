const fs = require('fs').promises
const path = require('path')

const CANDIDATES_FILE = path.join(__dirname, '../data/candidates.json')

function validateCandidate(payload) {
  const errors = {}
  const fullName = String(payload.fullName || '').trim()
  const email = String(payload.email || '').trim()
  const skills = Array.isArray(payload.skills) ? payload.skills : []
  const yearsExperience = Number(payload.yearsExperience)
  const preferredRoles = Array.isArray(payload.preferredRoles) ? payload.preferredRoles : []

  if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (skills.length === 0) {
    errors.skills = 'Add at least one skill.'
  }

  if (!Number.isInteger(yearsExperience) || yearsExperience < 0 || yearsExperience > 50) {
    errors.yearsExperience = 'Years of experience must be a whole number between 0 and 50.'
  }

  if (preferredRoles.length === 0) {
    errors.preferredRoles = 'Add at least one preferred role.'
  }

  return errors
}

async function readCandidates() {
  const raw = await fs.readFile(CANDIDATES_FILE, 'utf8')
  return JSON.parse(raw)
}

function buildCandidatePayload(payload, nextId) {
  return {
    id: nextId,
    userId: null,
    fullName: String(payload.fullName || '').trim(),
    skills: payload.skills || [],
    yearsExperience: Number(payload.yearsExperience),
    preferredRoles: payload.preferredRoles || [],
    disabilityCategory: null,
    disabilitySubType: null,
    abilityVectorId: null,
    profileComplete: 30,
    bio: '',
    location: '',
    remote: true,
    appliedJobs: [],
  }
}

async function writeCandidates(candidates) {
  const payload = JSON.stringify(candidates, null, 2)
  await fs.writeFile(CANDIDATES_FILE, payload, 'utf8')
}

async function createCandidate(req, res) {
  const errors = validateCandidate(req.body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors })
  }

  try {
    const candidates = await readCandidates()
    const nextId = `c${String(candidates.length + 1).padStart(3, '0')}`
    const newCandidate = buildCandidatePayload(req.body, nextId)

    candidates.push(newCandidate)
    await writeCandidates(candidates)

    return res.status(201).json(newCandidate)
  } catch (error) {
    console.error('Failed to save onboarding candidate:', error)
    return res.status(500).json({ message: 'Unable to save candidate at this time.' })
  }
}

module.exports = { createCandidate }
