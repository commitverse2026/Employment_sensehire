import { useEffect, useState } from "react";
import "./f08.css";

export default function CompatibilityScore() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch("/api/compatibility/c001/j001")
      .then(res => res.json())
      .then(data => {
        setScore(data.score || 0);
      });
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-container">
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#1e293b"
          strokeWidth="10"
          fill="none"
        />

        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#22c55e"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>

      <div className="score-text">{score}%</div>
    </div>
  );
}