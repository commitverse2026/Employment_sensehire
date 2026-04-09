import React, { useState, useEffect } from "react";

const jobsData = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    type: "Remote",
    desc: "Build UI apps"
  },
  {
    title: "Backend Developer",
    company: "Microsoft",
    location: "Bangalore",
    type: "Onsite",
    desc: "API & server work"
  },
  {
    title: "UI Designer",
    company: "Adobe",
    location: "Remote",
    type: "Remote",
    desc: "Design interfaces"
  },
  {
    title: "Full Stack Developer",
    company: "Amazon",
    location: "Hyderabad",
    type: "Hybrid",
    desc: "Frontend + Backend"
  }
];

export default function F02() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [results, setResults] = useState(jobsData);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // 🔍 Filtering
  useEffect(() => {
    let filtered = jobsData.filter((job) =>
      job.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    // ✅ NEW: Filter by job type
    if (filter !== "All") {
      filtered = filtered.filter((job) => job.type === filter);
    }

    setResults(filtered);
  }, [debouncedQuery, filter]);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Debounce Live Job Search</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      {/* 🔥 NEW FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        {["All", "Remote", "Hybrid", "Onsite"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: "10px",
              padding: "8px 12px",
              background: filter === f ? "#FF9933" : "#333",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job List */}
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        results.map((job, i) => (
          <div
            key={i}
            onClick={() => setSelectedJob(job)}
            style={{
              margin: "10px 0",
              padding: "12px",
              background: "#222",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p><strong>{job.type}</strong></p>
          </div>
        ))
      )}

      {/* Selected Job */}
      {selectedJob && (
        <div
          style={{
            marginTop: "30px",
            background: "#111",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h2>{selectedJob.title}</h2>
          <p><strong>Company:</strong> {selectedJob.company}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Type:</strong> {selectedJob.type}</p>
          <p><strong>Description:</strong> {selectedJob.desc}</p>
        </div>
      )}
import { useEffect, useState } from "react";

export default function F02() {
  const [types, setTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState("");

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:5000/api/disability-types")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setTypes(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubtype) {
      alert("Please select category and subtype");
      return;
    }

    const res = await fetch("http://localhost:5000/api/disability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category: selectedCategory.category,
        subtype: selectedSubtype
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
      <h2>Disability Profiler</h2>

      {/* CATEGORY */}
      <select
        onChange={(e) => {
          const cat = types.find(t => t.id === e.target.value);
          setSelectedCategory(cat);
          setSelectedSubtype("");
        }}
      >
        <option value="">Select Category</option>
        {types.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.category}
          </option>
        ))}
      </select>

      <br /><br />

      {/* SUBTYPE */}
      <select onChange={(e) => setSelectedSubtype(e.target.value)}>
        <option value="">Select Subtype</option>

        {selectedCategory?.subTypes.map((sub) => (
          <option key={sub.id} value={sub.label}>
            {sub.label}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}