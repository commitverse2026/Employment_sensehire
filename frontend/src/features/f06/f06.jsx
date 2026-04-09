import { useEffect, useMemo, useState } from "react";
import "./f06.css";

const DIMENSION_LABELS = [
  "Visual",
  "Auditory",
  "Fine Motor",
  "Cognitive",
  "Verbal",
];

function toRadarPoints(vector, center = 100, maxRadius = 72) {
  const count = vector.length;
  return vector
    .map((value, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      const radius = (Number(value) / 5) * maxRadius;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function F06() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobVector, setJobVector] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  useEffect(() => {
    fetch("/api/employer/jobs")
      .then((res) => res.json())
      .then((data) => {
        const allJobs = Array.isArray(data.jobs) ? data.jobs : [];
        setJobs(allJobs);
        if (allJobs.length > 0) {
          setSelectedJobId(allJobs[0].id);
        }
      })
      .catch(() => setError("Unable to load jobs."));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;
    fetch(`/api/job-vector/${selectedJobId}`)
      .then((res) => res.json())
      .then((data) => setJobVector(data.jobVector || null))
      .catch(() => setJobVector(null));
  }, [selectedJobId]);

  async function handleGenerate() {
    if (!selectedJobId) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/job-vector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJobId }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to generate vector.");
        return;
      }

      setJobVector(data.jobVector);
    } catch (requestError) {
      setError("Unable to generate vector.");
    } finally {
      setLoading(false);
    }
  }

  const vector = jobVector?.vector || [0, 0, 0, 0, 0];
  const polygonPoints = toRadarPoints(vector);

  return (
    <main className="f06-page">
      <section className="f06-panel">
        <h1>Job Vector Generator</h1>
        <p className="f06-subtitle">
          Generate a 5-dimension job demand vector from F04 task requirements.
        </p>

        <div className="f06-controls">
          <label htmlFor="f06-job">Job</label>
          <select
            id="f06-job"
            value={selectedJobId}
            onChange={(event) => setSelectedJobId(event.target.value)}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title || "Untitled"} ({job.id})
              </option>
            ))}
          </select>
          <button onClick={handleGenerate} disabled={loading || !selectedJobId}>
            {loading ? "Generating..." : "Generate Job Vector"}
          </button>
        </div>

        {error ? <p className="f06-error">{error}</p> : null}

        <div className="f06-card">
          <h2>{selectedJob ? selectedJob.title : "Job vector preview"}</h2>
          <p className="f06-muted">
            Vector order: [visual, auditory, fineMotor, cognitiveLoad, verbalComm]
          </p>
          <p className="f06-vector">[{vector.join(", ")}]</p>

          <svg className="f06-radar" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="72" className="f06-grid" />
            <circle cx="100" cy="100" r="54" className="f06-grid" />
            <circle cx="100" cy="100" r="36" className="f06-grid" />
            <circle cx="100" cy="100" r="18" className="f06-grid" />
            <polygon points={polygonPoints} className="f06-shape" />
          </svg>

          <div className="f06-dimensions">
            {DIMENSION_LABELS.map((label, index) => (
              <div key={label} className="f06-dimension">
                <span>{label}</span>
                <strong>{vector[index]}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}