import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './f11.css'

const SESSION_KEY = 'f11_candidate_id'

const DIMENSIONS = [
  { key: 'visual', label: 'Visual Processing' },
  { key: 'auditory', label: 'Auditory Comfort' },
  { key: 'fineMotor', label: 'Fine Motor Demand' },
  { key: 'cognitiveLoad', label: 'Cognitive Load' },
  { key: 'verbalComm', label: 'Verbal Communication' },
]

const TEST_CREDENTIALS = [
  { username: 'priya.mehta', password: 'priya123', name: 'Priya Mehta' },
  { username: 'arjun.sharma', password: 'arjun123', name: 'Arjun Sharma' },
  { username: 'mei.lin', password: 'mei123', name: 'Mei Lin' },
  { username: 'tomas.rivera', password: 'tomas123', name: 'Tomas Rivera' },
]

function cosineSimilarity(vectorA = [], vectorB = []) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB) || !vectorA.length || !vectorB.length) {
    return 0
  }

  const length = Math.min(vectorA.length, vectorB.length)
  let dot = 0
  let magA = 0
  let magB = 0

  for (let index = 0; index < length; index += 1) {
    const a = Number(vectorA[index]) || 0
    const b = Number(vectorB[index]) || 0
    dot += a * b
    magA += a * a
    magB += b * b
  }

  if (!magA || !magB) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

function getTier(score) {
  if (score >= 85) return { label: 'Excellent Fit', className: 'excellent' }
  if (score >= 70) return { label: 'Strong Fit', className: 'strong' }
  if (score >= 50) return { label: 'Potential Fit', className: 'potential' }
  return { label: 'Low Fit', className: 'low' }
}

function getProfileColorClass(percent) {
  if (percent >= 80) return 'high'
  if (percent >= 50) return 'medium'
  return 'low'
}

function buildGapCards(candidateVector = [], jobVector = [], reasoning = {}) {
  return DIMENSIONS.map((dimension, index) => {
    const candidateScore = Number(candidateVector[index]) || 0
    const jobScore = Number(jobVector[index]) || 0
    const delta = candidateScore - jobScore
    const status = delta >= 0 ? 'Strength' : 'Gap'

    return {
      key: dimension.key,
      title: dimension.label,
      candidateScore,
      jobScore,
      delta,
      status,
      description: reasoning[dimension.key] || 'No additional notes available for this dimension.',
    }
  })
}

async function parseApiResponse(response) {
  const raw = await response.text()
  if (!raw) return {}

  try {
    return JSON.parse(raw)
  } catch {
    return {
      error: raw.slice(0, 220),
    }
  }
}

function ScoreRing({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
  return (
    <div className="f11-score-ring" style={{ '--score': `${safeScore * 3.6}deg` }}>
      <div className="f11-score-inner">
        <strong>{safeScore}%</strong>
        <span>Match</span>
      </div>
    </div>
  )
}

export default function F11() {
  const location = useLocation()
  const navigate = useNavigate()
  const { jobId } = useParams()

  const [candidateId, setCandidateId] = useState(() => localStorage.getItem(SESSION_KEY) || '')
  const [candidate, setCandidate] = useState(null)
  const [jobs, setJobs] = useState([])
  const [abilityVectors, setAbilityVectors] = useState([])
  const [jobVectors, setJobVectors] = useState([])

  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [dataError, setDataError] = useState('')

  const pathname = location.pathname
  const isLoginPage = pathname === '/candidate/login' || pathname === '/candidate' || pathname === '/f11'
  const isDashboardPage = pathname === '/candidate/dashboard'
  const isMatchPage = pathname.startsWith('/match/')

  useEffect(() => {
    if (pathname === '/candidate') {
      navigate(candidateId ? '/candidate/dashboard' : '/candidate/login', { replace: true })
      return
    }

    if (pathname === '/f11') {
      navigate('/candidate/login', { replace: true })
      return
    }

    if ((isDashboardPage || isMatchPage) && !candidateId) {
      navigate('/candidate/login', { replace: true })
      return
    }

    if (pathname === '/candidate/login' && candidateId) {
      navigate('/candidate/dashboard', { replace: true })
    }
  }, [candidateId, isDashboardPage, isMatchPage, navigate, pathname])

  useEffect(() => {
    if (!candidateId) {
      setCandidate(null)
      setJobs([])
      setAbilityVectors([])
      setJobVectors([])
      return
    }

    let active = true

    const fetchCandidateData = async () => {
      setIsLoading(true)
      setDataError('')

      try {
        const response = await fetch(`/api/candidate/${candidateId}`)
        const payload = await parseApiResponse(response)

        if (!response.ok) {
          throw new Error(payload.error || `Unable to fetch candidate data (${response.status})`)
        }

        if (!active) return

        setCandidate(payload.candidate || null)
        setJobs(Array.isArray(payload.jobs) ? payload.jobs : [])
        setAbilityVectors(Array.isArray(payload.abilityVectors) ? payload.abilityVectors : [])
        setJobVectors(Array.isArray(payload.jobVectors) ? payload.jobVectors : [])
      } catch (error) {
        if (!active) return
        setDataError(error.message || 'Unable to load dashboard data')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchCandidateData()

    return () => {
      active = false
    }
  }, [candidateId])

  const candidateVectorRecord = useMemo(() => {
    if (!candidate) return null
    return abilityVectors.find((item) => item.id === candidate.abilityVectorId || item.candidateId === candidate.id) || null
  }, [abilityVectors, candidate])

  const rankedJobs = useMemo(() => {
    if (!candidate || !jobs.length) return []

    const candidateVector = candidateVectorRecord?.vector || []

    return jobs
      .map((job) => {
        const vectorRecord = jobVectors.find((item) => item.id === job.jobVectorId || item.jobId === job.id) || null
        const score = Math.round(cosineSimilarity(candidateVector, vectorRecord?.vector || []) * 100)

        return {
          job,
          score,
          tier: getTier(score),
          vectorRecord,
          gapCards: buildGapCards(candidateVector, vectorRecord?.vector || [], vectorRecord?.reasoning || {}),
        }
      })
      .sort((left, right) => right.score - left.score)
  }, [candidate, candidateVectorRecord, jobs, jobVectors])

  const topMatch = rankedJobs[0] || null
  const selectedMatch = rankedJobs.find((item) => item.job.id === jobId) || null

  const handleCredentialChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginError('')
    setDataError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const payload = await parseApiResponse(response)

      if (!response.ok) {
        setLoginError(payload.error || `Invalid credentials (${response.status})`)
        return
      }

      const nextCandidateId = payload?.candidate?.id || payload?.user?.candidateId || ''
      if (!nextCandidateId) {
        setLoginError('Candidate profile not found for this account.')
        return
      }

      localStorage.setItem(SESSION_KEY, nextCandidateId)
      setCandidateId(nextCandidateId)
      setCandidate(payload.candidate || null)
      setJobs(Array.isArray(payload.jobs) ? payload.jobs : [])
      setAbilityVectors(Array.isArray(payload.abilityVectors) ? payload.abilityVectors : [])
      setJobVectors(Array.isArray(payload.jobVectors) ? payload.jobVectors : [])

      navigate('/candidate/dashboard', { replace: true })
    } catch (error) {
      setLoginError(error?.message || 'Unable to login right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCandidateId('')
    setCandidate(null)
    setJobs([])
    setAbilityVectors([])
    setJobVectors([])
    setCredentials({ username: '', password: '' })
    setLoginError('')
    setDataError('')
    navigate('/candidate/login', { replace: true })
  }

  if (isLoginPage) {
    return (
      <div className="f11-page">
        <div className="f11-login-wrap">
          <section className="f11-login-card">
            <p className="f11-kicker">Feature 11</p>
            <h1>Candidate Dashboard Login</h1>
            <p className="f11-subtitle">
              Sign in with demo credentials to view profile completeness, best-fit job, and ranked accessibility matches.
            </p>

            <form className="f11-login-form" onSubmit={handleLogin}>
              <label htmlFor="f11-username">Username</label>
              <input
                id="f11-username"
                value={credentials.username}
                onChange={(event) => handleCredentialChange('username', event.target.value)}
                placeholder="e.g. priya.mehta"
              />

              <label htmlFor="f11-password">Password</label>
              <input
                id="f11-password"
                type="password"
                value={credentials.password}
                onChange={(event) => handleCredentialChange('password', event.target.value)}
                placeholder="Enter password"
              />

              {loginError && <p className="f11-inline-error">{loginError}</p>}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </section>

          <aside className="f11-credentials-card">
            <h2>Test Credentials</h2>
            <ul>
              {TEST_CREDENTIALS.map((item) => (
                <li key={item.username}>
                  <strong>{item.name}</strong>
                  <span>{item.username}</span>
                  <span>{item.password}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="f11-page">
        <div className="f11-shell f11-loading">Loading candidate dashboard...</div>
      </div>
    )
  }

  if (dataError) {
    return (
      <div className="f11-page">
        <div className="f11-shell f11-loading">
          <p>{dataError}</p>
          <button type="button" onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return null
  }

  if (isMatchPage) {
    return (
      <div className="f11-page">
        <div className="f11-shell">
          <header className="f11-topbar">
            <div>
              <p className="f11-kicker">Candidate Match Detail</p>
              <h1>{selectedMatch ? selectedMatch.job.title : 'Match Not Found'}</h1>
            </div>
            <div className="f11-actions">
              <button type="button" className="f11-ghost" onClick={() => navigate('/candidate/dashboard')}>
                Back to Dashboard
              </button>
              <button type="button" className="f11-ghost" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          {!selectedMatch && (
            <div className="f11-empty-state">No job match found for ID: {jobId}</div>
          )}

          {selectedMatch && (
            <>
              <section className="f11-detail-hero">
                <div>
                  <h2>{selectedMatch.job.company}</h2>
                  <p>{selectedMatch.job.description}</p>
                </div>
                <ScoreRing score={selectedMatch.score} />
              </section>

              <section className="f11-gap-grid">
                {selectedMatch.gapCards.map((gap) => (
                  <article key={gap.key} className="f11-gap-card">
                    <p className="f11-gap-title">{gap.title}</p>
                    <p className={`f11-gap-status ${gap.delta >= 0 ? 'strength' : 'risk'}`}>{gap.status}</p>
                    <p className="f11-gap-score">You: {gap.candidateScore} | Job: {gap.jobScore}</p>
                    <p className="f11-gap-desc">{gap.description}</p>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    )
  }

  const profilePercent = Number(candidate.profileComplete) || 0
  const profileClass = getProfileColorClass(profilePercent)

  return (
    <div className="f11-page">
      <div className="f11-shell">
        <header className="f11-topbar">
          <div>
            <p className="f11-kicker">Candidate Dashboard</p>
            <h1>Welcome, {candidate.fullName}</h1>
          </div>
          <div className="f11-actions">
            <button type="button" className="f11-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="f11-progress-card">
          <p>Your profile is {profilePercent}% complete</p>
          <div className="f11-progress-track">
            <div className={`f11-progress-fill ${profileClass}`} style={{ width: `${profilePercent}%` }} />
          </div>
        </section>

        {topMatch && (
          <section className="f11-best-fit">
            <div>
              <p className="f11-card-title">Best Fit Role</p>
              <h2>{topMatch.job.title}</h2>
              <p>{topMatch.job.company}</p>
              <button type="button" onClick={() => navigate(`/match/${topMatch.job.id}`)}>
                View Full Match
              </button>
            </div>
            <ScoreRing score={topMatch.score} />
          </section>
        )}

        <section className="f11-list-card">
          <div className="f11-list-head">
            <h3>Ranked Job Matches</h3>
            <span>{rankedJobs.length} jobs</span>
          </div>

          {rankedJobs.length === 0 && (
            <div className="f11-empty-state">No jobs available to rank right now.</div>
          )}

          {rankedJobs.length > 0 && (
            <div className="f11-job-list">
              {rankedJobs.map((match) => (
                <article key={match.job.id} className="f11-job-row">
                  <div>
                    <h4>{match.job.title}</h4>
                    <p>{match.job.company}</p>
                  </div>

                  <div className="f11-job-meta">
                    <strong>{match.score}%</strong>
                    <span className={`f11-tier ${match.tier.className}`}>{match.tier.label}</span>
                  </div>

                  <button type="button" className="f11-detail-btn" onClick={() => navigate(`/match/${match.job.id}`)}>
                    View Details
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
