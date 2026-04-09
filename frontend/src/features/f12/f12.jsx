import { useEffect, useMemo, useState } from "react";
import "./f12.css";

const DEFAULT_CREDENTIALS = {
  username: "employer.admin",
  password: "employer123",
};

function tierClassName(tier) {
  const key = (tier || "").toLowerCase();
  if (key === "excellent") return "f12-tier f12-tier-excellent";
  if (key === "good") return "f12-tier f12-tier-good";
  if (key === "possible") return "f12-tier f12-tier-possible";
  return "f12-tier f12-tier-unlikely";
}

export default function F12() {
  const [credentials, setCredentials] = useState(DEFAULT_CREDENTIALS);
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [sortBy, setSortBy] = useState("score");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  const sortedApplicants = useMemo(() => {
    const copy = [...applicants];
    if (sortBy === "name") {
      return copy.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    return copy.sort((a, b) => b.score - a.score);
  }, [applicants, sortBy]);

  useEffect(() => {
    if (!currentUser) return;

    fetch("/api/employer/jobs")
      .then((res) => res.json())
      .then((data) => {
        const allJobs = Array.isArray(data.jobs) ? data.jobs : [];
        setJobs(allJobs);
        if (allJobs.length > 0) {
          setSelectedJobId(allJobs[0].id);
        }
      })
      .catch(() => {
        setError("Unable to load jobs.");
      });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !selectedJobId) return;

    setLoading(true);
    setError("");

    fetch(`/api/employer/applicants/${selectedJobId}`)
      .then((res) => res.json())
      .then((data) => {
        setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
      })
      .catch(() => {
        setError("Unable to load applicants for this job.");
        setApplicants([]);
      })
      .finally(() => setLoading(false));
  }, [currentUser, selectedJobId]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials.");
        return;
      }

      if (data.role !== "employer") {
        setError("Access denied. Employer account required.");
        return;
      }

      setCurrentUser(data);
    } catch (loginError) {
      setError("Unable to sign in right now.");
    }
  }

  if (!currentUser) {
    return (
      <main className="f12-page">
        <section className="f12-panel">
          <h1>Employer Login</h1>
          <p className="f12-subtitle">
            Sign in to view ranked applicants by similarity score.
          </p>
          <form className="f12-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder="employer.admin"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="********"
            />

            {error ? <p className="f12-error">{error}</p> : null}
            <button type="submit">Login</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="f12-page">
      <section className="f12-panel">
        <div className="f12-header">
          <div>
            <h1>Employer Dashboard</h1>
            <p className="f12-subtitle">
              {selectedJob
                ? `Applicants for ${selectedJob.title}`
                : "Select a job to see ranked applicants."}
            </p>
          </div>
          <button
            className="f12-secondary-btn"
            onClick={() => {
              setCurrentUser(null);
              setApplicants([]);
              setSelectedJobId("");
              setJobs([]);
              setError("");
            }}
          >
            Logout
          </button>
        </div>

        <div className="f12-controls">
          <label htmlFor="jobSelect">Job</label>
          <select
            id="jobSelect"
            value={selectedJobId}
            onChange={(event) => setSelectedJobId(event.target.value)}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.id})
              </option>
            ))}
          </select>

          <label htmlFor="sortSelect">Sort by</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="score">Compatibility score (high to low)</option>
            <option value="name">Candidate name (A-Z)</option>
          </select>
        </div>

        {loading ? <p className="f12-muted">Loading applicants...</p> : null}
        {error ? <p className="f12-error">{error}</p> : null}
        {!loading && sortedApplicants.length === 0 ? (
          <p className="f12-muted">No applicants found for this job.</p>
        ) : null}

        <div className="f12-grid">
          {sortedApplicants.map((applicant) => (
            <article key={applicant.id} className="f12-card">
              <div className="f12-card-top">
                <h3>{applicant.fullName}</h3>
                <span className={tierClassName(applicant.tier)}>{applicant.tier}</span>
              </div>
              <p className="f12-role">{applicant.preferredRole}</p>
              <p className="f12-location">{applicant.location}</p>
              <p className="f12-score">{applicant.score}% match</p>
              <p className="f12-gap">{applicant.gapSummary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
