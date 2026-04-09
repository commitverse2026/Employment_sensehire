import React, { useEffect, useRef, useState } from "react";
import "./f10.css";

const GAP_RULES = [
  {
    dimension: "auditory",
    keywords: ["hear", "hearing", "audio", "call", "phone", "verbal", "listen"],
    defaultSentence:
      "Job communication channels rely heavily on audio/phone interaction compared to candidate auditory ability.",
  },
  {
    dimension: "visual",
    keywords: ["visual", "vision", "blind", "screen", "read", "eyesight"],
    defaultSentence:
      "Job tasks require visual monitoring/reading compared to candidate visual ability.",
  },
  {
    dimension: "fineMotor",
    keywords: ["motor", "typing", "keyboard", "mouse", "hand", "dexterity"],
    defaultSentence:
      "Job tasks require sustained fine-motor input compared to candidate motor ability.",
  },
  {
    dimension: "cognitiveLoad",
    keywords: [
      "focus",
      "attention",
      "multitask",
      "memory",
      "cognitive",
      "complex",
    ],
    defaultSentence:
      "Job tasks require high sustained focus/cognitive load compared to candidate profile.",
  },
  {
    dimension: "verbalComm",
    keywords: ["speak", "speech", "presentation", "meeting", "communicate"],
    defaultSentence:
      "Job tasks require frequent spoken communication compared to candidate verbal comfort.",
  },
];

function analyzeInputToGap(inputText) {
  const normalized = inputText.toLowerCase();

  for (const rule of GAP_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        dimension: rule.dimension,
        plainLanguageSentence: inputText.trim(),
      };
    }
  }

  return {
    dimension: "general",
    plainLanguageSentence:
      inputText.trim() ||
      "Potential candidate-job accessibility mismatch detected.",
  };
}

export default function F10() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const activeControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="f10-skeleton-grid">
        {[1, 2].map((i) => (
          <div key={i} className="f10-skeleton-card">
            <div className="f10-skeleton f10-skeleton-title"></div>
            <div className="f10-skeleton f10-skeleton-text"></div>
            <div className="f10-skeleton f10-skeleton-tool"></div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="f10-error-card">
        <div className="f10-error-icon">⚠️</div>
        <div className="f10-error-content">
          <h4>AI recommendations unavailable</h4>
          <p className="f10-error-msg">{error}</p>
          <p className="f10-error-note">
            Please ensure Ollama is running locally and the model is pulled.
          </p>
          <p className="f10-error-assurance">
            All other features continue to work normally.
          </p>
        </div>
      </div>
    );
  } else if (!hasSubmitted) {
    content = (
      <p
        style={{
          color: "#94a3b8",
          padding: "1rem",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "8px",
        }}
      >
        Enter a gap description and click Analyze to request recommendations.
      </p>
    );
  } else if (!recommendations || recommendations.length === 0) {
    content = (
      <p
        style={{
          color: "#94a3b8",
          padding: "1rem",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "8px",
        }}
      >
        No recommendations could be generated for this input.
      </p>
    );
  } else {
    content = (
      <div className="f10-cards-grid">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="f10-fixit-card"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <div className="f10-card-header">
              <span className="f10-gap-badge">Target Gap</span>
              <p className="f10-gap-text">"{rec.gap}"</p>
            </div>

            <div className="f10-card-body">
              <p className="f10-suggestion">{rec.suggestion}</p>

              {rec.tool && (
                <a
                  href={rec.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f10-tool-link"
                >
                  <div className="f10-tool-info">
                    <span className="f10-tool-label">Recommended Tool</span>
                    <span className="f10-tool-name">{rec.tool}</span>
                  </div>
                  <div className="f10-tool-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleAnalyze = (e) => {
    e.preventDefault();
    const input = customInput.trim();

    if (!input) {
      setError("Please enter a gap before clicking Analyze.");
      setHasSubmitted(false);
      setRecommendations([]);
      return;
    }

    setError(null);
    setRecommendations([]);
    setHasSubmitted(true);

    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/recommendations", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gaps: [analyzeInputToGap(input)] }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error(
            `Proxy/Server Connection Failed (Status: ${response.status}). Please make sure you have restarted 'node server.js' to run on port 3001.`,
          );
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recommendations");
        }

        setRecommendations(data.suggestions || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  };

  return (
    <div className="f10-container">
      <h3 className="f10-heading">
        <span className="f10-heading-icon">✨</span>
        AI Recommendations
      </h3>

      <form
        onSubmit={handleAnalyze}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Describe a gap..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            fontSize: "15px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
        >
          Analyze
        </button>
      </form>

      {content}
    </div>
  );
}
