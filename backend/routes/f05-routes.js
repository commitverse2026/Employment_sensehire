const express = require("express");
const router = express.Router(); // 🔥 MUST

const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/ability-vectors.json");

    let data = [];

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, "utf-8");
      data = file ? JSON.parse(file) : [];
    }

    const newVector = {
      id: "v" + Date.now(),
      vector: req.body.vector,
      generatedAt: new Date().toISOString(),
    };

    data.push(newVector);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("✅ Vector saved:", newVector);

    res.json({ message: "Vector saved successfully" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 THIS LINE IS THE MAIN FIX
module.exports = router;