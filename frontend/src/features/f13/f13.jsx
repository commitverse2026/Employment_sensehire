import React, { useEffect, useState } from "react";
import "./f13.css";

const F13 = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [score, setScore] = useState(0);
  const [filters, setFilters] = useState({
    disability: [],
    remote: false,
    noAccommodation: false,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/f13/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      });
  }, []);

  useEffect(() => {
    let result = jobs.filter((job) => {
      // Keyword AND search
      const keywordMatch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase());

      // Accessibility score
      const scoreMatch = job.accessibilityScore >= score;

      // Disability filter
      const disabilityMatch =
        filters.disability.length === 0 ||
        filters.disability.includes(job.disabilityType);

      // Remote filter
      const remoteMatch = !filters.remote || job.remote === true;

      // No accommodation filter
      const noAccMatch =
        !filters.noAccommodation || job.noAccommodation === true;

      return (
        keywordMatch &&
        scoreMatch &&
        disabilityMatch &&
        remoteMatch &&
        noAccMatch
      );
    });

    setFilteredJobs(result);
  }, [search, score, filters, jobs]);

  const toggleDisability = (type) => {
    setFilters((prev) => {
      const exists = prev.disability.includes(type);
      return {
        ...prev,
        disability: exists
          ? prev.disability.filter((d) => d !== type)
          : [...prev.disability, type],
      };
    });
  };

  return (
    <div className="f13-container">
      <h2>Search & Accessibility Filter</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Score */}
      <div className="score">
        <label>Accessibility ≥ {score}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
      </div>

      {/* Chips */}
      <div className="chips">
        {["visual", "hearing", "mobility"].map((type) => (
          <button
            key={type}
            className={filters.disability.includes(type) ? "active" : ""}
            onClick={() => toggleDisability(type)}
          >
            {type}
          </button>
        ))}

        <button
          className={filters.remote ? "active" : ""}
          onClick={() =>
            setFilters((prev) => ({ ...prev, remote: !prev.remote }))
          }
        >
          Remote
        </button>

        <button
          className={filters.noAccommodation ? "active" : ""}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              noAccommodation: !prev.noAccommodation,
            }))
          }
        >
          No Accommodation Needed
        </button>
      </div>

      {/* Results */}
      <div className="jobs">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <span>Score: {job.accessibilityScore}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default F13;