const fs = require('fs').promises
const path = require('path')

const DATA_FILE = path.join(__dirname, '../data/candidates.json')

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean)
  }

  if (typeof skills === 'string') {
    return skills
      .split(/[,;]+|\band\b/i)
      .map((skill) => String(skill).trim())
      .filter(Boolean)
  }

  return []
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, '[]', 'utf8')
  }
}

async function loadCandidates() {
  await ensureDataFile()
  const content = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(content || '[]')
}

async function saveCandidates(candidates) {
  await fs.writeFile(DATA_FILE, JSON.stringify(candidates, null, 2), 'utf8')
}

function buildProfile(profile) {
  const skills = normalizeSkills(profile.skills)

  return {
    fullName: String(profile.fullName || '').trim(),
    bio: String(profile.bio || '').trim(),
    location: String(profile.location || '').trim(),
    yearsExperience: Number(profile.yearsExperience) || 0,
    skills,
  }
}

async function saveProfile(profile) {
  const data = buildProfile(profile)

  if (!data.fullName) {
    throw new Error('fullName is required')
  }

  if (!data.bio) {
    throw new Error('bio is required')
  }

  if (!data.location) {
    throw new Error('location is required')
  }

  const candidates = await loadCandidates()
  const existingCandidate = candidates.find((candidate) => {
    if (profile.id && candidate.id === profile.id) return true
    if (profile.userId && candidate.userId === profile.userId) return true
    return false
  })

  if (existingCandidate) {
    existingCandidate.fullName = data.fullName
    existingCandidate.bio = data.bio
    existingCandidate.location = data.location
    existingCandidate.yearsExperience = data.yearsExperience
    existingCandidate.skills = data.skills.length ? data.skills : existingCandidate.skills
    existingCandidate.profileComplete = Math.min(100, existingCandidate.profileComplete ? existingCandidate.profileComplete + 10 : 90)
    await saveCandidates(candidates)
    return existingCandidate
  }

  const newId = `c${String(Date.now()).slice(-6)}`
  const newUserId = profile.userId || `u${String(Date.now()).slice(-6)}`
  const newCandidate = {
    id: newId,
    userId: newUserId,
    fullName: data.fullName,
    skills: data.skills,
    yearsExperience: data.yearsExperience,
    preferredRoles: [],
    disabilityCategory: profile.disabilityCategory || 'Unknown',
    disabilitySubType: profile.disabilitySubType || 'Unknown',
    abilityVectorId: profile.abilityVectorId || 'av-unknown',
    profileComplete: 85,
    bio: data.bio,
    location: data.location,
    remote: profile.remote || false,
    appliedJobs: profile.appliedJobs || [],
  }

  candidates.push(newCandidate)
  await saveCandidates(candidates)
  return newCandidate
}

module.exports = {
  saveProfile,
}
