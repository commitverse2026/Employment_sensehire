import React, { useState, useEffect } from "react";

// Sample jobs data
const jobsData = [
  { title: "Frontend Developer", company: "Google", location: "Remote" },
  { title: "Backend Developer", company: "Microsoft", location: "Bangalore" },
  { title: "UI Designer", company: "Adobe", location: "Remote" },
  { title: "Full Stack Developer", company: "Amazon", location: "Hyderabad" }
];

export default function SearchJobs() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState(jobsData);

  // 🔥 Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // 🔍 Filtering logic
  useEffect(() => {
    const filtered = jobsData.filter((job) =>
      job.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setResults(filtered);
  }, [debouncedQuery]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Job Search</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      {/* Results */}
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        results.map((job, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        ))
      )}
    </div>
  );
}