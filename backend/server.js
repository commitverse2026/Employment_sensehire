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
// F15 ROUTES (Speech-to-Text Profile Builder)
// ======================
const f15Routes = require("./routes/f15-routes")
app.use('/api', f15Routes)

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
