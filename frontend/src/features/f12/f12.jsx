import React, { useEffect, useState } from "react";
import "./f12.css";

const F12 = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [sortType, setSortType] = useState("score");

  // 🔹 Load jobs
  useEffect(() => {
    fetch("/api/employer/jobs")
      .then((res) => res.json())
      .then(setJobs);
  }, []);

  // 🔹 Load candidates
  useEffect(() => {
    if (!selectedJob) return;

    fetch(`/api/employer/applicants/${selectedJob}`)
      .then((res) => res.json())
      .then((data) => {
        setCandidates(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  }, [selectedJob]);

  // 🔹 Sorting (FIXED)
  const sortedCandidates = React.useMemo(() => {
    return [...candidates].sort((a, b) => {
      if (sortType === "score") {
        return (b?.compatibilityScore || 0) - (a?.compatibilityScore || 0);
      }

      const nameA = a?.fullName || "";
      const nameB = b?.fullName || "";

      return nameA.localeCompare(nameB);
    });
  }, [candidates, sortType]);

  return (
    <div className="f12-container">
      <h2 className="title">Employer Dashboard</h2>

      {/* Controls */}
      <div className="controls">
        <select
          className="dropdown"
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <button
          className="sort-btn"
          onClick={() =>
            setSortType(sortType === "score" ? "name" : "score")
          }
        >
          Sort by: {sortType === "score" ? "Score" : "Name"}
        </button>
      </div>

      {/* Candidates */}
      <div className="cards">
        {sortedCandidates.length === 0 ? (
          <p className="empty">No candidates found</p>
        ) : (
          sortedCandidates.map((c) => (
            <div className="card" key={c.id}>
              <div className="card-header">
                {/* ✅ FIXED NAME */}
                <h3>{c.fullName || "Unknown Candidate"}</h3>

                <span className="score">
                  {c.compatibilityScore ?? 0}%
                </span>
              </div>

              {/* ✅ FIXED ROLE */}
              <p className="role">
                {c.preferredRoles?.[0] || "No role"}
              </p>

              <p className="location">
                📍 {c.location || "No location"}
              </p>

              <span
                className={`badge ${(c.tier || "").toLowerCase()}`}
              >
                {c.tier || "N/A"}
              </span>

              <p className="gap">
                {c.gapSummary ||
                  "No significant gaps identified."}
              </p>

              <a
                className="view-btn"
                href={`/match/${selectedJob}?candidateId=${c.id}`}
              >
                View Profile →
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default F12;