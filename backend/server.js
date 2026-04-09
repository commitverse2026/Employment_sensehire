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
app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

// ======================
// ROUTES
// ======================
app.use("/api/jobs", require("./routes/f04-routes"));
app.use("/api/f05", require("./routes/f05-routes"));
app.use("/api/f07", require("./routes/f07-routes"));
// ======================
// F01 ROUTE
// ======================
app.post("/api/onboarding", (req, res) => {
  console.log("F01 Data:", req.body);
  res.json({ message: "Onboarding data received" });
});

// F02 ROUTE (disability profiler )
const { getDisabilityTypes, saveDisability } = require("./controllers/f02");

app.get("/api/disability-types", getDisabilityTypes);
app.post("/api/disability", saveDisability);

// ======================
// F03 ROUTE
// ======================
app.post("/api/f03", (req, res) => {
  console.log("F03 Data:", req.body);
  res.json({ message: "F03 data received" });
});

// ======================
// ✅ F08 ROUTE (Compatibility Score)
// ======================
app.get("/api/compatibility/:candidateId/:jobId", (req, res) => {
  const score = Math.floor(Math.random() * 40) + 60;
  res.json({ score });
});

// ======================
// F10 ROUTE (AI Recommendations)
// ======================
app.use('/api/recommendations', require('./routes/f10-routes'));

// ======================
// START SERVER
// ======================
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});