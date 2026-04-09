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

// ======================
// F01 ROUTE
// ======================
app.post("/api/onboarding", (req, res) => {
  console.log("F01 Data:", req.body);
  res.json({ message: "Onboarding data received" });
});

// ======================
// F03 ROUTE
// ======================
app.post("/api/f03", (req, res) => {
  console.log("F03 Data:", req.body);
  res.json({ message: "F03 data received" });
});

// ======================
// START SERVER
// ======================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});