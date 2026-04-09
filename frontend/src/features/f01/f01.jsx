import "./f01.css";
import { useState } from "react";

export default function F01() {
  const [step, setStep] = useState(1);
  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    skills: [],
    experience: "",
    roles: [],
  });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      updateData({ skills: [...formData.skills, skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    updateData({ skills: updated });
  };

  const addRole = () => {
    if (roleInput.trim()) {
      updateData({ roles: [...formData.roles, roleInput] });
      setRoleInput("");
    }
  };

  const removeRole = (index) => {
    const updated = formData.roles.filter((_, i) => i !== index);
    updateData({ roles: updated });
  };

  const submitForm = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed");

    setStep(4); // 👈 SHOW SUCCESS SCREEN
  } catch (err) {
    alert("Backend not running ❌");
    console.error(err);
  }
};

 return (
  <div className="page">

    {/* HEADER */}
    <div className="header">
      <div className="badge">✦ INCLUSIVE AI HIRING PLATFORM</div>
      <h1 className="title">
        Sense<span>Hire</span>
      </h1>
      <p className="subtitle">
        Build your profile to get matched with the right opportunities
      </p>
    </div>

    {/* FORM CARD */}
    <div className="f01-container">

      {/* SUCCESS MESSAGE */}
      {step === 4 && (
        <div className="success">
          🎉 Profile Submitted Successfully!
          <p>We’ll match you with relevant jobs soon.</p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="step">
          <h2>Full Name</h2>
          <input
            value={formData.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your name"
          />
          <div className="buttons">
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="step">
          <h2>Skills</h2>

          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Enter skill"
          />
          <button className="add-btn" onClick={addSkill}>Add</button>

          <div className="tags">
            {formData.skills.map((s, i) => (
              <span key={i} onClick={() => removeSkill(i)}>
                {s} ❌
              </span>
            ))}
          </div>

          <h2>Years of Experience</h2>
          <input
            value={formData.experience}
            onChange={(e) =>
              updateData({ experience: e.target.value })
            }
            placeholder="e.g. 2"
          />

          <div className="buttons">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="step">
          <h2>Preferred Roles</h2>

          <input
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder="Enter role"
          />
          <button className="add-btn" onClick={addRole}>Add</button>

          <div className="tags">
            {formData.roles.map((r, i) => (
              <span key={i} onClick={() => removeRole(i)}>
                {r} ❌
              </span>
            ))}
          </div>

          <div className="buttons">
            <button onClick={back}>Back</button>
            <button onClick={submitForm}>Submit</button>
          </div>
        </div>
      )}

    </div>
  </div>
);
}