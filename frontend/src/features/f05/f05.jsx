import "./f05.css";
import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export default function F05() {
  const [values, setValues] = useState({
    communication: 50,
    technical: 50,
    teamwork: 50,
    leadership: 50,
    problemSolving: 50,
  });

  const [vector, setVector] = useState(null);

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  // 🔥 Convert to 1–5 scale
  const generateVector = () => {
    const arr = Object.values(values).map((v) => {
      if (v < 20) return 1;
      if (v < 40) return 2;
      if (v < 60) return 3;
      if (v < 80) return 4;
      return 5;
    });

    setVector(arr);
    saveToBackend(arr);
  };

  const saveToBackend = async (arr) => {
    try {
      await fetch("http://127.0.0.1:5000/api/f05", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vector: arr }),
      });
    } catch {
      alert("Backend not running ❌");
    }
  };

  const chartData = [
    { subject: "Comm", value: vector?.[0] || 0 },
    { subject: "Tech", value: vector?.[1] || 0 },
    { subject: "Team", value: vector?.[2] || 0 },
    { subject: "Lead", value: vector?.[3] || 0 },
    { subject: "Problem", value: vector?.[4] || 0 },
  ];

  return (
    <div className="f05-container">
      <div className="card">
        <h1>Ability Vector Generator</h1>

        {/* SLIDERS */}
        <div className="sliders">
          {Object.keys(values).map((key) => (
            <div key={key} className="slider-box">
              <div className="slider-header">
                <span>{key}</span>
                <span className="value">{values[key]}</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={values[key]}
                onChange={(e) =>
                  handleChange(key, Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button className="generate-btn" onClick={generateVector}>
          Generate Vector ⚡
        </button>

        {/* RESULT */}
        {vector && vector.length > 0 && (
          <div className="result">
            <h2>Vector Output</h2>

            <p className="vector">
              [{vector.join(", ")}]
            </p>

            <div className="chart">
              <RadarChart
                outerRadius={120}
                width={350}
                height={300}
                data={chartData}
              >
                <PolarGrid stroke="#334155" strokeWidth={1} />

                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />

                <PolarRadiusAxis
                  domain={[0, 5]}
                  tick={{ fill: "#64748b" }}
                  axisLine={false}
                />

                <Radar
                  name="Ability"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="#22c55e"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}