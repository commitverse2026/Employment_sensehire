// Cosine Similarity Function
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be same length");
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

// Controller
exports.calculateSimilarity = (req, res) => {
  try {
    const { vecA, vecB } = req.body;

    const similarity = cosineSimilarity(vecA, vecB);

    res.json({
      similarity: Number(similarity.toFixed(3)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};