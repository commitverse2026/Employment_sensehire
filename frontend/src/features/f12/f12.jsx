import React, { useState, useEffect } from 'react';
import './f12.css';

export default function F12() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [userState, setUserState] = useState(null);
  
  const [selectedJob, setSelectedJob] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState('score'); // 'score' or 'name'

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
        if (data.user.role !== 'employer') {
          setError('Access denied');
          return;
        }
        setUserState(data);
        if (data.jobs && data.jobs.length > 0) {
          setSelectedJob(data.jobs[0].id);
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  useEffect(() => {
    if (userState && selectedJob) {
      fetch(`/api/employer/applicants/${selectedJob}`)
        .then(res => res.json())
        .then(data => {
          setApplicants(data);
        })
        .catch(err => console.error(err));
    }
  }, [userState, selectedJob]);

  if (!userState) {
    return (
      <div className="login-container">
        <h2>Employer Login</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  const { jobs } = userState;

  const sortedApplicants = [...applicants].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      return a.candidate.fullName.localeCompare(b.candidate.fullName);
    }
  });

  return (
    <div className="employer-dashboard">
      <header>
        <h2>Employer Dashboard</h2>
        <button className="logout-btn" onClick={() => setUserState(null)}>Logout</button>
      </header>

      <div className="controls-bar">
        <div className="job-selector">
          <label>Select Job: </label>
          <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        
        <div className="sort-toggle">
          <label>Sort by: </label>
          <button 
            className={sortBy === 'score' ? 'active' : ''} 
            onClick={() => setSortBy('score')}>
            Score
          </button>
          <button 
            className={sortBy === 'name' ? 'active' : ''} 
            onClick={() => setSortBy('name')}>
            Name A-Z
          </button>
        </div>
      </div>

      <div className="applicant-list">
        {sortedApplicants.length === 0 ? (
          <p className="no-applicants">No applicants yet for this position.</p>
        ) : (
          sortedApplicants.map(app => (
            <div key={app.candidate.id} className="applicant-card">
              <div className="app-header">
                <div>
                  <h3>{app.candidate.fullName}</h3>
                  <p className="subtitle">{app.candidate.preferredRoles.join(', ')} • {app.candidate.location}</p>
                </div>
                <div className="score-badge-container">
                  <span className={`tier-badge tier-${app.tier.toLowerCase()}`}>{app.tier}</span>
                  <div className="score-ring">{app.scorePercent}%</div>
                </div>
              </div>
              <div className="app-gap">
                <strong>Gap Analysis: </strong> 
                <span>{app.gapSummary}</span>
              </div>
              <div className="app-actions">
                <button>View Full Profile</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}