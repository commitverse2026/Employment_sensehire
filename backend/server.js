const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Main Feature 12 Route
app.use("/api/f12", require("./routes/f12"));

// Existing F04 Route
app.use("/api/jobs", require("./routes/f04-routes"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});