const fs = require("fs");
const path = require("path");

const abilityDescriptions = {
  visual: [
    "Blind — uses screen readers",
    "Very limited vision",
    "Can read with assistance",
    "Comfortable reading",
    "Full visual capability"
  ],
  auditory: [
    "Deaf — needs captions",
    "Hard of hearing",
    "Average hearing",
    "Hears well",
    "Excellent auditory processing"
  ],
  fineMotor: [
    "Severely limited movement",
    "Limited — assistive tools",
    "Moderate control",
    "Good control",
    "Full dexterity"
  ],
  cognitiveLoad: [
    "Needs constant breaks",
    "Low focus",
    "Moderate focus",
    "Strong focus",
    "Excellent multitasking"
  ],
  verbalComm: [
    "Prefers text only",
    "Limited speech",
    "Comfortable sometimes",
    "Confident speaker",
    "Highly articulate"
  ]
};

exports.generateAbilityVector = (req, res) => {
  try {
    const { candidateId, values } = req.body;

    const vector = [
      values.visual,
      values.auditory,
      values.fineMotor,
      values.cognitiveLoad,
      values.verbalComm
    ];

    const labels = {
      visual: abilityDescriptions.visual[values.visual - 1],
      auditory: abilityDescriptions.auditory[values.auditory - 1],
      fineMotor: abilityDescriptions.fineMotor[values.fineMotor - 1],
      cognitiveLoad:
        abilityDescriptions.cognitiveLoad[values.cognitiveLoad - 1],
      verbalComm:
        abilityDescriptions.verbalComm[values.verbalComm - 1]
    };

    const newEntry = {
      id: "av" + Date.now(),
      candidateId,
      vector,
      dimensions: values,
      labels,
      generatedAt: new Date().toISOString()
    };

    // Save to JSON file
    const filePath = path.join(
      __dirname,
      "../data/ability-vectors.json"
    );

    const data = JSON.parse(fs.readFileSync(filePath));
    data.push(newEntry);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};