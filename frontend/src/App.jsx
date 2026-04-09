import { useState } from "react";
import DisabilityProfiler from "./components/DisabilityProfiler";
import F11 from "./features/f11/f11";

function App() {
  const [page, setPage] = useState("home");

  if (page === "candidate") return <F11 />;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
      <DisabilityProfiler />
      <button
        onClick={() => setPage("candidate")}
        style={{
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 28px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Go to Candidate Dashboard →
      </button>
    </div>
  );
}

export default App;