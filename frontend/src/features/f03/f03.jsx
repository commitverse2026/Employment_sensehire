import React, { useState } from "react";
import "./f03.css";
import axios from "axios";

const abilityMeta = {
  visual: {
    label: "Reading (Visual)",
    descriptions: [
      "Blind — uses screen readers",
      "Very limited vision",
      "Can read with assistance",
      "Comfortable reading",
      "Full visual capability"
    ]
  },
  auditory: {
    label: "Hearing (Auditory)",
    descriptions: [
      "Deaf — needs captions",
      "Hard of hearing",
      "Average hearing",
      "Hears well",
      "Excellent auditory processing"
    ]
  },
  fineMotor: {
    label: "Fine Motor Skills",
    descriptions: [
      "Severely limited movement",
      "Limited — assistive tools",
      "Moderate control",
      "Good control",
      "Full dexterity"
    ]
  },
  cognitiveLoad: {
    label: "Focus & Cognitive Load",
    descriptions: [
      "Needs constant breaks",
      "Low focus",
      "Moderate focus",
      "Strong focus",
      "Excellent multitasking"
    ]
  },
  verbalComm: {
    label: "Speaking (Verbal Communication)",
    descriptions: [
      "Prefers text only",
      "Limited speech",
      "Comfortable sometimes",
      "Confident speaker",
      "Highly articulate"
    ]
  }
};

export default function F03() {
  const [values, setValues] = useState({
    visual: 3,
    auditory: 3,
    fineMotor: 3,
    cognitiveLoad: 3,
    verbalComm: 3
  });

  const [result, setResult] = useState(null);

  const handleChange = (key, value) => {
    setValues({ ...values, [key]: parseInt(value) });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/f03/generate", {
        candidateId: "c999",
        values
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="f03-container">
      <h2>Ability Assessment</h2>

      {Object.keys(abilityMeta).map((key) => (
        <div className="slider-block" key={key}>
          <label>{abilityMeta[key].label}</label>

          <input
            type="range"
            min="1"
            max="5"
            value={values[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />

          <p className="description">
            {abilityMeta[key].descriptions[values[key] - 1]}
          </p>
        </div>
      ))}

      <button onClick={handleSubmit}>Generate Ability Vector</button>

      {result && (
        
  <div className="result-box">
    <h3>Generated Ability Vector</h3>

    <p><strong>Vector:</strong> {result.vector.join(", ")}</p>

    <div className="labels">
      {Object.entries(result.labels).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {value}
        </p>
      ))}
    </div>
  </div>
)}
    </div>
  );
}