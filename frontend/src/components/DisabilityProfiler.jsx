import { useState } from "react";

const disabilities = [
  {
    title: "Visual Impairment",
    description: "Difficulty in seeing, may require screen readers."
  },
  {
    title: "Hearing Impairment",
    description: "Difficulty in hearing, may require captions."
  },
  {
    title: "Motor Disability",
    description: "Limited physical movement or coordination."
  },
  {
    title: "Cognitive Disability",
    description: "Affects memory, problem-solving, or attention."
  }
];

export default function DisabilityProfiler() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selected, setSelected] = useState("");

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSelect = (type) => {
    setSelected(type);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Disability Profiler</h2>

        {disabilities.map((item, index) => {
          const isOpen = activeIndex === index;
          const isSelected = selected === item.title;

          return (
            <div
              key={index}
              style={{
                ...accordionItem,
                border: isSelected ? "2px solid #4f46e5" : "1px solid #ddd"
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  ...accordionHeader,
                  backgroundColor: isOpen ? "#eef2ff" : "#f9fafb"
                }}
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.title}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* CONTENT */}
              <div
                style={{
                  ...accordionContent,
                  maxHeight: isOpen ? "150px" : "0px",
                  opacity: isOpen ? 1 : 0
                }}
              >
                <p>{item.description}</p>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: isSelected ? "#16a34a" : "#4f46e5"
                  }}
                  onClick={() => handleSelect(item.title)}
                >
                  {isSelected ? "Selected ✓" : "Select"}
                </button>
              </div>
            </div>
          );
        })}

        {selected && (
          <div style={resultBox}>
            Selected Disability: <strong>{selected}</strong>
          </div>
        )}
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
  background: "linear-gradient(to right, #eef2ff, #f3f4f6)"
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "12px",
  width: "420px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#000"
};

const accordionItem = {
  borderRadius: "8px",
  marginBottom: "10px",
  overflow: "hidden",
  transition: "all 0.3s ease"
};

const accordionHeader = {
  padding: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#000",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const accordionContent = {
  padding: "10px",
  color: "#333",
  overflow: "hidden",
  transition: "all 0.3s ease"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "8px 12px",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const resultBox = {
  marginTop: "15px",
  padding: "10px",
  backgroundColor: "#ecfdf5",
  borderRadius: "6px",
  color: "#065f46",
  textAlign: "center"
};