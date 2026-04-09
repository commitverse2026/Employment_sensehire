require("dotenv").config();
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
app.use("/api/f10", require("./routes/f10-routes"));
const f13Routes = require("./routes/f13-routes");
app.use("/api/f13", f13Routes);
const f12Routes = require("./routes/f12-routes");
app.use("/api/f12", f12Routes);
const f11Routes = require("./routes/f11-routes");
app.use("/api/f11", f11Routes);
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