import React, { useEffect, useState } from "react";
import "./f12.css";

const F12 = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/f12/candidates")
      .then((res) => res.json())
      .then((data) => {
        // sort descending by score
        const sorted = data.sort((a, b) => b.score - a.score);
        setCandidates(sorted);
      });
  }, []);

  return (
    <div className="f12-container">
      <h2>Employer Dashboard</h2>

      <div className="candidate-grid">
  {candidates.map((c) => (
    <div key={c.id} className="candidate-card">
      
      <div className="score">{c.score}% Match</div>

      <h3>{c.name}</h3>
      <p className="role">{c.role}</p>

      <p className="summary">{c.summary}</p>

      <div className="gap">
        ⚠ {c.gapSummary}
      </div>

    </div>
  ))}
</div>
    </div>
  );
};

export default F12;