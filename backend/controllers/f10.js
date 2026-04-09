const axios = require("axios");
// 🔥 Strong prompt builder
function buildPrompt(gaps = []) {
  return `
You are an accessibility expert.

User ability gaps:
${gaps.map((g, i) => `${i + 1}. ${g}`).join("\n")}

Generate at least 3 helpful and practical suggestions.

Return ONLY a valid JSON array in this format:

[
  {
    "title": "Short clear title",
    "description": "Actionable suggestion in 1-2 lines",
    "gap": "Which gap it solves",
    "link": "https://relevant-resource.com"
  }
]

Rules:
- Minimum 3 suggestions
- No empty array
- No explanation
- No text outside JSON
`;
}

exports.getRecommendations = async (req, res) => {
  try {
    const { gaps } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        error: "API key missing",
      });
    }

    const prompt = buildPrompt(gaps);

    const response = await axios.post(
  "https://api.openai.com/v1/chat/completions",
  {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  },
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    timeout: 10000, // 🔥 prevents hanging
  }
);

const data = response.data;
    console.log("AI RAW RESPONSE:", data);

    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        error: "No AI response received",
      });
    }

    // 🔥 Clean markdown if AI wraps JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.log("❌ PARSE ERROR, RAW TEXT:", text);

      return res.status(500).json({
        error: "AI returned invalid JSON",
      });
    }

    // 🔥 Fallback if AI returns empty
    if (!parsed || parsed.length === 0) {
      return res.json({
        suggestions: [
          {
            title: "Improve Accessibility Setup",
            description:
              "Use assistive tools like screen readers, captions, or voice input depending on your needs.",
            gap: gaps[0] || "general",
            link: "https://www.w3.org/WAI/",
          },
          {
            title: "Enable Assistive Features",
            description:
              "Turn on built-in accessibility settings like captions, high contrast mode, or text scaling.",
            gap: gaps[0] || "general",
            link: "https://support.google.com/accessibility/",
          },
          {
            title: "Use Specialized Tools",
            description:
              "Explore tools like speech-to-text, screen magnifiers, or ergonomic input devices.",
            gap: gaps[0] || "general",
            link: "https://abilitynet.org.uk/",
          },
        ],
      });
    }

    res.json({ suggestions: parsed });
  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({ error: "AI request failed" });
  }
};