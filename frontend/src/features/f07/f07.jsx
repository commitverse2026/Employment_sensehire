import "./f07.css";
import { useState } from "react";

export default function F07() {
  const [vecA, setVecA] = useState("1,2,3,4,5");
  const [vecB, setVecB] = useState("5,4,3,2,1");
  const [result, setResult] = useState(null);

  const parseVector = (str) =>
    str.split(",").map((n) => Number(n.trim()));

  const calculate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/f07", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vecA: parseVector(vecA),
          vecB: parseVector(vecB),
        }),
      });

      const data = await res.json();
      setResult(data.similarity);
    } catch {
      alert("Backend not running ❌");
    }
  };

  return (
    <div className="f07-container">
      <div className="card">
        <h1>Cosine Similarity Engine</h1>

        <label>Vector A</label>
        <input
          value={vecA}
          onChange={(e) => setVecA(e.target.value)}
        />

        <label>Vector B</label>
        <input
          value={vecB}
          onChange={(e) => setVecB(e.target.value)}
        />

        <button onClick={calculate}>
          Calculate Similarity ⚡
        </button>

        {result !== null && (
          <div className="result">
            Similarity: {result}
          </div>
        )}
      </div>
    </div>
  );
}