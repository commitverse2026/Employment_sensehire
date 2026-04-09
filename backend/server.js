const express = require("express");
const cors = require("cors");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ======================
// F01 ROUTE (Onboarding)
// ======================
app.post("/api/onboarding", (req, res) => {
  console.log("F01 Data:", req.body);

  res.json({
    message: "Onboarding data received successfully",
  });
});

// ======================
// F03 ROUTE (Ability Input)
// ======================
app.post("/api/f03", (req, res) => {
  console.log("F03 Data:", req.body);

  res.json({
    message: "F03 data received successfully",
  });
});

// ======================
// ✅ F08 ROUTE (Compatibility Score)
// ======================
app.get("/api/compatibility/:candidateId/:jobId", (req, res) => {
  const score = Math.floor(Math.random() * 40) + 60;
  res.json({ score });
});

// ======================
// START SERVER
// ======================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});