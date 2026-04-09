import React, { useState, useEffect, useRef } from 'react';
import './f14.css';

export default function F14() {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);

  // Load available system voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices.name);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  const handleListen = () => {
    if (!text) return;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set Voice
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    // Set Rate
    utterance.rate = rate;

    // Events
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const togglePause = () => {
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
    } else {
      synth.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="tts-container">
      <h2>Text-to-Speech Reader</h2>
      
      <div className="input-group">
        <textarea
          placeholder="Enter text to read aloud..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="8"
        />
      </div>

      <div className="settings-row">
        <div className="setting-item">
          <label>Voice:</label>
          <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label>Speed:</label>
          <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>
            <option value="0.5">0.5×</option>
            <option value="1">1× (Normal)</option>
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
          </select>
        </div>
      </div>

      <button className="listen-btn" onClick={handleListen} disabled={!text}>
        Listen
      </button>

      {/* Floating Control Bar */}
      {isSpeaking && (
        <div className="floating-controls">
          <div className="status-dot"></div>
          <span className="status-text">{isPaused ? 'Paused' : 'Reading...'}</span>
          <div className="control-buttons">
            <button onClick={togglePause}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={handleStop} className="stop-btn">
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}