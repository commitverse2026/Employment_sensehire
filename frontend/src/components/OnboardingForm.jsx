import { useState } from "react";

export default function OnboardingForm() {
  const [form, setForm] = useState({
    name: "",
    skills: "",
    experience: "",
    role: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted Successfully!");
    console.log(form);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Candidate Onboarding</h2>

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="e.g. React, Java"
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            placeholder="Enter years"
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Preferred Role</label>
          <input
            type="text"
            name="role"
            placeholder="e.g. Frontend Developer"
            onChange={handleChange}
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f3f4f6"
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#000"
};

const labelStyle = {
  color: "#000",
  fontWeight: "500"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 15px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none",
  color: "#000",
  backgroundColor: "#fff"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};