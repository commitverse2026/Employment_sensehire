import React, { useState } from "react";
import "./f06.css";

const F06 = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/api/f06/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, description: desc })
    });

    const data = await res.json();
    setResult(data.data);
  };

  return (
    <div className="f06-container">
      <h2>🧠 Job Vector Generator</h2>

      <div className="layout">
        
        {/* LEFT: INPUT */}
        <div className="card input-card">
          <h3>Job Input</h3>

          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Paste job description..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button onClick={handleGenerate}>
            ⚡ Generate Vector
          </button>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="card output-card">
          <h3>Vector Output</h3>

          {!result && <p className="placeholder">No data yet...</p>}

          {result && (
            <>
              <h4>{result.title}</h4>

              <div className="bars">
                {Object.entries(result.vector).map(([key, value]) => (
                  <div key={key} className="bar-row">
                    <span>{key}</span>
                    <div className="bar-bg">
                      <div
                        className="bar-fill"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default F06;