import "./f04.css";
import { useState } from "react";

export default function F04() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [],
    experience: "",
    tasks: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postedJob, setPostedJob] = useState(null);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (form.skills.length >= 8) {
      alert("Max 8 skills allowed");
      return;
    }

    update("skills", [...form.skills, skillInput]);
    setSkillInput("");
  };

  const removeSkill = (i) => {
    update(
      "skills",
      form.skills.filter((_, index) => index !== i)
    );
  };

  const validate = () => {
    if (!form.title || !form.description || !form.experience) {
      setError("Please fill all required fields");
      return false;
    }
    setError("");
    return true;
  };

  

    const submit = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) throw new Error();

    setPostedJob(form);
    setSubmitted(true);

  } catch (err) {
    alert("Backend connection failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="f04-container">
      <h1>Job Posting Creator</h1>

      {submitted ? (
        <div className="success-card">
  <h2>🎉 Job Posted Successfully!</h2>

  <div className="job-preview">
    <h3>{postedJob.title}</h3>

    <p><strong>Description:</strong></p>
    <p>{postedJob.description}</p>

    <p><strong>Skills:</strong></p>
    <div className="tags">
      {postedJob.skills.map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>

    <p><strong>Experience:</strong> {postedJob.experience}</p>

    {postedJob.tasks && (
      <>
        <p><strong>Task Requirements:</strong></p>
        <p>{postedJob.tasks}</p>
      </>
    )}
  </div>

  <button onClick={() => window.location.reload()}>
    Post Another Job
  </button>
</div>
      ) : (
        <>
          {error && <p className="error">{error}</p>}

          {/* Title */}
          <div className="section">
            <label>Job Title *</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
          </div>

          {/* Description */}
          <div className="section">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the role..."
            />
            <small>{form.description.length} characters</small>
          </div>

          {/* Skills */}
          <div className="section">
            <label>Required Skills</label>
            <div className="skills-box">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill"
              />
              <button onClick={addSkill}>Add</button>
            </div>

            <div className="tags">
              {form.skills.map((s, i) => (
                <span key={i} onClick={() => removeSkill(i)}>
                  {s} ❌
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="section">
            <label>Experience Level *</label>
            <select
              value={form.experience}
              onChange={(e) => update("experience", e.target.value)}
            >
              <option value="">Select</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </select>
          </div>

          {/* Tasks */}
          <div className="section">
            <label>Task Requirements</label>
            <textarea
              value={form.tasks}
              onChange={(e) => update("tasks", e.target.value)}
              placeholder="e.g. visual monitoring, phone calls"
            />
          </div>

          {/* Preview */}
          <div className="preview">
            <h3>Preview</h3>
            <p><strong>{form.title}</strong></p>
            <p>{form.description}</p>
            <p>{form.skills.join(", ")}</p>
          </div>

          <button onClick={submit}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </>
      )}
    </div>
  );
  }