import { useState } from 'react'
import './f01.css'

const initialForm = {
  fullName: '',
  email: '',
  skills: [],
  yearsExperience: '',
  preferredRoles: [],
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function F01() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [skillInput, setSkillInput] = useState('')
  const [roleInput, setRoleInput] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const errors = {
    fullName:
      form.fullName.trim().length < 2 ? 'Full name must be at least 2 characters.' : '',
    email: !emailRegex.test(form.email) ? 'Please enter a valid email address.' : '',
    skills: form.skills.length === 0 ? 'Add at least one skill.' : '',
    yearsExperience:
      form.yearsExperience === '' ||
      Number.isNaN(Number(form.yearsExperience)) ||
      Number(form.yearsExperience) < 0 ||
      Number(form.yearsExperience) > 50
        ? 'Years of experience must be a number between 0 and 50.'
        : '',
    preferredRoles:
      form.preferredRoles.length === 0 ? 'Add at least one preferred role.' : '',
  }

  const stepErrors = () => {
    if (step === 1) {
      return { fullName: errors.fullName, email: errors.email }
    }
    if (step === 2) {
      return { skills: errors.skills, yearsExperience: errors.yearsExperience }
    }
    return { preferredRoles: errors.preferredRoles }
  }

  const canContinue = Object.values(stepErrors()).every((value) => !value)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = (field, value, clearFn) => {
    const trimmed = String(value).trim().replace(/,$/, '')
    if (!trimmed) return
    if (form[field].includes(trimmed)) {
      clearFn('')
      return
    }

    setForm((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }))
    clearFn('')
  }

  const handleTagKeyDown = (event, field, clearFn) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag(field, event.target.value, clearFn)
    }
  }

  const removeTag = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }))
  }

  const handleNext = () => {
    if (!canContinue) return
    setStep((current) => Math.min(3, current + 1))
  }

  const handleBack = () => {
    setStep((current) => Math.max(1, current - 1))
  }

  const handleSubmit = async () => {
    if (!canContinue) return
    setStatus({ state: 'submitting', message: '' })

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          skills: form.skills,
          yearsExperience: Number(form.yearsExperience),
          preferredRoles: form.preferredRoles,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        const message = errorBody.message || 'Unable to submit onboarding form.'
        setStatus({ state: 'error', message })
        return
      }

      setStatus({ state: 'success', message: 'Your profile was created successfully!' })
    } catch (error) {
      setStatus({ state: 'error', message: 'Network error. Please try again.' })
    }
  }

  if (status.state === 'success') {
    return (
      <div className="f01-shell">
        <div className="f01-card f01-success-card">
          <h1>Onboarding complete</h1>
          <p>Your candidate profile has been saved successfully.</p>
          <p className="f01-success-note">Check the backend data file for the new entry.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="f01-shell">
      <div className="f01-card">
        <div className="f01-header">
          <div>
            <span className="f01-step-label">Step {step} of 3</span>
            <h1>Candidate Onboarding</h1>
          </div>
          <div className="f01-progress">
            {[1, 2, 3].map((item) => (
              <span key={item} className={`f01-dot ${step === item ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="f01-step">
            <label>
              Full name
              <input
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="e.g. Shreya Patel"
              />
              {errors.fullName && <p className="f01-error">{errors.fullName}</p>}
            </label>

            <label>
              Email address
              <input
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="e.g. shreya@example.com"
                type="email"
              />
              {errors.email && <p className="f01-error">{errors.email}</p>}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="f01-step">
            <label>
              Skills
              <div className="f01-tag-input">
                <div className="f01-tags">
                  {form.skills.map((skill) => (
                    <span key={skill} className="f01-tag">
                      {skill}
                      <button type="button" onClick={() => removeTag('skills', skill)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => handleTagKeyDown(event, 'skills', setSkillInput)}
                  onBlur={() => addTag('skills', skillInput, setSkillInput)}
                  placeholder="Type a skill and press Enter"
                />
              </div>
              {errors.skills && <p className="f01-error">{errors.skills}</p>}
            </label>

            <label>
              Years of experience
              <input
                type="number"
                min="0"
                max="50"
                value={form.yearsExperience}
                onChange={(event) => updateField('yearsExperience', event.target.value)}
                placeholder="0"
              />
              {errors.yearsExperience && <p className="f01-error">{errors.yearsExperience}</p>}
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="f01-step">
            <label>
              Preferred job roles
              <div className="f01-tag-input">
                <div className="f01-tags">
                  {form.preferredRoles.map((role) => (
                    <span key={role} className="f01-tag">
                      {role}
                      <button type="button" onClick={() => removeTag('preferredRoles', role)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={roleInput}
                  onChange={(event) => setRoleInput(event.target.value)}
                  onKeyDown={(event) => handleTagKeyDown(event, 'preferredRoles', setRoleInput)}
                  onBlur={() => addTag('preferredRoles', roleInput, setRoleInput)}
                  placeholder="Type a role and press Enter"
                />
              </div>
              {errors.preferredRoles && <p className="f01-error">{errors.preferredRoles}</p>}
            </label>

            <p className="f01-hint">
              Example: Frontend Developer, Accessibility Engineer, Product Designer
            </p>
          </div>
        )}

        {status.state === 'error' && <p className="f01-submit-error">{status.message}</p>}

        <div className="f01-actions">
          <button type="button" className="f01-secondary" onClick={handleBack} disabled={step === 1 || status.state === 'submitting'}>
            Back
          </button>
          {step < 3 ? (
            <button type="button" className="f01-primary" onClick={handleNext} disabled={!canContinue || status.state === 'submitting'}>
              Next
            </button>
          ) : (
            <button type="button" className="f01-primary" onClick={handleSubmit} disabled={!canContinue || status.state === 'submitting'}>
              {status.state === 'submitting' ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
