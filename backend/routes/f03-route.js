const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  const filePath = path.join(__dirname, "../data/ability-vectors.json");

  let data = [];

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath));
  }

  data.push(req.body);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ message: "Saved to ability-vectors.json" });
});

module.exports = router;