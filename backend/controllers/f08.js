// controllers/f08.js

// Helper: Cosine Similarity
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

// Convert score → tier
function getTier(score) {
    if (score >= 85) return { label: "Excellent", color: "#22c55e" };
    if (score >= 70) return { label: "Good", color: "#3b82f6" };
    if (score >= 50) return { label: "Possible", color: "#f59e0b" };
    return { label: "Unlikely", color: "#ef4444" };
}

exports.getMatchScore = async (req, res) => {
    try {
        const { jobId } = req.params;

        // ⚠️ Replace with actual DB vectors later
        const userVector = [0.9, 0.8, 0.7, 0.6];
        const jobVector = [0.8, 0.7, 0.6, 0.5];

        const similarity = cosineSimilarity(userVector, jobVector);
        const percentage = Math.round(similarity * 100);

        const tier = getTier(percentage);

        // Plain-language summary
        let summary = "";
        if (percentage >= 85)
            summary = "Your profile is an excellent match for this role.";
        else if (percentage >= 70)
            summary = "You are a strong candidate with good alignment.";
        else if (percentage >= 50)
            summary = "You meet some requirements but improvements are needed.";
        else
            summary = "This role may not be the best fit right now.";

        res.json({
            score: percentage,
            tier,
            summary
        });

    } catch (error) {
        res.status(500).json({ error: "Error calculating match score" });
    }
};