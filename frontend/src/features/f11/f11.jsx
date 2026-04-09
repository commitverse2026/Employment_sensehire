import React, { useState } from 'react';
import './f11.css';

const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export default function F11() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [userState, setUserState] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user.role !== 'candidate') {
          setError('Invalid credentials');
          return;
        }
        setUserState(data);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (!userState) {
    return (
      <div className="login-container">
        <h2>Candidate Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  const { candidate, jobs, abilityVectors, jobVectors } = userState;
  
  // Calculate ranked match
  const cVecObj = abilityVectors.find(av => av.candidateId === candidate.id);
  const matches = jobs.map(job => {
    const jVecObj = jobVectors.find(jv => jv.jobId === job.id);
    let score = 0;
    if (cVecObj && jVecObj) {
      score = cosineSimilarity(cVecObj.vector, jVecObj.vector);
    }
    return { ...job, score, scorePercent: Math.round(score * 100) };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = matches[0];

  const getTier = (score) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Good';
    if (score >= 0.7) return 'Possible';
    return 'Unlikely';
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Welcome back, {candidate.fullName}</h2>
        <button onClick={() => setUserState(null)}>Logout</button>
      </header>
      
      <section className="profile-completeness">
        <h3>Your profile is {candidate.profileComplete}% complete</h3>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${candidate.profileComplete}%`,
              backgroundColor: candidate.profileComplete >= 80 ? '#10b981' : candidate.profileComplete >= 50 ? '#f59e0b' : '#ef4444'
            }}>
          </div>
        </div>
      </section>

      {bestMatch && (
        <section className="best-fit-card">
          <h3>Best Fit Hero Card</h3>
          <div className="card-content">
            <div className="card-info">
              <h4>{bestMatch.title}</h4>
              <p>{bestMatch.company}</p>
            </div>
            <div className="card-score">
              <div className="score-ring">
                {bestMatch.scorePercent}%
              </div>
            </div>
            <button>View Full Match</button>
          </div>
        </section>
      )}

      <section className="ranked-jobs">
        <h3>All Job Matches</h3>
        <div className="job-list">
          {matches.map(job => (
            <div key={job.id} className="job-row">
              <div className="job-info">
                <h4>{job.title}</h4>
                <p>{job.company}</p>
              </div>
              <div className="job-stats">
                <span className="job-score">{job.scorePercent}%</span>
                <span className="job-tier badge">{getTier(job.score)}</span>
                <button>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}