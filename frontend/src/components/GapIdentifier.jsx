import { useState } from "react";

export default function GapIdentifier() {
  const [candidateSkills, setCandidateSkills] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [matched, setMatched] = useState([]);
  const [missing, setMissing] = useState([]);

  const parseSkills = (text) =>
    text
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

  const analyzeGap = () => {
    const candidate = parseSkills(candidateSkills);
    const job = parseSkills(jobSkills);

    const matchedSkills = job.filter((skill) =>
      candidate.includes(skill)
    );

    const missingSkills = job.filter(
      (skill) => !candidate.includes(skill)
    );

    setMatched(matchedSkills);
    setMissing(missingSkills);
  };

  const matchPercentage =
    matched.length + missing.length === 0
      ? 0
      : Math.round((matched.length / (matched.length + missing.length)) * 100);

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={heading}>⚡ Gap Identification Engine</h2>

        {/* INPUTS */}
        <label style={label}>Candidate Skills</label>
        <input
          placeholder="React, Java, Python"
          value={candidateSkills}
          onChange={(e) => setCandidateSkills(e.target.value)}
          style={input}
        />

        <label style={label}>Job Required Skills</label>
        <input
          placeholder="React, Node, Python"
          value={jobSkills}
          onChange={(e) => setJobSkills(e.target.value)}
          style={input}
        />

        <button onClick={analyzeGap} style={button}>
          Analyze Gap 🚀
        </button>

        {/* PROGRESS BAR */}
        {(matched.length > 0 || missing.length > 0) && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "#000" }}>
              Match Score: <strong>{matchPercentage}%</strong>
            </p>
            <div style={progressBar}>
              <div
                style={{
                  ...progressFill,
                  width: `${matchPercentage}%`
                }}
              />
            </div>
          </div>
        )}

        {/* MATCHED */}
        {matched.length > 0 && (
          <div style={box}>
            <h4 style={{ color: "#16a34a" }}>✅ Matching Skills</h4>
            <div style={chipContainer}>
              {matched.map((skill, i) => (
                <span key={i} style={matchChip}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* MISSING */}
        {missing.length > 0 && (
          <div style={box}>
            <h4 style={{ color: "#dc2626" }}>❌ Missing Skills</h4>
            <div style={chipContainer}>
              {missing.map((skill, i) => (
                <span key={i} style={missingChip}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #6366f1, #a855f7)"
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  width: "450px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const heading = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#111827"
};

const label = {
  color: "#111",
  fontWeight: "500"
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  color: "#000"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(to right, #f59e0b, #f97316)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const box = {
  marginTop: "15px",
  padding: "12px",
  background: "#f9fafb",
  borderRadius: "8px"
};

const chipContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "10px"
};

const matchChip = {
  background: "#dcfce7",
  color: "#166534",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "14px"
};

const missingChip = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "14px"
};

const progressBar = {
  width: "100%",
  height: "10px",
  background: "#e5e7eb",
  borderRadius: "10px",
  overflow: "hidden"
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(to right, #22c55e, #4ade80)"
};