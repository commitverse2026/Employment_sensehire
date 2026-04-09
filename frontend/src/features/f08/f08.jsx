import React, { useEffect, useState } from "react";
import "./f08.css";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function F08() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/api/f08/match/${jobId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [jobId]);

  if (!data) return <div className="loading">Calculating match...</div>;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (data.score / 100) * circumference;

  return (
    <div className="match-container">
      <div className="card">

        {/* Animated Ring */}
        <div className="progress-wrapper">
          <svg width="180" height="180">
            <circle
              className="bg-circle"
              cx="90"
              cy="90"
              r={radius}
            />
            <circle
              className="progress-circle"
              cx="90"
              cy="90"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ stroke: data.tier.color }}
            />
          </svg>

          <div className="score-text">
            {data.score}%
          </div>
        </div>

        {/* Tier Badge */}
        <div
          className="tier-badge"
          style={{ backgroundColor: data.tier.color }}
        >
          {data.tier.label}
        </div>

        {/* Summary */}
        <p className="summary">{data.summary}</p>

      </div>
    </div>
  );
}