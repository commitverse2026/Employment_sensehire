import React, { useEffect, useState } from "react";
import "./f13.css";

export default function F13() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [noAccommodation, setNoAccommodation] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/f13/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      });
  }, []);

  useEffect(() => {
    let updated = [...jobs];

    // Keyword search
    if (search) {
      updated = updated.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Accessibility score filter
    updated = updated.filter(
      (job) => job.accessibilityScore >= minScore
    );

    // Remote filter
    if (remoteOnly) {
      updated = updated.filter((job) => job.remote);
    }

    // No accommodation needed (low difficulty jobs)
    if (noAccommodation) {
      updated = updated.filter(
        (job) => job.taskRequirements.phoneCalls <= 2
      );
    }

    setFilteredJobs(updated);
  }, [search, minScore, remoteOnly, noAccommodation, jobs]);

  return (
    <div className="f13-container">
      <h2>Job Search</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Filters */}
      <div className="filters">
        <input
          type="range"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        />
        <span>Min Score: {minScore}%</span>

        <button
          className={remoteOnly ? "active" : ""}
          onClick={() => setRemoteOnly(!remoteOnly)}
        >
          Remote
        </button>

        <button
          className={noAccommodation ? "active" : ""}
          onClick={() => setNoAccommodation(!noAccommodation)}
        >
          No Accommodation Needed
        </button>
      </div>

      {/* Results */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.description}</p>
            <span className="score">
              {job.accessibilityScore}% Match
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
