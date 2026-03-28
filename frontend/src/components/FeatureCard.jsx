import { useState } from 'react'

const COLOR_MAP = {
  teal:   { bg: '#0d2e2a', border: '#0f766e', accent: '#14b8a6', badge: '#134e4a', text: '#99f6e4' },
  purple: { bg: '#1e1233', border: '#7c3aed', accent: '#a78bfa', badge: '#2e1065', text: '#ddd6fe' },
  blue:   { bg: '#0c1a2e', border: '#1d4ed8', accent: '#60a5fa', badge: '#1e3a5f', text: '#bfdbfe' },
  amber:  { bg: '#2a1a00', border: '#b45309', accent: '#fbbf24', badge: '#451a03', text: '#fde68a' },
  coral:  { bg: '#2a0f0a', border: '#dc2626', accent: '#f87171', badge: '#450a0a', text: '#fecaca' },
  green:  { bg: '#0a1f0f', border: '#15803d', accent: '#4ade80', badge: '#14532d', text: '#bbf7d0' },
  pink:   { bg: '#2a0a1a', border: '#be185d', accent: '#f472b6', badge: '#4a0520', text: '#fbcfe8' },
}

const DIFFICULTY_STYLE = {
  Beginner:     { label: 'Beginner',     dot: '#4ade80' },
  Intermediate: { label: 'Intermediate', dot: '#fbbf24' },
  Advanced:     { label: 'Advanced',     dot: '#f87171' },
}

export default function FeatureCard({ feature, index }) {
  const [expanded, setExpanded] = useState(false)
  const c = COLOR_MAP[feature.color] || COLOR_MAP.teal
  const diff = DIFFICULTY_STYLE[feature.difficulty]

  const notAllowedList = Array.isArray(feature.notAllowed)
    ? feature.notAllowed
    : [feature.notAllowed]

  return (
    <div
      className="feature-card"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: '12px',
        padding: '0',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 12px 40px ${c.border}44`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Card Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${c.border}22` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          {/* ID badge */}
          <span style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '11px',
            fontWeight: 700,
            color: c.accent,
            background: c.badge,
            border: `1px solid ${c.border}`,
            padding: '3px 8px',
            borderRadius: '4px',
            letterSpacing: '0.08em',
            flexShrink: 0,
          }}>
            {feature.id}
          </span>

          {/* Difficulty */}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: '"JetBrains Mono", monospace',
            flexShrink: 0,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: diff.dot, display: 'inline-block' }} />
            {diff.label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 6px',
          fontSize: '17px',
          fontWeight: 700,
          color: '#f1f5f9',
          fontFamily: '"Syne", "DM Sans", sans-serif',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          {feature.title}
        </h3>

        {/* Category chip */}
        <span style={{
          fontSize: '10px',
          fontWeight: 600,
          color: c.text,
          background: `${c.accent}18`,
          border: `1px solid ${c.accent}40`,
          padding: '2px 8px',
          borderRadius: '20px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {feature.category}
        </span>
      </div>

      {/* Description */}
      <div style={{ padding: '14px 20px 0' }}>
        <p style={{
          margin: 0,
          fontSize: '13.5px',
          color: '#94a3b8',
          lineHeight: 1.65,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          {feature.description}
        </p>
      </div>

      {/* API warning banner */}
      {feature.apiNote && (
        <div style={{
          margin: '14px 20px 0',
          padding: '10px 12px',
          background: '#2a1500',
          border: '1px solid #b45309',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#fde68a',
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 1.5,
        }}>
          {feature.apiNote}
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          margin: '14px 20px 0',
          background: 'transparent',
          border: `1px solid ${c.border}66`,
          borderRadius: '6px',
          padding: '7px 12px',
          color: c.accent,
          fontSize: '12px',
          fontFamily: '"JetBrains Mono", monospace',
          cursor: 'pointer',
          transition: 'background 0.15s',
          width: 'calc(100% - 0px)',
          justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${c.accent}18`}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          display: 'inline-block',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>▾</span>
        {expanded ? 'Hide details' : 'View full spec'}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '16px 20px 0', animation: 'slideDown 0.2s ease' }}>
          {/* Expected output */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
              Expected output
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>
              {feature.expected}
            </p>
          </div>

          {/* Not allowed */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
              What NOT to do
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
              {notAllowedList.map((item, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#fca5a5', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif', marginBottom: '3px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Files to change */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
              Files to change
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {feature.files.map((f, i) => (
                <code key={i} style={{
                  display: 'block',
                  fontSize: '11.5px',
                  color: c.accent,
                  background: `${c.accent}0f`,
                  border: `1px solid ${c.border}40`,
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  wordBreak: 'break-all',
                }}>
                  {f}
                </code>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Claim button */}
      <div style={{ padding: '16px 20px 20px' }}>
        <a
          href={`https://github.com/YOUR_ORG/sensehire/issues/new?template=${feature.id.toLowerCase()}-${feature.title.toLowerCase().replace(/\s+/g, '-')}.yml`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            background: `linear-gradient(135deg, ${c.border}, ${c.accent}99)`,
            color: '#fff',
            borderRadius: '7px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: '"Syne", sans-serif',
            textDecoration: 'none',
            letterSpacing: '0.03em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Claim on GitHub →
        </a>
      </div>
    </div>
  )
}