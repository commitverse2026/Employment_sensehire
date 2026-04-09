import { useState } from "react";

export default function CandidateForm() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [experience, setExperience] = useState("");
    const [roles, setRoles] = useState("");

    const addSkill = () => {
        if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
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

                {/* Step 1 */}
                {step === 1 && (
                    <>
                        <label>Full Name</label>
                        <input
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <>
                        <label>Skills</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                style={styles.input}
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add skill"
                            />
                            <button onClick={addSkill}>Add</button>
                        </div>

                        <div style={styles.skillContainer}>
                            {skills.map((skill, index) => (
                                <div key={index} style={styles.skillTag}>
                                    {skill}
                                    <span
                                        style={{ cursor: "pointer", marginLeft: "8px" }}
                                        onClick={() => removeSkill(skill)}
                                    >
                                        ×
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <>
                        <label>Years of Experience</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </>
                )}

                {/* Step 4 */}
                {step === 4 && (
                    <>
                        <label>Preferred Job Roles</label>
                        <input
                            style={styles.input}
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                            placeholder="Frontend Developer, UI Designer"
                        />
                    </>
                )}

                <div style={styles.buttonContainer}>
                    {step > 1 && <button onClick={prevStep}>Back</button>}
                    {step < 4 ? (
                        <button onClick={nextStep}>Next</button>
                    ) : (
                        <button onClick={handleSubmit}>Submit</button>
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
        background: "linear-gradient(to right, #6366f1, #a855f7)",
    },
    card: {
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "400px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    heading: {
        textAlign: "center",
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    skillContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "10px",
    },
    skillTag: {
        background: "#e0e7ff",
        padding: "6px 12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
};