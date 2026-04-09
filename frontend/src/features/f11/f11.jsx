import React, { useState } from "react";
import "./f11.css";

const F11 = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState(null);

  const handleLogin = async () => {
    setError("");

    const res = await fetch(
      `http://localhost:5000/api/f11/login?username=${username}`
    );
    const result = await res.json();

    if (result.success) {
      setData(result);
      setLoggedIn(true);
    } else {
      setError("User not found ❌");
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>SenseHire</h2>
          <p className="subtitle">Candidate Dashboard Login</p>

          <input
            type="text"
            placeholder="Enter username (e.g. priya.mehta)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button onClick={handleLogin}>Login →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="f11-container">
      <h2>Welcome 👋</h2>

      <div className="profile-meter">
        Profile: {data.profileComplete}%
        <div className="bar">
          <div
            className="fill"
            style={{ width: `${data.profileComplete}%` }}
          ></div>
        </div>
      </div>

      <div className="best-fit">
        <h3>🔥 Your Best Fit</h3>
        <p>{data.bestJob.title}</p>
        <span>{data.bestJob.score}% Match</span>
      </div>

      <div className="jobs">
        {data.jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h4>{job.title}</h4>
            <p>{job.company}</p>
            <span>{job.score}% Match</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default F11;