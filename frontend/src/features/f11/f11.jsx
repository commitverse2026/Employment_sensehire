import { useMemo, useState } from "react";
import "./f11.css";

const DEFAULT_CREDENTIALS = {
  username: "priya.mehta",
  password: "priya123",
};

function tierClassName(tier) {
  const key = (tier || "").toLowerCase();
  if (key === "excellent") return "f11-tier f11-tier-excellent";
  if (key === "good") return "f11-tier f11-tier-good";
  if (key === "possible") return "f11-tier f11-tier-possible";
  return "f11-tier f11-tier-unlikely";
}

function completionClassName(percent) {
  if (percent >= 80) return "f11-progress-fill f11-progress-good";
  if (percent >= 50) return "f11-progress-fill f11-progress-mid";
  return "f11-progress-fill f11-progress-low";
}

export default function F11() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [rankedJobs, setRankedJobs] = useState([]);
  const [bestFit, setBestFit] = useState(null);

  const completion = useMemo(() => candidate?.profileComplete || 0, [candidate]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(loginData.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (loginData.role !== "candidate" || !loginData.candidateId) {
        setError("Access denied. Candidate account required.");
        setLoading(false);
        return;
      }

      const dashboardResponse = await fetch(
        `/api/candidate/dashboard/${loginData.candidateId}`,
      );
      const dashboardData = await dashboardResponse.json();

      if (!dashboardResponse.ok) {
        setError(dashboardData.error || "Unable to load dashboard");
        setLoading(false);
        return;
      }

      setCandidate(dashboardData.candidate || null);
      setRankedJobs(Array.isArray(dashboardData.rankedJobs) ? dashboardData.rankedJobs : []);
      setBestFit(dashboardData.bestFit || null);
    } catch (requestError) {
      setError("Unable to load candidate dashboard right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!candidate) {
    return (
      <main className="f11-page">
        <section className="f11-panel">
          <h1>Candidate Login</h1>
          <p className="f11-subtitle">
            Sign in to view your profile completeness and ranked job matches.
          </p>

          <form className="f11-form" onSubmit={handleLogin}>
            <label htmlFor="f11-username">Username</label>
            <input
              id="f11-username"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, username: event.target.value }))
              }
            />

            <label htmlFor="f11-password">Password</label>
            <input
              id="f11-password"
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, password: event.target.value }))
              }
            />

            {error ? <p className="f11-error">{error}</p> : null}
            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="f11-page">
      <section className="f11-panel">
        <div className="f11-header">
          <div>
            <h1>Candidate Dashboard</h1>
            <p className="f11-subtitle">Welcome, {candidate.fullName}</p>
          </div>
          <button
            className="f11-logout"
            onClick={() => {
              setCandidate(null);
              setBestFit(null);
              setRankedJobs([]);
              setError("");
            }}
          >
            Logout
          </button>
        </div>

        <section className="f11-card">
          <h2>Profile Completeness</h2>
          <p>Your profile is {completion}% complete</p>
          <div className="f11-progress">
            <div className={completionClassName(completion)} style={{ width: `${completion}%` }} />
          </div>
        </section>

        {bestFit ? (
          <section className="f11-card">
            <h2>Your Best Fit</h2>
            <div className="f11-best-fit">
              <div>
                <h3>{bestFit.title}</h3>
                <p>{bestFit.company}</p>
              </div>
              <div className="f11-score-ring">
                <span>{bestFit.score}%</span>
              </div>
            </div>
          </section>
        ) : null}

        <section className="f11-card">
          <h2>Ranked Job Matches</h2>
          <div className="f11-jobs">
            {rankedJobs.map((job) => (
              <article className="f11-job-row" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                </div>
                <div className="f11-job-meta">
                  <strong>{job.score}%</strong>
                  <span className={tierClassName(job.tier)}>{job.tier}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}