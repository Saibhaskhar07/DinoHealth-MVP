'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

// ─── THEME ────────────────────────────────────────────────────────────────────
const t = {
  primary: '#0A6E6E',
  primaryLight: '#E6F4F4',
  primaryDark: '#064F4F',
  accent: '#00C4A1',
  accentLight: '#E6FAF7',
  bg: '#F4F7F6',
  card: '#FFFFFF',
  text: '#0D1F2D',
  muted: '#6B7F8E',
  border: '#E2EAF0',
  danger: '#E05050',
  dangerLight: '#FDF0F0',
  warning: '#F5A623',
  warningLight: '#FEF8EC',
  success: '#22A06B',
  successLight: '#EAFAF3',
  sidebar: '#053d3d',
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    flask: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6m-6 0v6l-4 9a1 1 0 001 1.5h10a1 1 0 001-1.5l-4-9V3"/></svg>,
    video: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    results: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    file: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>,
    spin: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  }
  return icons[name] || null
}

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const getResults = (userId) => {
  try {
    const raw = localStorage.getItem(`dino_results_${userId}`)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveResult = (userId, result) => {
  try {
    const existing = getResults(userId)
    const updated = [result, ...existing].slice(0, 20)
    localStorage.setItem(`dino_results_${userId}`, JSON.stringify(updated))
    return updated
  } catch { return [] }
}

const computeHealthScore = (results) => {
  if (!results.length) return null
  const latest = results[0]
  if (latest.score !== undefined) return latest.score
  return latest.hasFlags ? 72 : 88
}

// ─── MINI TREND CHART ─────────────────────────────────────────────────────────
const TrendChart = ({ results }) => {
  if (results.length < 2) return null
  const scores = results.slice(0, 6).reverse().map((r) => ({
    score: r.score !== undefined ? r.score : (r.normalCount && r.markerCount ? Math.round((r.normalCount / r.markerCount) * 100) : 78),
    label: new Date(r.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
  }))

  const max = 100, min = 50
  const w = 400, h = 120, padL = 32, padR = 16, padT = 12, padB = 28
  const xStep = (w - padL - padR) / Math.max(scores.length - 1, 1)
  const yScale = (v) => padT + ((max - v) / (max - min)) * (h - padT - padB)

  const pts = scores.map((s, i) => ({ x: padL + i * xStep, y: yScale(s.score), ...s }))
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${path} L ${pts[pts.length-1].x} ${h - padB} L ${pts[0].x} ${h - padB} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.primary} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={t.primary} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trendGrad)"/>
      <path d={path} fill="none" stroke={t.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={t.primary} strokeWidth="2"/>
          <text x={p.x} y={h - 6} textAnchor="middle" fontSize="10" fill={t.muted}>{p.label}</text>
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill={t.primary}>{p.score}</text>
        </g>
      ))}
    </svg>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ setScreen, user, results }) => {
  const score = computeHealthScore(results) || 87
  const firstName = user?.username || user?.firstName || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const recentResults = results.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)`, borderRadius: 20, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}/>
        <div style={{ position: 'absolute', right: 40, bottom: -60, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{greeting}</p>
            <h1 style={{ margin: '0 0 20px', fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>{firstName} 👋</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 800, color: '#fff', letterSpacing: -2, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>/100</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Health Score</p>
          </div>
          <div style={{ background: t.accent, borderRadius: 12, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#fff' }}>
            {score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Attention'}
          </div>
        </div>
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: t.accent, borderRadius: 8, transition: 'width 1s ease' }}/>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: 'ai', label: 'Explain Results', sub: 'Upload a PDF', screen: 'ai', color: '#FFF3E6', iconColor: '#F57C00' },
          { icon: 'flask', label: 'Book a Test', sub: 'Find a lab', screen: 'book', color: t.primaryLight, iconColor: t.primary },
          { icon: 'video', label: 'See a GP', sub: 'Telehealth now', screen: 'telehealth', color: '#EEF2FF', iconColor: '#4F6EF7' },
          { icon: 'results', label: 'My Results', sub: 'View history', screen: 'results', color: t.accentLight, iconColor: t.accent },
        ].map((item) => (
          <div key={item.label}
            style={{ background: t.card, borderRadius: 16, padding: '20px', cursor: 'pointer', border: `1px solid ${t.border}`, transition: 'all 0.15s' }}
            onClick={() => setScreen(item.screen)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,110,110,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ background: item.color, borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Icon name={item.icon} size={20} color={item.iconColor}/>
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text }}>{item.label}</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: t.muted }}>{item.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent results */}
        <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Recent Results</h3>
            <button onClick={() => setScreen('results')} style={{ background: 'none', border: 'none', fontSize: 13, color: t.primary, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>View all →</button>
          </div>
          {recentResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Icon name="file" size={32} color={t.border}/>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: t.muted }}>No results yet. Upload your first PDF.</p>
              <button onClick={() => setScreen('ai')} style={{ marginTop: 12, background: t.primaryLight, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: t.primary, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Upload PDF</button>
            </div>
          ) : recentResults.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentResults.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.hasFlags ? t.warning : t.success, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}>{r.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: t.muted }}>{new Date(r.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: r.hasFlags ? t.warningLight : t.successLight, color: r.hasFlags ? t.warning : t.success }}>
                {r.hasFlags ? 'Review' : 'Normal'}
              </span>
            </div>
          ))}
        </div>

        {/* Health trend */}
        <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>Health Trend</h3>
            <span style={{ fontSize: 12, color: t.muted }}>Last {Math.min(results.length, 6)} uploads</span>
          </div>
          {results.length < 2 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Icon name="trend" size={32} color={t.border}/>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: t.muted }}>Upload 2+ results to see your health trend over time.</p>
            </div>
          ) : <TrendChart results={results}/>}
        </div>
      </div>
    </div>
  )
}

// ─── AI EXPLAINER ─────────────────────────────────────────────────────────────
const AIExplainer = ({ setScreen, userId, onNewResult }) => {
  const [mode, setMode] = useState('upload')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setErrorMsg(null) }
    else setErrorMsg('Please upload a PDF file.')
  }

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  const handleSubmit = async () => {
    if (!file) return
    setMode('loading')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/explain', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Something went wrong.')
      setResult(data.explanation)

      const explanation = data.explanation
      const lower = explanation.toLowerCase()

      // Tiered severity scoring
      // Each pattern group deducts a different amount from base score of 95
      const borderlinePatterns = [/borderline/gi, /slightly (low|high|elevated|reduced)/gi, /mildly (low|high|elevated|reduced)/gi, /just (below|above)/gi, /low[- ]normal/gi]
      const mildPatterns = [/below (the )?normal range/gi, /above (the )?normal range/gi, /outside (the )?normal range/gi, /\blow\b(?! normal)/gi, /\bhigh\b(?! normal)/gi, /elevated/gi, /deficien/gi, /reduced/gi]
      const severePatterns = [/significantly (low|high|elevated|reduced|below|above)/gi, /markedly/gi, /severely/gi, /critically/gi, /very (low|high)/gi, /dangerously/gi, /well (below|above)/gi]

      const countMatches = (patterns, text) => patterns.reduce((acc, p) => acc + (text.match(p) || []).length, 0)

      const borderlineCount = countMatches(borderlinePatterns, explanation)
      const mildCount = Math.max(0, countMatches(mildPatterns, explanation) - borderlineCount)
      const severeCount = countMatches(severePatterns, explanation)

      const hasFlags = borderlineCount > 0 || mildCount > 0 || severeCount > 0

      // Deductions: borderline -5, mild -10, severe -20
      const totalDeduction = (borderlineCount * 5) + (mildCount * 10) + (severeCount * 20)
      const score = Math.max(30, Math.min(98, 95 - totalDeduction))

      const totalMarkers = Math.max((explanation.match(/###/g) || []).length, 3)
      const normalCount = totalMarkers - borderlineCount - mildCount - severeCount

      const saved = saveResult(userId, {
        name: file.name.replace('.pdf', '').replace(/-|_/g, ' '),
        date: new Date().toISOString(),
        markerCount: totalMarkers,
        normalCount: Math.max(0, normalCount),
        hasFlags,
        score,
        explanation: data.explanation,
      })
      onNewResult(saved)
      setMode('result')
    } catch (err) {
      setErrorMsg(err.message)
      setMode('error')
    }
  }

  const reset = () => { setFile(null); setResult(null); setErrorMsg(null); setMode('upload') }

  const renderInline = (text) => text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i} style={{ fontWeight: 700 }}>{p.slice(2, -2)}</strong> : p
  )

  const renderMarkdown = (text) => text.split('\n').map((line, i) => {
    const l = line.trim()
    if (!l) return <div key={i} style={{ height: 6 }}/>
    if (l.startsWith('### ')) return <p key={i} style={{ fontSize: 14, fontWeight: 700, color: t.primary, margin: '12px 0 4px' }}>{l.replace(/^###\s+/, '')}</p>
    if (l.startsWith('## ')) return <p key={i} style={{ fontSize: 15, fontWeight: 800, color: t.text, margin: '14px 0 6px' }}>{l.replace(/^##\s+/, '')}</p>
    if (l.startsWith('- ') || l.startsWith('* ')) return (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
        <span style={{ color: t.primary, fontWeight: 700, flexShrink: 0 }}>•</span>
        <span style={{ fontSize: 14, color: t.text, lineHeight: 1.6 }}>{renderInline(l.slice(2))}</span>
      </div>
    )
    return <p key={i} style={{ fontSize: 14, color: t.text, lineHeight: 1.65, marginBottom: 5 }}>{renderInline(l)}</p>
  })

  const parseSections = (text) => {
    const sections = []
    const parts = text.split(/\n(?=SUMMARY|YOUR MARKERS|WHAT TO DO NEXT|DISCLAIMER)/)
    parts.forEach(part => {
      const lines = part.trim().split('\n')
      const title = lines[0].trim()
      const content = lines.slice(1).join('\n').trim()
      if (title && content) sections.push({ title, content })
    })
    return sections.length > 0 ? sections : [{ title: 'Your Results Explained', content: text }]
  }

  const sectionColors = {
    'SUMMARY': { bg: t.primaryDark, border: t.primary, titleColor: t.accentLight, dark: true },
    'YOUR MARKERS': { bg: t.card, border: t.border, titleColor: t.primary },
    'WHAT TO DO NEXT': { bg: t.primaryLight, border: '#cce6da', titleColor: t.primary },
    'DISCLAIMER': { bg: '#f7faf8', border: t.border, titleColor: t.muted },
  }

  if (mode === 'loading') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ background: t.primaryLight, borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, animation: 'spin 1.5s linear infinite' }}>
        <Icon name="spin" size={36} color={t.primary}/>
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: t.text }}>Analysing your results...</h3>
      <p style={{ fontSize: 15, color: t.muted }}>Claude AI is reading every marker. About 15 seconds.</p>
    </div>
  )

  if (mode === 'error') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
      <div style={{ background: t.dangerLight, borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Icon name="alert" size={36} color={t.danger}/>
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: t.text }}>Something went wrong</h3>
      <p style={{ fontSize: 15, color: t.muted, marginBottom: 28 }}>{errorMsg}</p>
      <button onClick={reset} style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Try Again</button>
    </div>
  )

  if (mode === 'result' && result) {
    const sections = parseSections(result)
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>Your Results Explained</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted }}>{file?.name} · Saved to your history</p>
          </div>
          <button onClick={reset} style={{ background: t.primaryLight, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: t.primary, cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Upload another
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {sections.map((section, i) => {
            const s = sectionColors[section.title] || { bg: t.card, border: t.border, titleColor: t.primary }
            return (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: '20px 24px', gridColumn: section.title === 'YOUR MARKERS' ? 'span 2' : 'span 1' }}>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: s.titleColor, marginBottom: 12 }}>{section.title}</p>
                <div style={{ color: s.dark ? '#e8f7f1' : t.text }}>{renderMarkdown(section.content)}</div>
              </div>
            )
          })}
        </div>
        <div style={{ background: t.primaryDark, borderRadius: 16, padding: '28px', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>Want to discuss these results?</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Book a 10-minute telehealth GP consult with a Medicare rebate</p>
          </div>
          <button onClick={() => setScreen('telehealth')} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Book a GP →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: t.text }}>AI Results Explainer</h2>
      <p style={{ margin: '0 0 28px', fontSize: 15, color: t.muted }}>Upload your pathology PDF and Claude AI will translate every marker into plain English.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
          style={{ border: `2px dashed ${dragging ? t.primary : file ? t.primary : t.border}`, borderRadius: 20, padding: '48px 32px', textAlign: 'center', background: dragging ? t.primaryLight : file ? '#f0faf6' : '#f7faf8', cursor: file ? 'default' : 'pointer', transition: 'all 0.2s' }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])}/>
          {file ? (
            <div>
              <div style={{ background: t.primaryLight, borderRadius: 14, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon name="file" size={28} color={t.primary}/>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: t.primary, marginBottom: 4 }}>{file.name}</p>
              <p style={{ fontSize: 13, color: t.muted, marginBottom: 18 }}>{(file.size / 1024).toFixed(1)} KB · Ready to analyse</p>
              <button onClick={(e) => { e.stopPropagation(); reset() }} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 16px', fontSize: 12, color: t.muted, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
            </div>
          ) : (
            <div>
              <div style={{ background: t.primaryLight, borderRadius: 14, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon name="upload" size={28} color={t.primary}/>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 6 }}>Drop your PDF here</p>
              <p style={{ fontSize: 13, color: t.muted }}>or click to browse files</p>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: '20px' }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: t.text }}>What happens next</p>
            {[
              'Claude AI reads every marker in your PDF',
              'Each result is explained in plain English',
              'Flagged markers are highlighted for your GP',
              'Results are saved to your history',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ background: t.primaryLight, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: t.primary }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: 13, color: t.muted, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
          <div style={{ background: t.primaryLight, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
            <Icon name="alert" size={16} color={t.primary}/>
            <p style={{ margin: 0, fontSize: 12, color: t.primary, fontWeight: 600, lineHeight: 1.5 }}>Education tool only — not a medical diagnosis. Always discuss results with your GP.</p>
          </div>
          {errorMsg && (
            <div style={{ background: t.dangerLight, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10 }}>
              <Icon name="alert" size={16} color={t.danger}/>
              <p style={{ margin: 0, fontSize: 13, color: t.danger, fontWeight: 500 }}>{errorMsg}</p>
            </div>
          )}
          <button onClick={handleSubmit} disabled={!file} style={{ background: file ? t.primary : '#ccc', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, cursor: file ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            {file ? 'Explain My Results →' : 'Select a PDF to continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── RESULTS HISTORY ──────────────────────────────────────────────────────────
const ResultsHistory = ({ setScreen, results, userId, onUpdate }) => {
  const [expanded, setExpanded] = useState(null)

  const handleDelete = (index) => {
    const updated = results.filter((_, i) => i !== index)
    localStorage.setItem(`dino_results_${userId}`, JSON.stringify(updated))
    onUpdate(updated)
    if (expanded === index) setExpanded(null)
  }

  const renderInline = (text) => text.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p
  )

  const renderMd = (text) => text.split('\n').map((line, i) => {
    const l = line.trim()
    if (!l) return <div key={i} style={{ height: 6 }}/>
    if (l.startsWith('### ')) return <p key={i} style={{ fontSize: 13, fontWeight: 700, color: t.primary, margin: '10px 0 3px' }}>{l.replace(/^###\s+/, '')}</p>
    if (l.startsWith('## ')) return <p key={i} style={{ fontSize: 14, fontWeight: 800, color: 'inherit', margin: '12px 0 4px' }}>{l.replace(/^##\s+/, '')}</p>
    if (l.startsWith('- ') || l.startsWith('* ')) return (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        <span style={{ color: t.primary, fontWeight: 700, flexShrink: 0 }}>•</span>
        <span style={{ fontSize: 13, lineHeight: 1.6, color: 'inherit' }}>{renderInline(l.slice(2))}</span>
      </div>
    )
    return <p key={i} style={{ fontSize: 13, lineHeight: 1.65, marginBottom: 4, color: 'inherit' }}>{renderInline(l)}</p>
  })

  const parseSections = (text) => {
    const parts = text.split(/\n(?=SUMMARY|YOUR MARKERS|WHAT TO DO NEXT|DISCLAIMER)/)
    return parts.map(p => {
      const ls = p.trim().split('\n')
      return { title: ls[0].trim(), content: ls.slice(1).join('\n').trim() }
    }).filter(s => s.title && s.content)
  }

  const sectionColors = {
    'SUMMARY': { bg: t.primaryDark, border: t.primary, tc: t.accentLight, dark: true },
    'YOUR MARKERS': { bg: t.card, border: t.border, tc: t.primary },
    'WHAT TO DO NEXT': { bg: t.primaryLight, border: '#cce6da', tc: t.primary },
    'DISCLAIMER': { bg: '#f7faf8', border: t.border, tc: t.muted },
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>My Results</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: t.muted }}>{results.length} results stored · All explained in plain English</p>
        </div>
        <button onClick={() => setScreen('ai')} style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Upload New
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { value: results.length, label: 'Total uploads', color: t.primary },
          { value: results.filter(r => !r.hasFlags).length, label: 'All normal', color: t.success },
          { value: results.filter(r => r.hasFlags).length, label: 'Need review', color: t.warning },
        ].map(({ value, label, color }) => (
          <div key={label} style={{ background: t.card, borderRadius: 16, padding: '20px 24px', border: `1px solid ${t.border}` }}>
            <p style={{ margin: 0, fontSize: 36, fontWeight: 800, color }}>{value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: t.muted }}>{label}</p>
          </div>
        ))}
      </div>

      {results.length === 0 ? (
        <div style={{ background: t.card, borderRadius: 16, padding: '60px', textAlign: 'center', border: `1px solid ${t.border}` }}>
          <Icon name="file" size={48} color={t.border}/>
          <p style={{ margin: '16px 0 8px', fontSize: 18, fontWeight: 700, color: t.text }}>No results yet</p>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: t.muted }}>Upload your first pathology PDF to get started.</p>
          <button onClick={() => setScreen('ai')} style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Upload PDF →</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map((r, i) => (
            <div key={i} style={{ background: t.card, borderRadius: 16, border: `1px solid ${expanded === i ? t.primary : t.border}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              {/* Result row */}
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: r.hasFlags ? t.warningLight : t.successLight, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="results" size={22} color={r.hasFlags ? t.warning : t.success}/>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text }}>{r.name}</p>
                  <p style={{ margin: '3px 0 4px', fontSize: 12, color: t.muted }}>
                    {new Date(r.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    {r.markerCount ? ` · ${r.markerCount} markers` : ''}
                  </p>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, background: r.hasFlags ? t.warningLight : t.successLight, color: r.hasFlags ? t.warning : t.success }}>
                    {r.hasFlags ? 'Needs Review' : 'All Normal'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {r.explanation && (
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      style={{ background: expanded === i ? t.primary : t.primaryLight, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: expanded === i ? '#fff' : t.primary, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {expanded === i ? 'Hide report ↑' : 'View AI report ↓'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(i)} style={{ background: t.dangerLight, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: t.danger, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Delete</button>
                </div>
              </div>

              {/* Expanded AI explanation */}
              {expanded === i && r.explanation && (
                <div style={{ borderTop: `1px solid ${t.border}`, padding: '24px', background: '#fafcfb' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {parseSections(r.explanation).map((section, si) => {
                      const s = sectionColors[section.title] || { bg: t.card, border: t.border, tc: t.primary }
                      return (
                        <div key={si} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '16px 20px', gridColumn: section.title === 'YOUR MARKERS' ? 'span 2' : 'span 1' }}>
                          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: s.tc, marginBottom: 10 }}>{section.title}</p>
                          <div style={{ color: s.dark ? '#e8f7f1' : t.text }}>{renderMd(section.content)}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ background: t.primaryDark, borderRadius: 12, padding: '18px 20px', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>Want to discuss these results with a GP?</p>
                    <button onClick={() => setScreen('telehealth')} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      Book a GP →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {results.length >= 2 && (
        <div style={{ background: t.card, borderRadius: 16, padding: '24px', marginTop: 20, border: `1px solid ${t.border}` }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: t.text }}>Health Score Trend</h3>
          <TrendChart results={results}/>
        </div>
      )}
    </div>
  )
}

// ─── BOOK A TEST ──────────────────────────────────────────────────────────────
const BookTest = ({ setScreen }) => {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(1)

  const tests = [
    { id: 1, name: 'Full Blood Count', time: '24-48 hrs', price: '$45', popular: true },
    { id: 2, name: 'Allergy Panel', time: '3-5 days', price: '$89', popular: false },
    { id: 3, name: 'Hormone Check', time: '2-3 days', price: '$120', popular: true },
    { id: 4, name: 'Vitamin & Deficiency', time: '24-48 hrs', price: '$65', popular: false },
    { id: 5, name: 'STI Screen', time: '24 hrs', price: '$79', popular: false },
    { id: 6, name: 'Thyroid Function', time: '2-3 days', price: '$55', popular: false },
  ]

  if (step === 2) {
    const test = tests.find(t => t.id === selected)
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => setStep(1)} style={{ background: t.primaryLight, border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 14, color: t.primary, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>Confirm Booking</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 18, fontWeight: 700, color: t.text }}>{test.name}</h3>
            {[
              { label: 'Location', value: 'SA Pathology, Rundle Mall' },
              { label: 'Date', value: 'Thursday, 27 Mar 2025' },
              { label: 'Time', value: '9:00 AM' },
              { label: 'GP Referral', value: 'Included (telehealth)' },
              { label: 'Medicare Rebate', value: 'Applicable ✓' },
              { label: 'Total after rebate', value: test.price },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
                <span style={{ fontSize: 14, color: t.muted }}>{label}</span>
                <span style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
            <button onClick={() => setStep(3)} style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', width: '100%', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 20 }}>Confirm & Book</button>
          </div>
          <div style={{ background: t.primaryLight, borderRadius: 16, padding: '24px' }}>
            <p style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: t.primary }}>What's included</p>
            {['GP referral issued automatically', 'SA Pathology notified', 'Results sent to your Dino app', 'AI explanation ready on results day'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <Icon name="check" size={16} color={t.success}/>
                <span style={{ fontSize: 13, color: t.text }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
      <div style={{ background: t.successLight, borderRadius: '50%', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Icon name="check" size={40} color={t.success}/>
      </div>
      <h2 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800, color: t.text }}>You're booked!</h2>
      <p style={{ fontSize: 15, color: t.muted, marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>Your appointment is confirmed. We'll remind you the night before and handle your referral automatically.</p>
      <button onClick={() => { setStep(1); setSelected(null) }} style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Back to Booking</button>
    </div>
  )

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: t.text }}>Book a Test</h2>
      <p style={{ margin: '0 0 24px', fontSize: 15, color: t.muted }}>No referral needed — we handle it for you.</p>
      <div style={{ background: t.primaryLight, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Icon name="location" size={16} color={t.primary}/>
        <span style={{ fontSize: 14, color: t.primary, fontWeight: 600 }}>Nearest lab: SA Pathology, Rundle Mall (0.8km)</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {tests.map(test => (
          <div key={test.id}
            style={{ background: t.card, borderRadius: 14, padding: '18px', cursor: 'pointer', border: `2px solid ${selected === test.id ? t.primary : t.border}`, transition: 'all 0.15s' }}
            onClick={() => setSelected(test.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ background: selected === test.id ? t.primary : t.primaryLight, borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="flask" size={18} color={selected === test.id ? '#fff' : t.primary}/>
              </div>
              {test.popular && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: t.accentLight, color: t.accent, fontWeight: 700 }}>Popular</span>}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: t.text }}>{test.name}</p>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: t.muted }}>Results in {test.time}</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: t.primary }}>{test.price}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={() => selected && setStep(2)} disabled={!selected} style={{ background: selected ? t.primary : '#ccc', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─── TELEHEALTH ───────────────────────────────────────────────────────────────
const Telehealth = () => {
  const [selected, setSelected] = useState(null)
  const [booked, setBooked] = useState(false)

  const doctors = [
    { id: 1, name: 'Dr. Sarah Chen', specialty: 'General Practice', rating: 4.9, reviews: 312, wait: 'Now', avatar: 'SC' },
    { id: 2, name: 'Dr. Marcus Webb', specialty: 'General Practice', rating: 4.8, reviews: 189, wait: '12 min', avatar: 'MW' },
    { id: 3, name: 'Dr. Priya Nair', specialty: "Women's Health", rating: 5.0, reviews: 94, wait: '25 min', avatar: 'PN' },
  ]

  if (booked) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
      <div style={{ background: '#EEF2FF', borderRadius: '50%', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Icon name="video" size={40} color="#4F6EF7"/>
      </div>
      <h2 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 800, color: t.text }}>Consult confirmed!</h2>
      <p style={{ fontSize: 15, color: t.muted, marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>Your GP will issue your referral during the consult. Results will flow back to your Dino app automatically.</p>
      <div style={{ background: '#EEF2FF', borderRadius: 16, padding: '24px 48px', marginBottom: 24 }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: '#4F6EF7', fontWeight: 700, textTransform: 'uppercase' }}>Joining in</p>
        <p style={{ margin: 0, fontSize: 48, fontWeight: 800, color: '#4F6EF7', letterSpacing: -2 }}>12:00</p>
      </div>
      <button style={{ background: '#4F6EF7', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Join Video Call</button>
    </div>
  )

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: t.text }}>See a GP</h2>
      <p style={{ margin: '0 0 24px', fontSize: 15, color: t.muted }}>Telehealth consult · Medicare rebate applies · Results flow back automatically</p>
      <div style={{ background: '#EEF2FF', borderRadius: 14, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 10 }}>
        <Icon name="sparkle" size={16} color="#4F6EF7"/>
        <p style={{ margin: 0, fontSize: 14, color: '#4F6EF7', fontWeight: 600 }}>Your GP will issue referrals instantly. Results automatically flow back to your Dino app — no follow up appointment needed.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {doctors.map(doc => (
          <div key={doc.id}
            style={{ background: t.card, borderRadius: 16, padding: '20px', cursor: 'pointer', border: `2px solid ${selected === doc.id ? '#4F6EF7' : t.border}`, transition: 'all 0.15s' }}
            onClick={() => setSelected(doc.id)}
          >
            <div style={{ background: selected === doc.id ? '#4F6EF7' : '#EEF2FF', borderRadius: 14, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 16, fontWeight: 800, color: selected === doc.id ? '#fff' : '#4F6EF7' }}>
              {doc.avatar}
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: t.text }}>{doc.name}</p>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: t.muted }}>{doc.specialty}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <Icon name="star" size={12} color="#F5A623"/>
              <span style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{doc.rating}</span>
              <span style={{ fontSize: 12, color: t.muted }}>({doc.reviews})</span>
            </div>
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, fontWeight: 600, background: doc.wait === 'Now' ? t.successLight : t.primaryLight, color: doc.wait === 'Now' ? t.success : t.primary }}>
              {doc.wait === 'Now' ? 'Available now' : `~${doc.wait}`}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={() => selected && setBooked(true)} disabled={!selected} style={{ background: selected ? '#4F6EF7' : '#ccc', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          Book Consult — $15 gap fee
        </button>
        <p style={{ margin: '10px 0 0', fontSize: 13, color: t.muted }}>Medicare rebate of ~$40 applies automatically</p>
      </div>
    </div>
  )
}

// ─── SETTINGS SCREEN ──────────────────────────────────────────────────────────
const Settings = ({ user, signOut, userId, onClearResults }) => {
  const { openUserProfile } = useClerk()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleClearResults = () => {
    onClearResults()
    setCleared(true)
    setShowDeleteConfirm(false)
    setTimeout(() => setCleared(false), 3000)
  }

  const displayName = user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: t.text }}>Settings</h2>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: t.muted }}>Manage your account and preferences</p>

      {/* Profile section */}
      <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}`, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: t.text }}>Profile</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ background: t.primary, borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: t.text }}>{displayName}</p>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: t.muted }}>{user?.emailAddresses?.[0]?.emailAddress}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Username', value: user?.username || '—' },
            { label: 'Email', value: user?.emailAddresses?.[0]?.emailAddress || '—' },
            { label: 'Name', value: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 14, color: t.muted, fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: 14, color: t.text, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => openUserProfile()}
          style={{ marginTop: 20, background: t.primary, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Edit Profile & Password →
        </button>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: t.muted }}>Opens Clerk's secure profile manager — change username, email, password or delete account</p>
      </div>

      {/* Data section */}
      <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}`, marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: t.text }}>Your Data</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${t.border}` }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}>Results history</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: t.muted }}>Stored locally in your browser</p>
          </div>
          {cleared
            ? <span style={{ fontSize: 13, color: t.success, fontWeight: 600 }}>✓ Cleared</span>
            : showDeleteConfirm
            ? <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ background: t.primaryLight, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: t.primary, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Cancel</button>
                <button onClick={handleClearResults} style={{ background: t.danger, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Confirm delete</button>
              </div>
            : <button onClick={() => setShowDeleteConfirm(true)} style={{ background: t.dangerLight, border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: t.danger, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Clear all results</button>
          }
        </div>
      </div>

      {/* Sign out */}
      <div style={{ background: t.card, borderRadius: 16, padding: '24px', border: `1px solid ${t.border}` }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: t.text }}>Account</h3>
        <button onClick={() => signOut()} style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.dangerLight, border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 700, color: t.danger, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Icon name="logout" size={16} color={t.danger}/> Sign out
        </button>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DinoApp() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [screen, setScreen] = useState('home')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (user?.id) setResults(getResults(user.id))
  }, [user?.id])

  if (!isLoaded) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>
          <Icon name="spin" size={40} color={t.primary}/>
        </div>
        <p style={{ marginTop: 16, color: t.muted }}>Loading...</p>
      </div>
    </div>
  )

  const nav = [
    { id: 'home', icon: 'home', label: 'Dashboard' },
    { id: 'ai', icon: 'ai', label: 'AI Explainer' },
    { id: 'results', icon: 'results', label: 'My Results' },
    { id: 'book', icon: 'flask', label: 'Book a Test' },
    { id: 'telehealth', icon: 'video', label: 'See a GP' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ]

  const displayName = user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif", background: t.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: t.sidebar, display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: t.primary, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦕</div>
            <div>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>dino</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: -3, letterSpacing: 1, textTransform: 'uppercase' }}>know sooner</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {nav.map(item => (
            <div key={item.id}
              onClick={() => setScreen(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, cursor: 'pointer', marginBottom: 4, background: screen === item.id ? 'rgba(10,110,110,0.3)' : 'transparent', transition: 'all 0.15s' }}
              onMouseEnter={e => { if (screen !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (screen !== item.id) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon name={item.icon} size={18} color={screen === item.id ? '#fff' : 'rgba(255,255,255,0.45)'}/>
              <span style={{ fontSize: 14, fontWeight: screen === item.id ? 700 : 500, color: screen === item.id ? '#fff' : 'rgba(255,255,255,0.45)' }}>{item.label}</span>
              {screen === item.id && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: t.accent }}/>}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10 }}>
            <div style={{ background: t.primary, borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {initials.toString().toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.emailAddresses?.[0]?.emailAddress || ''}
              </p>
            </div>
            <button onClick={() => signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.4, color: '#fff' }} title="Sign out">
              <Icon name="logout" size={16} color="#fff"/>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, padding: '36px 40px', overflowY: 'auto', minHeight: '100vh' }}>
        {screen === 'home' && <Dashboard setScreen={setScreen} user={user} results={results}/>}
        {screen === 'ai' && <AIExplainer setScreen={setScreen} userId={user?.id} onNewResult={setResults}/>}
        {screen === 'results' && <ResultsHistory setScreen={setScreen} results={results} userId={user?.id} onUpdate={setResults}/>}
        {screen === 'book' && <BookTest setScreen={setScreen}/>}
        {screen === 'telehealth' && <Telehealth/>}
        {screen === 'settings' && <Settings user={user} signOut={signOut} userId={user?.id} onClearResults={() => { localStorage.removeItem(`dino_results_${user?.id}`); setResults([]) }}/>}
      </div>
    </div>
  )
}