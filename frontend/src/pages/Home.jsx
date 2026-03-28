import { useState, useMemo } from 'react'
import FeatureCard from '../components/FeatureCard'
import { DAY1_FEATURES, DIFFICULTY_ORDER } from '../data/features'

const CATEGORIES = ['All', ...Array.from(new Set(DAY1_FEATURES.map(f => f.category)))]
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Home() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [sort, setSort]           = useState('id') // 'id' | 'difficulty'

  const filtered = useMemo(() => {
    return DAY1_FEATURES
      .filter(f => {
        const matchSearch =
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          f.description.toLowerCase().includes(search.toLowerCase()) ||
          f.id.toLowerCase().includes(search.toLowerCase())
        const matchCat  = category   === 'All' || f.category   === category
        const matchDiff = difficulty === 'All' || f.difficulty === difficulty
        return matchSearch && matchCat && matchDiff
      })
      .sort((a, b) => {
        if (sort === 'difficulty') return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
        return a.id.localeCompare(b.id)
      })
  }, [search, category, difficulty, sort])

  return (
    <div style={{ minHeight: '100vh', background: '#060912', color: '#f1f5f9' }}>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.05); }
        }
        .feature-card {
          animation: fadeUp 0.45s ease both;
        }
        .filter-chip {
          transition: all 0.15s ease;
          cursor: pointer;
          border: none;
          font-family: 'JetBrains Mono', monospace;
        }
        .filter-chip:hover { opacity: 0.85; }
        input::placeholder { color: #475569; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6, 9, 18, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e293b',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo mark */}
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #0f766e, #7c3aed)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 800, color: '#fff',
            fontFamily: '"Syne", sans-serif',
          }}>S</div>
          <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '17px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            SenseHire
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, color: '#14b8a6',
            background: '#134e4a', border: '1px solid #0f766e',
            padding: '2px 7px', borderRadius: '20px',
            fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em',
          }}>
            OPEN SOURCE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#features" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>Features</a>
          <a href="https://github.com/YOUR_ORG/sensehire" target="_blank" rel="noreferrer"
            style={{
              color: '#f1f5f9', fontSize: '13px', textDecoration: 'none',
              background: '#1e293b', border: '1px solid #334155',
              padding: '6px 14px', borderRadius: '6px',
              fontFamily: '"JetBrains Mono", monospace', fontWeight: 500,
            }}>
            GitHub →
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 32px 72px', textAlign: 'center' }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(15,118,110,0.18) 0%, transparent 70%)', zIndex: 0, animation: 'pulse-ring 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '400px', height: '200px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          {/* Day badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: '12px', fontFamily: '"JetBrains Mono", monospace', color: '#4ade80', letterSpacing: '0.1em', fontWeight: 600 }}>
              DAY 1 — 15 FEATURES OPEN
            </span>
          </div>

          <h1 style={{
            margin: '0 0 20px',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            fontFamily: '"Syne", sans-serif',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #f1f5f9 30%, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Build the hiring platform<br />the world actually needs.
          </h1>

          <p style={{
            margin: '0 auto 36px',
            maxWidth: '560px',
            fontSize: '16px',
            color: '#64748b',
            lineHeight: 1.7,
            fontFamily: '"DM Sans", sans-serif',
          }}>
            SenseHire flips the traditional hiring model — using adaptive AI to bridge the accessibility gap before the first interview. Pick a feature. Build it. Raise a PR.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { value: '15', label: 'Features today' },
              { value: '6',  label: 'Categories' },
              { value: '3',  label: 'Difficulty levels' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#14b8a6', fontFamily: '"Syne", sans-serif', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', fontFamily: '"JetBrains Mono", monospace', marginTop: '4px', letterSpacing: '0.06em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '0 32px 64px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { step: '01', title: 'Pick a feature', desc: 'Browse the cards below. Click "View full spec" to read the requirements.' },
            { step: '02', title: 'Claim the issue', desc: 'Open the linked GitHub Issue and assign it to yourself.' },
            { step: '03', title: 'Build it', desc: 'Edit only the files listed. Follow the spec. Run the dev server.' },
            { step: '04', title: 'Raise a PR', desc: 'Branch: feature/F01-your-name. PR title must start with [F01].' },
          ].map(s => (
            <div key={s.step} style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '18px',
            }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#334155', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.1em' }}>
                STEP {s.step}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0', fontFamily: '"Syne", sans-serif', marginBottom: '6px' }}>
                {s.title}
              </div>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" style={{ padding: '0 32px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#0f766e', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '6px' }}>
              DAY 1 FEATURES
            </div>
            <h2 style={{ margin: 0, fontFamily: '"Syne", sans-serif', fontSize: '26px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              {filtered.length} feature{filtered.length !== 1 ? 's' : ''} available
            </h2>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: '#0d1526', border: '1px solid #1e293b',
              color: '#94a3b8', padding: '8px 12px', borderRadius: '7px',
              fontSize: '12px', fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
            }}
          >
            <option value="id">Sort: Feature ID</option>
            <option value="difficulty">Sort: Difficulty</option>
          </select>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <span style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            color: '#334155', fontSize: '14px', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search features, IDs, or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: '#0d1526',
              border: '1px solid #1e293b', borderRadius: '8px',
              padding: '11px 14px 11px 36px',
              color: '#e2e8f0', fontSize: '14px',
              fontFamily: '"DM Sans", sans-serif',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#0f766e'}
            onBlur={e => e.target.style.borderColor = '#1e293b'}
          />
        </div>

        {/* Filter chips row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {/* Category chips */}
          <span style={{ fontSize: '11px', color: '#334155', fontFamily: '"JetBrains Mono", monospace', alignSelf: 'center', marginRight: '4px' }}>
            CAT:
          </span>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className="filter-chip"
              onClick={() => setCategory(c)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                background: category === c ? '#0f766e' : '#0d1526',
                color: category === c ? '#ccfbf1' : '#475569',
                border: `1px solid ${category === c ? '#14b8a6' : '#1e293b'}`,
              }}
            >
              {c}
            </button>
          ))}

          <span style={{ fontSize: '11px', color: '#334155', fontFamily: '"JetBrains Mono", monospace', alignSelf: 'center', marginLeft: '8px', marginRight: '4px' }}>
            LEVEL:
          </span>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className="filter-chip"
              onClick={() => setDifficulty(d)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                background: difficulty === d ? '#1e3a5f' : '#0d1526',
                color: difficulty === d ? '#93c5fd' : '#475569',
                border: `1px solid ${difficulty === d ? '#3b82f6' : '#1e293b'}`,
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Card grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#334155' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⊘</div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}>No features match your filters.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '28px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
        background: '#060912',
      }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#1e293b' }}>
          SENSEHIRE © 2025 — OPEN SOURCE COMPETITION
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="https://github.com/YOUR_ORG/sensehire/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer"
            style={{ color: '#334155', fontSize: '12px', textDecoration: 'none', fontFamily: '"JetBrains Mono", monospace' }}>
            CONTRIBUTING.md
          </a>
          <a href="https://github.com/YOUR_ORG/sensehire/issues" target="_blank" rel="noreferrer"
            style={{ color: '#334155', fontSize: '12px', textDecoration: 'none', fontFamily: '"JetBrains Mono", monospace' }}>
            GitHub Issues
          </a>
        </div>
      </footer>
    </div>
  )
}