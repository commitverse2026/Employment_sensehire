const express = require("express");
const router = express.Router(); // 🔥 MUST BE HERE
const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/jobs.json");

    let data = [];

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8");
      data = file ? JSON.parse(file) : [];
    }

    const newJob = {
      id: "j" + Date.now(),
      ...req.body,
      postedDate: new Date().toISOString().split("T")[0],
    };

    data.push(newJob);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("✅ Job saved:", newJob);

    res.json({ message: "Job saved successfully" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // 🔥 MUST EXPORT