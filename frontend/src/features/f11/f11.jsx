import { useState, useEffect } from "react";
import "./f11.css";

// ─── Cosine Similarity ───────────────────────────────────────────────
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// ─── Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const pct = Math.round(score * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="f11-ring-wrap">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
      </svg>
      <span className="f11-ring-label" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─── Tier Badge ──────────────────────────────────────────────────────
function TierBadge({ score }) {
  const pct = score * 100;
  if (pct >= 80) return <span className="f11-badge f11-badge--green">Excellent</span>;
  if (pct >= 65) return <span className="f11-badge f11-badge--blue">Good</span>;
  if (pct >= 50) return <span className="f11-badge f11-badge--amber">Fair</span>;
  return <span className="f11-badge f11-badge--red">Low</span>;
}

// ─── Login Screen ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        onLogin(data.candidate);
      }
    } catch {
      setError("Server error. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="f11-login-wrap">
      <div className="f11-login-card">
        <div className="f11-login-logo">⚡</div>
        <h1 className="f11-login-title">SenseHire</h1>
        <p className="f11-login-sub">Candidate Portal</p>

        <div className="f11-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. priya.mehta"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="f11-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {error && <p className="f11-error">{error}</p>}

        <button className="f11-btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="f11-hint">Try: priya.mehta / priya123</p>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────
function Dashboard({ candidate, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [jobVectors, setJobVectors] = useState([]);
  const [abilityVector, setAbilityVector] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, jvRes, candRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs"),
          fetch("http://localhost:5000/api/job-vectors"),
          fetch(`http://localhost:5000/api/candidate/${candidate.id}`),
        ]);
        const jobsData = await jobsRes.json();
        const jvData = await jvRes.json();
        const candData = await candRes.json();

        setJobs(jobsData.filter((j) => j.jobVectorId));
        setJobVectors(jvData);
        setAbilityVector(candData.abilityVector);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [candidate.id]);

  const rankedJobs = (() => {
    if (!abilityVector) return [];
    return jobs
      .map((job) => {
        const jv = jobVectors.find((v) => v.id === job.jobVectorId);
        if (!jv) return null;
        const score = cosineSimilarity(abilityVector.vector, jv.vector);
        return { ...job, score, jv };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  })();

  const bestFit = rankedJobs[0];

  const pct = candidate.profileComplete ?? 0;
  const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  if (loading) return <div className="f11-loading">Loading dashboard...</div>;

  if (selectedJob) {
    return (
      <div className="f11-wrap">
        <div className="f11-topbar">
          <button className="f11-back-btn" onClick={() => setSelectedJob(null)}>← Back</button>
          <button className="f11-logout" onClick={onLogout}>Logout</button>
        </div>
        <div className="f11-detail-card">
          <h2 className="f11-detail-title">{selectedJob.title}</h2>
          <p className="f11-detail-company">{selectedJob.company}</p>
          <div className="f11-detail-ring">
            <ScoreRing score={selectedJob.score} />
            <div>
              <p className="f11-detail-score-label">Compatibility Score</p>
              <TierBadge score={selectedJob.score} />
            </div>
          </div>
          <p className="f11-detail-desc">{selectedJob.description}</p>
          <div className="f11-detail-skills">
            <p className="f11-section-label">Required Skills</p>
            <div className="f11-skills-wrap">
              {(selectedJob.requiredSkills || []).map((s) => (
                <span key={s} className="f11-skill-tag">{s}</span>
              ))}
            </div>
          </div>
          <div className="f11-gap-section">
            <p className="f11-section-label">Ability Alignment</p>
            {Object.keys(selectedJob.jv.dimensions).map((dim) => {
              const jobNeed = selectedJob.jv.dimensions[dim];
              const candCap = abilityVector.dimensions[dim];
              const gap = jobNeed - candCap;
              return (
                <div key={dim} className="f11-gap-row">
                  <span className="f11-gap-dim">{dim}</span>
                  <div className="f11-gap-bar-wrap">
                    <div className="f11-gap-bar" style={{ width: `${(candCap / 5) * 100}%`, background: gap > 0 ? "#ef4444" : "#22c55e" }} />
                  </div>
                  <span className={`f11-gap-tag ${gap > 0 ? "f11-gap-tag--red" : "f11-gap-tag--green"}`}>
                    {gap > 0 ? `Gap: ${gap}` : "✓"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="f11-wrap">
      <div className="f11-topbar">
        <h1 className="f11-dash-title">👋 Welcome, {candidate.fullName.split(" ")[0]}</h1>
        <button className="f11-logout" onClick={onLogout}>Logout</button>
      </div>

      {/* Profile Completeness */}
      <div className="f11-card">
        <p className="f11-section-label">Profile Completeness</p>
        <div className="f11-progress-track">
          <div className="f11-progress-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <p className="f11-progress-label" style={{ color: barColor }}>
          Your profile is {pct}% complete
        </p>
      </div>

      {/* Best Fit Hero */}
      {bestFit && (
        <div className="f11-hero-card">
          <div className="f11-hero-badge">⭐ Best Match</div>
          <div className="f11-hero-body">
            <div>
              <h2 className="f11-hero-title">{bestFit.title}</h2>
              <p className="f11-hero-company">{bestFit.company}</p>
              <p className="f11-hero-location">{bestFit.location}</p>
            </div>
            <ScoreRing score={bestFit.score} />
          </div>
          <button className="f11-btn-primary" onClick={() => setSelectedJob(bestFit)}>
            View Full Match →
          </button>
        </div>
      )}

      {/* Ranked Job List */}
      <div className="f11-card">
        <p className="f11-section-label">All Job Matches — Ranked by Compatibility</p>
        <div className="f11-job-list">
          {rankedJobs.map((job, i) => (
            <div key={job.id} className="f11-job-row">
              <span className="f11-job-rank">#{i + 1}</span>
              <div className="f11-job-info">
                <p className="f11-job-title">{job.title}</p>
                <p className="f11-job-company">{job.company}</p>
              </div>
              <TierBadge score={job.score} />
              <ScoreRing score={job.score} />
              <button className="f11-btn-secondary" onClick={() => setSelectedJob(job)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────
export default function F11() {
  const [candidate, setCandidate] = useState(null);

  if (!candidate) return <LoginScreen onLogin={setCandidate} />;
  return <Dashboard candidate={candidate} onLogout={() => setCandidate(null)} />;
}