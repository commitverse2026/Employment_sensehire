import "./f11.css";
import { useState, useEffect } from "react";

// Cosine similarity calculation
const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return Math.min(1, Math.max(0, dotProduct / (magA * magB)));
};

// Score ring component
const ScoreRing = ({ score, label = "Match Score" }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score);
  const percentage = Math.round(score * 100);

  let color = "#ef4444";
  if (score >= 0.8) color = "#22c55e";
  else if (score >= 0.6) color = "#f59e0b";

  return (
    <div className="f11-score-ring-container">
      <svg width="120" height="120" className="f11-score-ring">
        <circle cx="60" cy="60" r={radius} className="f11-score-bg" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="f11-score-fill"
          style={{
            stroke: color,
            strokeDashoffset,
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="f11-score-text">
        <div className="f11-score-percent">{percentage}%</div>
        <div className="f11-score-label">{label}</div>
      </div>
    </div>
  );
};

// Login screen
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.candidate) {
        onLogin(data.candidate, data.user);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="f11-login-container">
      <div className="f11-login-card">
        <h1 className="f11-login-title">candidate login</h1>
        <p className="f11-login-subtitle">
          Welcome back. Login with your credentials.
        </p>

        <form onSubmit={handleLogin} className="f11-login-form">
          <div className="f11-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g., priya.mehta"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="f11-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="f11-error-message">{error}</div>}

          <button type="submit" disabled={loading} className="f11-submit-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="f11-demo-hint">
          <p className="f11-demo-title">Demo credentials:</p>
          <ul>
            <li>priya.mehta / priya123</li>
            <li>arjun.sharma / arjun123</li>
            <li>mei.lin / mei123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Dashboard screen
const Dashboard = ({ candidate, user, jobs, vectors, onLogout }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);

  useEffect(() => {
    // Calculate compatibility scores for all jobs
    if (candidate?.abilityVectorId && vectors && jobs) {
      const candidateVector = vectors.find(
        (v) => v.id === candidate.abilityVectorId,
      );
      if (candidateVector) {
        const matches = jobs.map((job) => {
          const jobVector = vectors.find((v) => v.id === job.jobVectorId);
          const score = jobVector
            ? cosineSimilarity(candidateVector.vector, jobVector.vector)
            : 0;
          return {
            ...job,
            score,
            tier: score >= 0.8 ? "Excellent" : score >= 0.6 ? "Good" : "Fair",
            abilityVector: candidateVector,
            jobVector,
          };
        });
        matches.sort((a, b) => b.score - a.score);
        setJobMatches(matches);
      }
    }
  }, [candidate, vectors, jobs]);

  const bestFit = jobMatches[0];
  const profileColor =
    candidate.profileComplete >= 80
      ? "green"
      : candidate.profileComplete >= 50
        ? "amber"
        : "red";

  return (
    <div className="f11-dashboard-container">
      <div className="f11-dashboard-header">
        <div className="f11-header-content">
          <h1>Welcome, {candidate.fullName}!</h1>
          <p className="f11-header-subtitle">Your personalized job dashboard</p>
        </div>
        <button onClick={onLogout} className="f11-logout-btn">
          Logout
        </button>
      </div>

      {!selectedJob ? (
        <>
          {/* Profile Completeness Meter */}
          <div className="f11-profile-card">
            <h3>Profile Completeness</h3>
            <div className="f11-progress-container">
              <div className="f11-progress-bar">
                <div
                  className={`f11-progress-fill f11-progress-${profileColor}`}
                  style={{ width: `${candidate.profileComplete}%` }}
                />
              </div>
              <span className="f11-progress-text">
                {candidate.profileComplete}% complete
              </span>
            </div>
          </div>

          {/* Best Fit Hero Card */}
          {bestFit && (
            <div className="f11-hero-card">
              <div className="f11-hero-left">
                <div className="f11-hero-badge">⭐ YOUR BEST FIT</div>
                <h2>{bestFit.title}</h2>
                <p className="f11-hero-company">{bestFit.company}</p>
                <p className="f11-hero-desc">{bestFit.description}</p>
                <button
                  onClick={() => setSelectedJob(bestFit)}
                  className="f11-hero-btn"
                >
                  View Full Match →
                </button>
              </div>
              <div className="f11-hero-right">
                <ScoreRing score={bestFit.score} />
              </div>
            </div>
          )}

          {/* Ranked Job List */}
          <div className="f11-jobs-section">
            <h2>Recommended Jobs</h2>
            <div className="f11-jobs-list">
              {jobMatches.map((job) => (
                <div key={job.id} className="f11-job-card">
                  <div className="f11-job-info">
                    <h3>{job.title}</h3>
                    <p className="f11-job-company">{job.company}</p>
                    <div className="f11-job-meta">
                      <span className="f11-job-location">
                        {job.remote ? "🌐 Remote" : "📍 " + job.location}
                      </span>
                      <span
                        className={`f11-job-tier f11-tier-${job.tier.toLowerCase()}`}
                      >
                        {job.tier}
                      </span>
                    </div>
                  </div>
                  <div className="f11-job-score">
                    <ScoreRing score={job.score} label="Score" />
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="f11-job-details-btn"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Job Details View */
        <MatchDetail
          job={selectedJob}
          candidate={candidate}
          onBack={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

// Match detail view
const MatchDetail = ({ job, candidate, onBack }) => {
  const dimensions = [
    {
      name: "Visual",
      key: "visual",
      icon: "👁",
      description: "Visual perception and reading ability",
    },
    {
      name: "Auditory",
      key: "auditory",
      icon: "👂",
      description: "Hearing and audio processing",
    },
    {
      name: "Fine Motor",
      key: "fineMotor",
      icon: "🖐",
      description: "Typing, clicking, precise control",
    },
    {
      name: "Cognitive Load",
      key: "cognitiveLoad",
      icon: "🧠",
      description: "Focus, multitasking, problem-solving",
    },
    {
      name: "Verbal Communication",
      key: "verbalComm",
      icon: "🗣",
      description: "Speaking, presentations, calls",
    },
  ];

  return (
    <div className="f11-match-detail">
      <button onClick={onBack} className="f11-back-btn">
        ← Back to Dashboard
      </button>

      <div className="f11-detail-header">
        <h1>{job.title}</h1>
        <p className="f11-detail-company">{job.company}</p>
      </div>

      <div className="f11-detail-content">
        <div className="f11-detail-score">
          <ScoreRing score={job.score} label="Overall Match" />
        </div>

        <div className="f11-gap-analysis">
          <h3>Compatibility Breakdown</h3>
          <div className="f11-gaps-grid">
            {dimensions.map((dim) => {
              const candidateValue =
                job.abilityVector?.dimensions[dim.key] || 0;
              const jobValue = job.jobVector?.dimensions[dim.key] || 0;
              const gap = Math.abs(candidateValue - jobValue);
              const maxGap = 5;
              const gapPercent = (gap / maxGap) * 100;

              let gapColor = "#22c55e";
              if (gap >= 2) gapColor = "#f59e0b";
              if (gap >= 3) gapColor = "#ef4444";

              return (
                <div key={dim.key} className="f11-gap-card">
                  <div className="f11-gap-header">
                    <span className="f11-gap-icon">{dim.icon}</span>
                    <h4>{dim.name}</h4>
                  </div>
                  <p className="f11-gap-description">{dim.description}</p>
                  <div className="f11-gap-comparison">
                    <div className="f11-gap-item">
                      <span className="f11-gap-label">Your ability:</span>
                      <div className="f11-gap-meter">
                        <div
                          className="f11-gap-fill"
                          style={{
                            width: `${(candidateValue / 5) * 100}%`,
                            backgroundColor: "#3b82f6",
                          }}
                        />
                      </div>
                      <span className="f11-gap-value">{candidateValue}/5</span>
                    </div>
                    <div className="f11-gap-item">
                      <span className="f11-gap-label">Job requires:</span>
                      <div className="f11-gap-meter">
                        <div
                          className="f11-gap-fill"
                          style={{
                            width: `${(jobValue / 5) * 100}%`,
                            backgroundColor: "#6b7280",
                          }}
                        />
                      </div>
                      <span className="f11-gap-value">{jobValue}/5</span>
                    </div>
                  </div>
                  {gap > 0 && (
                    <div
                      className="f11-gap-insight"
                      style={{ borderLeftColor: gapColor }}
                    >
                      <strong>Gap: {gap}</strong>
                      {gap <= 1
                        ? " — Great alignment! Minor adjustment may help."
                        : gap <= 2
                          ? " — Good fit with some accommodations needed."
                          : " — Significant gap. Discuss accommodations with employer."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main F11 component
export default function F11() {
  const [candidate, setCandidate] = useState(null);
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [vectors, setVectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load jobs and vectors on mount
    const loadData = async () => {
      try {
        const [jobsRes, vectorsRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs"),
          fetch("http://localhost:5000/api/vectors"),
        ]);

        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (vectorsRes.ok) setVectors(await vectorsRes.json());
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogin = (candidateData, userData) => {
    setCandidate(candidateData);
    setUser(userData);
  };

  const handleLogout = () => {
    setCandidate(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="f11-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return candidate ? (
    <Dashboard
      candidate={candidate}
      user={user}
      jobs={jobs}
      vectors={vectors}
      onLogout={handleLogout}
    />
  ) : (
    <LoginScreen onLogin={handleLogin} />
  );
}
