import "./f10.css";
import { useState } from "react";

export default function F10() {
  const [gaps, setGaps] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const res = await fetch("http://localhost:5000/api/f10", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gaps: gaps.split(",").map((g) => g.trim()),
        }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuggestions(data.suggestions);
      }
    } catch {
      setError("Backend not running ❌");
    }

    setLoading(false);
  };

  return (
    <div className="f10-container">
      <div className="card">
        <h1>AI Recommendation Engine</h1>

        <textarea
          placeholder="Enter gaps (comma separated) e.g. hearing, vision, motor"
          value={gaps}
          onChange={(e) => setGaps(e.target.value)}
        />

        <button onClick={generate}>
          {loading ? "Generating..." : "Generate Suggestions ⚡"}
        </button>

        {error && <div className="error">{error}</div>}

        <div className="cards">
          {suggestions.map((s, i) => (
            <div key={i} className="suggestion-card">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <p className="gap">Gap: {s.gap}</p>
              <a href={s.link} target="_blank">Learn More →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}