import { useState } from "react";

export default function DisabilityProfiler() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [details, setDetails] = useState("");

  const disabilityTypes = [
    "Physical Disability",
    "Visual Impairment",
    "Hearing Impairment",
    "Cognitive Disability",
  ];

  const toggleAccordion = (index, type) => {
    setActiveIndex(activeIndex === index ? null : index);
    setSelectedType(type);
  };

  const handleSubmit = async () => {
    alert("Submitted Successfully!");
    console.log({ selectedType, details });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Disability Profiler</h2>
        <p style={styles.subHeading}>
          Select a disability category and describe specific needs
        </p>

        {disabilityTypes.map((type, index) => (
          <div key={index} style={styles.accordionItem}>
            <div
              style={{
                ...styles.accordionHeader,
                background:
                  activeIndex === index
                    ? "linear-gradient(to right, #6366f1, #9333ea)"
                    : "#f9fafb",
                color: activeIndex === index ? "#fff" : "#111",
              }}
              onClick={() => toggleAccordion(index, type)}
            >
              {type}
              <span style={styles.icon}>
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div
              style={{
                ...styles.accordionContent,
                maxHeight: activeIndex === index ? "200px" : "0px",
                padding: activeIndex === index ? "18px" : "0 18px",
              }}
            >
              <textarea
                placeholder="Describe specific needs..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={styles.textarea}
              />
            </div>
          </div>
        ))}

        <button style={styles.button} onClick={handleSubmit}>
          Submit Profile
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "50px 40px",
    borderRadius: "24px",
    width: "480px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "8px",
  },
  subHeading: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
    marginBottom: "30px",
  },
  accordionItem: {
    marginBottom: "16px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    transition: "0.3s",
  },
  accordionHeader: {
    padding: "16px 18px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "0.3s",
  },
  icon: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  accordionContent: {
    overflow: "hidden",
    transition: "all 0.4s ease",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    color: "#000",
  },
  button: {
    marginTop: "30px",
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "500",
    fontSize: "15px",
    cursor: "pointer",
    background: "linear-gradient(to right, #6366f1, #a855f7)",
    color: "#fff",
    transition: "0.3s",
  },
};