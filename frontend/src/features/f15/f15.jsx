import { useEffect, useRef, useState } from 'react'
import './f15.css'

const INITIAL_FORM = {
  fullName: '',
  bio: '',
  location: '',
  yearsExperience: '',
}

export default function F15() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [listeningField, setListeningField] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [unsupported, setUnsupported] = useState(false)
  const [permissionError, setPermissionError] = useState('')
  const [hint, setHint] = useState('Tap the mic to start, tap again to stop')

  const recognitionRef = useRef(null)
  const transcriptRef = useRef('')
  const chunkTranscriptRef = useRef('')
  const shouldKeepListeningRef = useRef(false)
  const manualStopRef = useRef(false)
  const currentFieldRef = useRef('')
  const fieldBaseValueRef = useRef('')

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setUnsupported(true)
    }

    return () => {
      stopListening()
    }
  }, [])

  const getSpeechRecognition = () => {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null
  }

  const normalizeYearsExperience = (value = '') => {
    const source = String(value).toLowerCase().trim()
    if (!source) return ''

    const digitMatch = source.match(/\d+/g)
    if (digitMatch?.length) {
      return digitMatch.join('')
    }

    const numberWords = {
      zero: 0,
      one: 1,
      two: 2,
      to: 2,
      too: 2,
      three: 3,
      four: 4,
      for: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      ate: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      thirteen: 13,
      fourteen: 14,
      fifteen: 15,
      sixteen: 16,
      seventeen: 17,
      eighteen: 18,
      nineteen: 19,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50,
      sixty: 60,
      seventy: 70,
      eighty: 80,
      ninety: 90,
      hundred: 100,
      thousand: 1000,
    }

    const ignoredWords = new Set(['year', 'years', 'experience', 'about', 'around', 'nearly', 'approximately', 'and'])
    const tokens = source.split(/[\s-]+/).filter(Boolean)
    let total = 0
    let current = 0
    let foundAny = false

    tokens.forEach((token) => {
      if (ignoredWords.has(token)) return
      const wordValue = numberWords[token]
      if (!Object.prototype.hasOwnProperty.call(numberWords, token)) return

      if (wordValue === 100) {
        current = current === 0 ? 100 : current * 100
        foundAny = true
        return
      }

      if (wordValue === 1000) {
        total += (current === 0 ? 1 : current) * 1000
        current = 0
        foundAny = true
        return
      }

      current += wordValue
      foundAny = true
    })

    return foundAny ? String(total + current) : ''
  }

  const createRecognition = () => {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    const isActiveRecognition = () => recognitionRef.current === recognition

    recognition.interimResults = true
    recognition.continuous = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      if (!isActiveRecognition()) return

      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')
        .trim()

      chunkTranscriptRef.current = transcript
      const rollingTranscript = [transcriptRef.current, chunkTranscriptRef.current]
        .filter(Boolean)
        .join(' ')
        .trim()

      const combined = [fieldBaseValueRef.current, rollingTranscript]
        .filter(Boolean)
        .join(fieldBaseValueRef.current ? ' ' : '')

      if (currentFieldRef.current === 'skills') {
        setSkillInput(combined)
      } else if (currentFieldRef.current === 'yearsExperience') {
        const normalizedYears = normalizeYearsExperience(rollingTranscript)
        if (normalizedYears !== '') {
          setForm((prev) => ({ ...prev, yearsExperience: normalizedYears }))
        }
      } else if (currentFieldRef.current) {
        setForm((prev) => ({ ...prev, [currentFieldRef.current]: combined }))
      }

      setVoiceMessage(rollingTranscript || 'Listening...')
      setHint('Listening... tap again to stop')
    }

    recognition.onerror = (event) => {
      if (!isActiveRecognition()) return

      const code = event?.error
      const detail = event?.message || ''
      console.warn('Speech recognition error:', code, detail)

      if (code === 'not-allowed' || code === 'permission-denied') {
        setPermissionError('Microphone access was denied. Please enable it in your browser settings.')
      } else if (code === 'aborted') {
        return
      } else if (code === 'no-speech') {
        if (shouldKeepListeningRef.current) {
          setHint('Still listening... speak and tap stop when done')
          return
        }
        setError('No speech detected. Try speaking clearly and retry.')
      } else if (code === 'audio-capture') {
        setError('No microphone was found. Check your input device and retry.')
      } else if (code === 'network') {
        setError('Network issue starting speech service. Check your connection and retry.')
      } else if (code === 'service-not-allowed') {
        setError('Speech service is blocked. Ensure you are on https:// or http://localhost and allow mic access.')
      } else if (code === 'language-not-supported') {
        setError('Selected language is not supported by speech recognition.')
      } else {
        setError(`Voice capture failed (${code || 'unknown'}). Please try again.`)
      }

      stopListening()
    }

    recognition.onend = () => {
      if (!isActiveRecognition()) return

      const activeField = currentFieldRef.current
      const chunkText = chunkTranscriptRef.current.trim()

      if (shouldKeepListeningRef.current && !manualStopRef.current) {
        if (chunkText) {
          transcriptRef.current = [transcriptRef.current, chunkText].filter(Boolean).join(' ').trim()
          chunkTranscriptRef.current = ''
        }

        try {
          recognition.start()
          setVoiceMessage(transcriptRef.current || 'Listening...')
          return
        } catch (err) {
          console.warn('Speech recognition restart failed:', err)
          setError('Voice capture paused unexpectedly. Please tap Start Listening again.')
        }
      }

      const finalTranscript = [transcriptRef.current, chunkText].filter(Boolean).join(' ').trim()
      if (finalTranscript) {
        commitTranscript(activeField, finalTranscript, fieldBaseValueRef.current)
      } else if (activeField) {
        setError('No speech detected')
      }

      setIsListening(false)
      setListeningField('')
      setVoiceMessage('')
      recognitionRef.current = null
      currentFieldRef.current = ''
      fieldBaseValueRef.current = ''
      chunkTranscriptRef.current = ''
      transcriptRef.current = ''
      shouldKeepListeningRef.current = false
      manualStopRef.current = false
      setHint('Tap the mic to start, tap again to stop')
    }

    return recognition
  }

  const startListening = (field) => {
    if (unsupported) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge on https:// or http://localhost.')
      return
    }

    if (isListening && listeningField === field) {
      stopListening()
      return
    }

    stopListening()
    setError('')
    setSuccess('')
    setPermissionError('')

    const recognition = createRecognition()
    if (!recognition) {
      setUnsupported(true)
      return
    }

    currentFieldRef.current = field
    if (field === 'skills') {
      fieldBaseValueRef.current = skillInput
    } else if (field === 'yearsExperience') {
      fieldBaseValueRef.current = ''
    } else {
      fieldBaseValueRef.current = form[field] || ''
    }

    transcriptRef.current = ''
    chunkTranscriptRef.current = ''
    shouldKeepListeningRef.current = true
    manualStopRef.current = false
    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (err) {
      console.error('Speech recognition start failed:', err)
      setError('Voice capture could not start. Ensure the tab has microphone access and try again.')
      recognitionRef.current = null
      currentFieldRef.current = ''
      fieldBaseValueRef.current = ''
      shouldKeepListeningRef.current = false
      return
    }

    setListeningField(field)
    setIsListening(true)
    setVoiceMessage('Listening...')
    setHint('Listening... tap again to stop')
  }

  const stopListening = () => {
    shouldKeepListeningRef.current = false
    manualStopRef.current = true

    const recognition = recognitionRef.current
    if (recognition) {
      try {
        recognition.stop()
      } catch (err) {
        console.warn('Speech recognition stop failed:', err)
      }
    }
  }

  const commitTranscript = (field, transcript, base = '') => {
    const text = transcript.trim()
    if (!text) {
      setError('No speech detected')
      return
    }

    const combined = [base || fieldBaseValueRef.current, text]
      .filter(Boolean)
      .join(base || fieldBaseValueRef.current ? ' ' : '')
      .trim()

    if (field === 'skills') {
      const newSkills = combined
        .split(/[,;]+|\band\b/i)
        .map((item) => item.trim())
        .filter(Boolean)

      setSkills((prev) => [...prev, ...newSkills])
      setSuccess('Skills added from voice input.')
      setSkillInput('')
    } else if (field === 'yearsExperience') {
      const normalizedYears = normalizeYearsExperience(transcript)
      if (!normalizedYears) {
        setError('Could not detect a valid number for years of experience.')
        return
      }
      setForm((prev) => ({ ...prev, yearsExperience: normalizedYears }))
      setSuccess('Years of experience updated from voice input.')
    } else {
      setForm((prev) => ({ ...prev, [field]: combined }))
      setSuccess('Voice input added to your profile field.')
    }
  }

  const handleInput = (field, value) => {
    if (field === 'yearsExperience') {
      const digitsOnly = value.replace(/[^\d]/g, '')
      setForm((prev) => ({ ...prev, yearsExperience: digitsOnly }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillAdd = () => {
    const skill = skillInput.trim()
    if (!skill) return
    setSkills((prev) => [...prev, skill])
    setSkillInput('')
    setSuccess('Skill added.')
  }

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== index))
  }

  const resetFormState = () => {
    stopListening()
    setForm(INITIAL_FORM)
    setSkills([])
    setSkillInput('')
    setListeningField('')
    setIsListening(false)
    setVoiceMessage('')
    setError('')
    setSuccess('')
    setPermissionError('')
    setHint('Tap the mic to start, tap again to stop')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setHint('Tap the mic to start, tap again to stop')

    if (!form.fullName || !form.bio || !form.location || !form.yearsExperience) {
      setError('Please fill all fields before saving your profile.')
      return
    }

    try {
      const yearsNumericValue = form.yearsExperience === '' ? '' : Number(form.yearsExperience)
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          bio: form.bio,
          location: form.location,
          yearsExperience: Number.isNaN(yearsNumericValue) ? form.yearsExperience : yearsNumericValue,
          skills,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error || 'Failed to save profile. Please try again.')
        return
      }

      resetFormState()
      setShowThankYou(true)
    } catch (err) {
      setError('Unable to save profile. Please try again later.')
      console.error(err)
    }
  }

  const supportMessage = unsupported
    ? 'Voice input requires Chrome or Edge.'
    : 'Tap mic to start, tap again to stop.'

  const micHandlers = (field) => ({
    onClick: () => startListening(field),
    onKeyDown: (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        startListening(field)
      }
    },
  })

  if (showThankYou) {
    return (
      <div className="f15-page">
        <div className="f15-shell f15-thankyou-shell">
          <div className="f15-thankyou-card">
            <p className="f15-tag">PROFILE SUBMITTED</p>
            <h1>Thank you for completing your profile.</h1>
            <p className="f15-subtitle">
              Your details have been saved successfully. You can continue to explore opportunities or create another profile.
            </p>
            <button
              type="button"
              className="f15-submit-button f15-thankyou-button"
              onClick={() => setShowThankYou(false)}
            >
              Create Another Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="f15-page">
      <div className="f15-shell">
        <header className="f15-header">
          <div>
            <p className="f15-tag">FEATURE 15</p>
            <h1>Speech-to-Text Profile Builder</h1>
            <p className="f15-subtitle">
              Fill out your profile by voice. Tap a mic button to start, speak naturally, then tap again to commit.
            </p>
          </div>
          <div className="f15-hint-pill" role="status" aria-live="polite">
            <span className={`dot ${isListening ? 'live' : ''}`} aria-hidden="true" />
            {isListening ? `Listening to ${listeningField}... tap to stop` : hint}
          </div>
        </header>

        <form className="f15-form" onSubmit={handleSubmit}>
          {unsupported && (
            <div className="f15-banner f15-banner-warning">{supportMessage}</div>
          )}

          {permissionError && (
            <div className="f15-banner f15-banner-error">{permissionError}</div>
          )}

          {error && <div className="f15-banner f15-banner-error">{error}</div>}
          {success && <div className="f15-banner f15-banner-success">{success}</div>}

          <section className="f15-group">
            <label className="f15-label" htmlFor="fullName">
              Full Name
            </label>
            <div className="f15-row">
              <input
                id="fullName"
                value={form.fullName}
                onChange={(e) => handleInput('fullName', e.target.value)}
                placeholder="Your name here..."
                className="f15-input"
              />
              <button
                type="button"
                className={`f15-mic-button ${listeningField === 'fullName' ? 'listening' : ''}`}
                {...micHandlers('fullName')}
              >
                <span className="icon mic-icon" aria-hidden="true" />
                {listeningField === 'fullName' ? 'Stop & Commit' : 'Start Listening'}
              </button>
            </div>
          </section>

          <section className="f15-group">
            <label className="f15-label" htmlFor="bio">
              Professional Bio
            </label>
            <div className="f15-row">
              <textarea
                id="bio"
                rows="5"
                value={form.bio}
                onChange={(e) => handleInput('bio', e.target.value)}
                placeholder="Tell us about your experience..."
                className="f15-textarea"
              />
              <button
                type="button"
                className={`f15-mic-button ${listeningField === 'bio' ? 'listening' : ''}`}
                {...micHandlers('bio')}
              >
                <span className="icon mic-icon" aria-hidden="true" />
                {listeningField === 'bio' ? 'Stop & Commit' : 'Start Listening'}
              </button>
            </div>
          </section>

          <section className="f15-grid">
            <div className="f15-group">
              <label className="f15-label" htmlFor="location">
                Location
              </label>
              <div className="f15-row">
                <input
                  id="location"
                  value={form.location}
                  onChange={(e) => handleInput('location', e.target.value)}
                  placeholder="Your location..."
                  className="f15-input"
                />
                <button
                  type="button"
                  className={`f15-mic-button ${listeningField === 'location' ? 'listening' : ''}`}
                  {...micHandlers('location')}
                >
                  <span className="icon mic-icon" aria-hidden="true" />
                  {listeningField === 'location' ? 'Stop & Commit' : 'Start Listening'}
                </button>
              </div>
            </div>

            <div className="f15-group">
              <label className="f15-label" htmlFor="yearsExperience">
                Years of Experience
              </label>
              <div className="f15-row">
                <input
                  id="yearsExperience"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.yearsExperience}
                  onChange={(e) => handleInput('yearsExperience', e.target.value)}
                  placeholder="e.g. 5"
                  className="f15-input"
                />
                <button
                  type="button"
                  className={`f15-mic-button ${listeningField === 'yearsExperience' ? 'listening' : ''}`}
                  {...micHandlers('yearsExperience')}
                >
                  <span className="icon mic-icon" aria-hidden="true" />
                  {listeningField === 'yearsExperience' ? 'Stop & Commit' : 'Start Listening'}
                </button>
              </div>
            </div>
          </section>

          <section className="f15-group">
            <label className="f15-label" htmlFor="skills">
              Skills
            </label>
            <div className="f15-row skill-row">
              <input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill, or use voice input..."
                className="f15-input"
              />
              <button type="button" className="f15-add-button" onClick={handleSkillAdd}>
                Add
              </button>
              <button
                type="button"
                className={`f15-mic-button ${listeningField === 'skills' ? 'listening' : ''}`}
                {...micHandlers('skills')}
              >
                <span className="icon mic-icon" aria-hidden="true" />
                {listeningField === 'skills' ? 'Stop & Commit' : 'Start Listening'}
              </button>
            </div>
            <div className="f15-skill-list">
              {skills.map((skill, index) => (
                <button key={`${skill}-${index}`} type="button" className="f15-chip" onClick={() => removeSkill(index)}>
                  {skill} <span aria-hidden="true" className="chip-close">x</span>
                </button>
              ))}
            </div>
          </section>

          <section className="f15-status-row">
            <div className="f15-live-state">
              <div className={`pulse ${isListening ? 'active' : ''}`} aria-hidden="true" />
              {isListening ? `Live: ${listeningField}` : supportMessage}
            </div>
            <div className="f15-voice-preview">{voiceMessage}</div>
          </section>

          <button type="submit" className="f15-submit-button">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}
