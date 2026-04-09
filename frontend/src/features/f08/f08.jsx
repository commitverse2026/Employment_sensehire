import { useEffect, useState } from "react";

export default function F08() {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/compatibility/c001/j001")
      .then(res => res.json())
      .then(data => {
        setScore(data.score || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score > 80) return "#22c55e";
    if (score > 50) return "#facc15";
    return "#ef4444";
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "white" }}>
      
      <h2 style={{ marginBottom: "20px" }}>Compatibility Score</h2>

      <div style={{ position: "relative", width: "200px", margin: "auto" }}>
        <svg width="200" height="200">
          
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="none"
          />

          {/* Animated progress */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={getColor()}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset 1.5s ease-in-out"
            }}
          />
        </svg>

        {/* Score text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            fontWeight: "bold"
          }}
        >
          {loading ? "..." : `${score}%`}
        </div>
      </div>
    </div>
  );
}