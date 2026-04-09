const fs = require('fs');
const path = require('path');

const getSortedApplicants = async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/candidates.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const candidates = JSON.parse(rawData);

        // Map your specific JSON keys to a standard format for the UI
        const processed = candidates.map(c => ({
            id: c.id,
            name: c.fullName, // Mapping fullName to name
            role: c.preferredRoles ? c.preferredRoles[0] : "Applicant",
            location: c.location,
            // Convert profileComplete (e.g. 95) to a 0-1 score (0.95)
            score: c.profileComplete ? c.profileComplete / 100 : 0
        }));

        // Tier 1 Sorting Algorithm: Sort by score descending
        processed.sort((a, b) => b.score - a.score);

        res.status(200).json(processed);
    } catch (error) {
        console.error("Sorting Error:", error);
        res.status(500).json({ message: "Error processing candidate data" });
    }
};

module.exports = { getSortedApplicants };