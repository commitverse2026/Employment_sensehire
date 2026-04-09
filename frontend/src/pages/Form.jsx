import { useState } from "react";

export default function CandidateForm() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [experience, setExperience] = useState("");
    const [roles, setRoles] = useState("");

    const addSkill = () => {
        if (skillInput.trim() !== "" && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Form Submitted Successfully!");
        console.log({ name, skills, experience, roles });
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Candidate Application</h2>

                {/* Progress Indicator */}
                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${(step / 4) * 100}%`,
                        }}
                    />
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div style={styles.stepContainer}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div style={styles.stepContainer}>
                        <label style={styles.label}>Skills</label>
                        <div style={styles.skillInputRow}>
                            <input
                                style={styles.input}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                            />
                            <button style={styles.addButton} onClick={addSkill}>
                                Add
                            </button>
                        </div>

                        <div style={styles.skillContainer}>
                            {skills.map((skill, index) => (
                                <div key={index} style={styles.skillTag}>
                                    {skill}
                                    <span
                                        style={styles.removeIcon}
                                        onClick={() => removeSkill(skill)}
                                    >
                                        ×
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div style={styles.stepContainer}>
                        <label style={styles.label}>Years of Experience</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="e.g. 2"
                        />
                    </div>
                )}

                {/* Step 4 */}
                {step === 4 && (
                    <div style={styles.stepContainer}>
                        <label style={styles.label}>Preferred Job Roles</label>
                        <input
                            style={styles.input}
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                            placeholder="Frontend Developer, UI Designer"
                        />
                    </div>
                )}

                <div style={styles.buttonContainer}>
                    {step > 1 && (
                        <button style={styles.secondaryButton} onClick={prevStep}>
                            Back
                        </button>
                    )}

                    {step < 4 ? (
                        <button style={styles.primaryButton} onClick={nextStep}>
                            Next
                        </button>
                    ) : (
                        <button style={styles.primaryButton} onClick={handleSubmit}>
                            Submit
                        </button>
                    )}
                </div>
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
        fontFamily: "'Poppins', sans-serif",
    },
    card: {
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        width: "420px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "600",
        color: "#333",
    },
    progressBar: {
        height: "8px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "30px",
    },
    progressFill: {
        height: "100%",
        background: "linear-gradient(to right, #6366f1, #a855f7)",
        transition: "0.3s ease",
    },
    stepContainer: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "500",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        outline: "none",
        fontSize: "14px",
        transition: "0.3s",
    },
    skillInputRow: {
        display: "flex",
        gap: "10px",
    },
    addButton: {
        padding: "12px 18px",
        borderRadius: "10px",
        border: "none",
        background: "#6366f1",
        color: "white",
        cursor: "pointer",
        fontWeight: "500",
    },
    skillContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "12px",
    },
    skillTag: {
        background: "#e0e7ff",
        padding: "8px 14px",
        borderRadius: "25px",
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: "500",
    },
    removeIcon: {
        marginLeft: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "25px",
    },
    primaryButton: {
        padding: "12px 22px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(to right, #6366f1, #a855f7)",
        color: "white",
        fontWeight: "500",
        cursor: "pointer",
    },
    secondaryButton: {
        padding: "12px 22px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        background: "#f3f4f6",
        cursor: "pointer",
    },
};