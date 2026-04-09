import { useState, useEffect } from "react";
import "./f14.css";

export default function F14() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [customText, setCustomText] = useState("");
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  const getPageText = () => {
    const mainContent = document.querySelector("main") || document.body;
    const text = mainContent.innerText || mainContent.textContent;
    return text.trim();
  };

  const handleListen = (textToRead) => {
    if (!speechSupported) {
      alert("Text-to-Speech not supported in this browser");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const text = textToRead || customText || getPageText();

    if (!text) {
      alert(
        "No text to read. Please enter text or navigate to a page with content.",
      );
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!speechSupported) {
    return (
      <div className="f14-container">
        <div className="f14-error">
          <h2>Text-to-Speech Not Supported</h2>
          <p>Your browser doesn't support the Web Speech API.</p>
          <p>Try using Chrome, Edge, or Safari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="f14-container">
      <div className="f14-header">
        <h1>🔊 Text-to-Speech Reader</h1>
        <p>Listen to page content or custom text read aloud</p>
      </div>

      {/* Text Input Area */}
      <div className="f14-input-section">
        <h3>Enter Custom Text:</h3>
        <textarea
          className="f14-textarea"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Paste or type text here to have it read aloud..."
          rows="6"
        />

        <div className="f14-input-controls">
          <button
            onClick={() => handleListen(customText)}
            className="f14-btn f14-btn-primary"
            disabled={!customText.trim()}
          >
            🎧 Listen to Text
          </button>

          <button
            onClick={() => setCustomText("")}
            className="f14-btn f14-btn-secondary"
            disabled={!customText}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Speed Selector */}
      <div className="f14-speed-section">
        <h3>Reading Speed:</h3>
        <div className="f14-speed-buttons">
          {[0.5, 1.0, 1.5, 2.0].map((speedValue) => (
            <button
              key={speedValue}
              onClick={() => setSpeed(speedValue)}
              className={`f14-speed-btn ${speed === speedValue ? "active" : ""}`}
            >
              {speedValue}×
            </button>
          ))}
        </div>
        <p className="f14-speed-info">
          Current speed: {speed}× {speed === 1.0 && "(Normal)"}
        </p>
      </div>

      {/* Page Reader */}
      <div className="f14-page-section">
        <h3>Or Read Current Page:</h3>
        <button
          onClick={() => handleListen(null)}
          className="f14-btn f14-btn-primary"
        >
          📄 Read This Page
        </button>
      </div>

      {/* Floating Control Bar */}
      {isSpeaking && (
        <div className="f14-floating-controls">
          <div className="f14-floating-content">
            <span className="f14-status">
              {isPaused ? "⏸️ Paused" : "🔊 Speaking..."}
            </span>

            <div className="f14-floating-buttons">
              {!isPaused ? (
                <button
                  onClick={handlePause}
                  className="f14-floating-btn f14-btn-warning"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={handleListen}
                  className="f14-floating-btn f14-btn-primary"
                >
                  ▶️ Resume
                </button>
              )}

              <button
                onClick={handleStop}
                className="f14-floating-btn f14-btn-danger"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="f14-info">
        <h3>How to Use:</h3>
        <ol>
          <li>Enter custom text in the box above, OR</li>
          <li>Click "Read This Page" to hear the current page content</li>
          <li>Adjust reading speed using the speed buttons (0.5× to 2×)</li>
          <li>Use the floating controls to pause/resume/stop</li>
        </ol>

        <h3>Accessibility Benefits:</h3>
        <ul>
          <li>✅ Helps visually impaired users</li>
          <li>✅ Assists users with reading difficulties</li>
          <li>✅ Reduces eye strain</li>
          <li>✅ Enables hands-free browsing</li>
          <li>✅ Adjustable speed for comprehension</li>
        </ul>
      </div>

      {/* Demo Text */}
      <div className="f14-demo">
        <h3>Try This Demo Text:</h3>
        <p>
          SenseHire is revolutionizing accessible hiring. Instead of forcing
          candidates with disabilities to navigate a world built for the
          able-bodied, we use technology to match people to roles based on their
          actual abilities.
        </p>
        <button
          onClick={() => {
            const demoText =
              "SenseHire is revolutionizing accessible hiring. Instead of forcing candidates with disabilities to navigate a world built for the able-bodied, we use technology to match people to roles based on their actual abilities.";
            setCustomText(demoText);
          }}
          className="f14-btn f14-btn-secondary"
        >
          Load Demo Text
        </button>
      </div>
    </div>
  );
}
