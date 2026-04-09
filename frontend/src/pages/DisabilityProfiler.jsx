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

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/disability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: selectedType,
                    details: details,
                }),
            });

            const data = await response.json();
            alert("Submitted Successfully!");
            console.log(data);
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Disability Profiler</h2>

                {disabilityTypes.map((type, index) => (
                    <div key={index} style={styles.accordionItem}>
                        <div
                            style={styles.accordionHeader}
                            onClick={() => {
                                toggleAccordion(index);
                                setSelectedType(type);
                            }}
                        >
                            {type}
                        </div>

                        {activeIndex === index && (
                            <div style={styles.accordionContent}>
                                <textarea
                                    placeholder="Describe specific needs..."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    style={styles.textarea}
                                />
                            </div>
                        )}
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
        fontFamily: "Poppins, sans-serif",
    },
    card: {
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        width: "450px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
    },
    accordionItem: {
        marginBottom: "12px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
    },
    accordionHeader: {
        padding: "14px",
        background: "#f3f4f6",
        cursor: "pointer",
        fontWeight: "500",
    },
    accordionContent: {
        padding: "14px",
        background: "#fff",
    },
    textarea: {
        width: "100%",
        minHeight: "80px",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    button: {
        marginTop: "20px",
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(to right, #6366f1, #a855f7)",
        color: "white",
        cursor: "pointer",
        fontWeight: "500",
    },
};