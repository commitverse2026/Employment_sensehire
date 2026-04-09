const RESOURCE_LIBRARY = {
  auditory: {
    suggestion:
      "Enable live captions and call transcripts for all meetings and phone-heavy workflows.",
    tool: "Otter.ai Live Transcription",
    link: "https://otter.ai/",
  },
  visual: {
    suggestion:
      "Provide screen-reader compatible workflows and high-contrast UI settings for task execution.",
    tool: "NVDA Screen Reader",
    link: "https://www.nvaccess.org/download/",
  },
  fineMotor: {
    suggestion:
      "Switch keyboard/mouse-heavy actions to voice dictation and shortcut-based automation.",
    tool: "Dragon Professional",
    link: "https://www.nuance.com/dragon.html",
  },
  cognitiveLoad: {
    suggestion:
      "Break complex tasks into checklists with focus intervals and reduced parallel interruptions.",
    tool: "Todoist",
    link: "https://todoist.com/",
  },
  verbalComm: {
    suggestion:
      "Offer asynchronous text-first communication and speech-assist options for meetings.",
    tool: "Microsoft Teams Live Captions",
    link: "https://support.microsoft.com/en-us/office/use-live-captions-in-microsoft-teams-meetings-4be2d304-f675-4b57-8347-cbd000a21260",
  },
  general: {
    suggestion:
      "Introduce an accessibility-first accommodation plan and validate it with the candidate before onboarding.",
    tool: "Job Accommodation Network (JAN)",
    link: "https://askjan.org/",
  },
};

const GENERIC_PHRASES = [
  "adaptive accessibility software",
  "ergonomic workspace equipment",
  "tailored directly to this physical requirement",
  "sensehire ai recommended tool",
];

function normalizeGap(gap) {
  return {
    dimension: gap?.dimension || "general",
    plainLanguageSentence:
      gap?.plainLanguageSentence ||
      "Potential candidate-job accessibility mismatch detected.",
  };
}

function fallbackSuggestions(gaps) {
  return gaps.map((gap) => {
    const normalizedGap = normalizeGap(gap);
    const resource =
      RESOURCE_LIBRARY[normalizedGap.dimension] || RESOURCE_LIBRARY.general;

    return {
      gap: normalizedGap.plainLanguageSentence,
      suggestion: resource.suggestion,
      tool: resource.tool,
      link: resource.link,
    };
  });
}

function isUsableUrl(link) {
  return typeof link === "string" && /^https:\/\//i.test(link);
}

function sanitizeSuggestions(rawSuggestions, sourceGaps) {
  if (!Array.isArray(rawSuggestions) || rawSuggestions.length === 0) {
    return fallbackSuggestions(sourceGaps);
  }

  return rawSuggestions.map((item, index) => {
    const srcGap = normalizeGap(sourceGaps[index] || sourceGaps[0] || {});
    const fallback =
      RESOURCE_LIBRARY[srcGap.dimension] || RESOURCE_LIBRARY.general;

    const suggestionText = String(item?.suggestion || "").trim();
    const isGeneric = GENERIC_PHRASES.some((phrase) =>
      suggestionText.toLowerCase().includes(phrase),
    );

    return {
      gap: String(item?.gap || srcGap.plainLanguageSentence).trim(),
      suggestion:
        suggestionText && !isGeneric ? suggestionText : fallback.suggestion,
      tool: String(item?.tool || fallback.tool).trim() || fallback.tool,
      link: isUsableUrl(item?.link) ? item.link : fallback.link,
    };
  });
}

exports.getRecommendations = async (req, res) => {
  let clientAborted = false;

  try {
    // 1. Validate incoming data
    const { gaps } = req.body;
    if (!gaps || !Array.isArray(gaps) || gaps.length === 0) {
      // If no gaps exist, return an empty set of suggestions gracefully
      return res.json({ suggestions: [] });
    }

    const normalizedGaps = gaps.map(normalizeGap);

    // 2. Assemble Prompt
    const prompt = `You are a workplace accessibility accommodations expert.

Input gaps (JSON):
${JSON.stringify(normalizedGaps, null, 2)}

Task:
- Return one accommodation per gap.
- Keep each recommendation specific to the exact gap text.
- Suggest real tools/resources only.
- Avoid vague advice.

Output format requirements:
- Return ONLY a valid JSON array.
- Each item must be:
  {
    "gap": "original gap statement",
    "suggestion": "specific and actionable accommodation",
    "tool": "real tool/resource name",
    "link": "https://..."
  }
- Links must be https URLs.
- Do not include markdown, extra keys, or commentary.`;

    // Abort upstream AI call only when the client truly aborts the request.
    const controller = new AbortController();
    req.on("aborted", () => {
      clientAborted = true;
      controller.abort();
    });

    // 3. API Request using Local or Hosted Ollama
    const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
    const apiKey = process.env.AI_API_KEY || process.env.OLLAMA_API_KEY || "";
    const isLocalProvider = /localhost|127\.0\.0\.1/i.test(baseUrl);

    if (!isLocalProvider && !apiKey) {
      return res.status(500).json({
        error:
          "AI_API_KEY is missing for remote AI provider. Add AI_API_KEY in backend/.env.",
      });
    }

    // Some Cloud Ollama providers require Bearer tokens!
    const fetchHeaders = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      fetchHeaders["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      signal: controller.signal,
      headers: fetchHeaders,
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.2",
        system:
          "You are a precise workplace accessibility expert that only outputs JSON data.",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Highly deterministic sampling speeds up generation
          num_predict: 300, // Cap the maximal generation length so it doesn't ramble
        },
      }),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errData = await response.json();
        if (errData.error) errorMsg = errData.error;
      } catch (e) {}
      return res.status(500).json({ error: `Ollama error: ${errorMsg}` });
    }

    const data = await response.json();

    if (data.error) {
      console.error("Ollama API Error:", data.error);
      return res
        .status(500)
        .json({ error: data.error || "Ollama provider error" });
    }

    try {
      if (!data.response) {
        throw new Error("Ollama returned no content response");
      }
      let textResponse = data.response;
      console.log("--- RAW LLAma3.2 RESPONSE ---", textResponse);

      let suggestions = [];
      // Fallback JSON extraction regex incase the model talks around the JSON payload
      const arrayMatch = textResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (arrayMatch) {
        suggestions = JSON.parse(arrayMatch[0]);
      } else {
        // Attempt full parse just in case it's an object or unformatted
        textResponse = textResponse
          .replace(/^```[a-z]*\s*/i, "")
          .replace(/```$/s, "")
          .trim();
        suggestions = JSON.parse(textResponse);

        if (!Array.isArray(suggestions)) {
          if (suggestions.suggestions) {
            suggestions = suggestions.suggestions;
          } else {
            suggestions = [suggestions];
          }
        }
      }

      return res.json({
        suggestions: sanitizeSuggestions(suggestions, normalizedGaps),
      });
    } catch (parseErr) {
      console.error("Failed to parse AI response:", parseErr);
      return res.json({ suggestions: fallbackSuggestions(normalizedGaps) });
    }
  } catch (error) {
    if (error.name === "AbortError") {
      if (clientAborted) {
        console.log("Ollama request aborted by client");
        return;
      }
      if (!res.headersSent) {
        return res.status(500).json({
          error: "AI request was aborted before completion.",
        });
      }
      return;
    }
    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        error:
          "Connection to local Ollama refused. Is Ollama running on port 11434?",
      });
    }
    console.error("F10 Recommendation Internal Error:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve recommendations correctly." });
  }
};
