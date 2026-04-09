import "./f03.css";
import { useState } from "react";

export default function F03() {
  const [values, setValues] = useState({
    reading: 3,
    speaking: 3,
    fineMotor: 3,
    focus: 3,
    hearing: 3,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ DESCRIPTION (1–5 SCALE)
  const getDescription = (key, val) => {
    const map = {
      reading: [
        "Struggles to read basic text",
        "Can read simple content",
        "Comfortable reading most content",
        "Reads complex material well",
        "Excellent comprehension skills",
      ],
      speaking: [
        "Difficulty expressing thoughts",
        "Basic communication ability",
        "Clear in normal conversations",
        "Confident speaker",
        "Excellent public speaker",
      ],
      fineMotor: [
        "Difficulty with hand movements",
        "Basic coordination",
        "Good control in daily tasks",
        "Precise movements",
        "Highly skilled motor control",
      ],
      focus: [
        "Easily distracted",
        "Short attention span",
        "Average focus ability",
        "Good concentration",
        "Highly focused for long tasks",
      ],
      hearing: [
        "Difficulty hearing sounds",
        "Hears basic sounds",
        "Normal hearing ability",
        "Good clarity in noisy areas",
        "Excellent auditory perception",
      ],
    };

    return map[key][val - 1];
  };

  // ✅ SCORE (convert to 100 scale)
  const getScore = () => {
    const vals = Object.values(values);
    return Math.round((vals.reduce((a, b) => a + b, 0) / (vals.length * 5)) * 100);
  };

  // ✅ SUBMIT
  const submitData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/f03", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);
    } catch (err) {
      alert("Backend not running ❌");
    }
  };

  return (
    <div className="f03-container">
      <h1>Ability Input Module</h1>

      {submitted ? (
        <div className="success">
          🎉 Ability vector saved successfully!
          <p>Score: {getScore()} / 100</p>
        </div>
      ) : (
        <>
          {Object.keys(values).map((key) => (
            <div key={key} className="slider-box">
              
              <label>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>

              <input
                type="range"
                min="1"
                max="5"
                value={values[key]}
                onChange={(e) =>
                  handleChange(key, Number(e.target.value))
                }
              />

              <p>
                Level {values[key]} — {getDescription(key, values[key])}
              </p>
            </div>
          ))}

          <div className="summary">
            <h3>Overall Score: {getScore()} / 100</h3>
          </div>

          <button onClick={submitData}>Submit</button>
        </>
      )}
    </div>
  );
}