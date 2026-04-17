'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError(null)
      setResult(null)
    } else {
      setError('Please upload a PDF file.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/explain', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data.explanation)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setLoading(false)
  }

  // Render inline bold/italic
  const renderInline = (text, isDark = false) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700, color: isDark ? '#fff' : '#0d1a14' }}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  // Render full markdown block
  const renderMarkdown = (text, isDark = false) => {
    const baseColor = isDark ? '#e8f7f1' : '#0d1a14'
    return text.split('\n').map((line, i) => {
      const t = line.trim()
      if (!t) return <div key={i} style={{ height: 8 }} />
      if (t === '---') return <hr key={i} style={{ border: 'none', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2ebe6', margin: '10px 0' }} />
      if (t.startsWith('### ')) {
        const c = t.replace(/^###\s+/, '').replace(/\*\*/g, '')
        return <p key={i} style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#a8d9c5' : '#006241', margin: '14px 0 4px' }}>{c}</p>
      }
      if (t.startsWith('## ')) {
        const c = t.replace(/^##\s+/, '').replace(/\*\*/g, '')
        return <p key={i} style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#fff' : '#0d1a14', margin: '16px 0 6px' }}>{c}</p>
      }
      if (t.startsWith('- ') || t.startsWith('* ')) {
        return (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'flex-start' }}>
            <span style={{ color: '#006241', fontWeight: 700, flexShrink: 0 }}>•</span>
            <span style={{ fontSize: 14, color: baseColor, lineHeight: 1.65 }}>{renderInline(t.slice(2), isDark)}</span>
          </div>
        )
      }
      return <p key={i} style={{ fontSize: 14, color: baseColor, lineHeight: 1.7, marginBottom: 5 }}>{renderInline(t, isDark)}</p>
    })
  }

  // Parse explanation into sections
  const parseSections = (text) => {
    const sections = []
    const parts = text.split(/\n(?=SUMMARY|YOUR MARKERS|WHAT TO DO NEXT|DISCLAIMER)/)
    parts.forEach((part) => {
      const lines = part.trim().split('\n')
      const title = lines[0].trim()
      const content = lines.slice(1).join('\n').trim()
      if (title && content) sections.push({ title, content })
    })
    return sections.length > 0 ? sections : [{ title: 'Your Results Explained', content: text }]
  }

  const sectionStyle = (title) => {
    if (title === 'DISCLAIMER') return { bg: '#f7faf8', border: '#e2ebe6', titleColor: '#6b7b74', dark: false }
    if (title === 'WHAT TO DO NEXT') return { bg: '#e6f2ed', border: '#cce6da', titleColor: '#006241', dark: false }
    if (title === 'SUMMARY') return { bg: '#0d1a14', border: '#006241', titleColor: '#a8d9c5', dark: true }
    return { bg: '#ffffff', border: '#e2ebe6', titleColor: '#006241', dark: false }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>

      {/* NAV */}
      <nav style={{
        borderBottom: '1px solid #e2ebe6',
        padding: '0 28px',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: '#006241', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: '#0d1a14', letterSpacing: -0.5 }}>dino</span>
          </div>
          <span style={{
            background: '#e6f2ed', border: '1px solid #cce6da',
            borderRadius: 100, padding: '6px 14px',
            fontSize: 12, fontWeight: 600, color: '#006241'
          }}>AI Results Explainer</span>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '0 28px' }}>

        {!result ? (
          <>
            {/* HERO */}
            <div style={{ padding: '64px 0 48px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#e6f2ed', border: '1px solid #cce6da',
                borderRadius: 100, padding: '6px 16px',
                fontSize: 12, fontWeight: 600, color: '#006241',
                letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 28
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#006241', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                Powered by Claude AI
              </div>

              <h1 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: 'clamp(38px, 7vw, 60px)',
                fontWeight: 900, lineHeight: 1.0,
                letterSpacing: -2, color: '#0d1a14',
                marginBottom: 20
              }}>
                Understand your<br /><em style={{ fontStyle: 'italic', color: '#006241' }}>results instantly.</em>
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.7, color: '#6b7b74', maxWidth: 460, margin: '0 auto', fontWeight: 400 }}>
                Upload your pathology PDF and Dino's AI will translate every marker into plain English — no medical degree required.
              </p>
            </div>

            {/* UPLOAD AREA */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#006241' : file ? '#006241' : '#e2ebe6'}`,
                borderRadius: 20,
                padding: '48px 32px',
                textAlign: 'center',
                background: dragging ? '#e6f2ed' : file ? '#f0faf6' : '#f7faf8',
                cursor: file ? 'default' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: 20,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file ? (
                <div>
                  <div style={{
                    width: 56, height: 56, background: '#e6f2ed', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006241" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#006241', marginBottom: 4 }}>{file.name}</p>
                  <p style={{ fontSize: 13, color: '#6b7b74', marginBottom: 20 }}>{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); reset() }}
                    style={{
                      background: 'none', border: '1px solid #e2ebe6', borderRadius: 8,
                      padding: '6px 14px', fontSize: 12, color: '#6b7b74',
                      cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    width: 56, height: 56, background: '#e6f2ed', borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006241" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0d1a14', marginBottom: 6 }}>
                    Drop your PDF here
                  </p>
                  <p style={{ fontSize: 13, color: '#6b7b74', marginBottom: 16 }}>
                    or click to browse your files
                  </p>
                  <span style={{
                    background: '#e6f2ed', borderRadius: 8, padding: '4px 12px',
                    fontSize: 12, color: '#006241', fontWeight: 600
                  }}>PDF files only</span>
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div style={{
                background: '#fdf0f0', border: '1px solid #f5c6c6',
                borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                display: 'flex', gap: 10, alignItems: 'flex-start'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e05050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: 14, color: '#c0392b', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              style={{
                width: '100%', background: file && !loading ? '#006241' : '#cce6da',
                color: file && !loading ? '#fff' : '#6b7b74',
                border: 'none', borderRadius: 14, padding: '16px 24px',
                fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 700,
                cursor: file && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                  Analysing your results...
                </>
              ) : (
                <>
                  Explain My Results
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {/* TRUST BADGES */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', paddingBottom: 64 }}>
              {[
                'Education tool only — not a diagnosis',
                'Your data is not stored',
                'TGA compliant scope',
              ].map((t) => (
                <span key={t} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#f7faf8', border: '1px solid #e2ebe6',
                  borderRadius: 100, padding: '6px 12px',
                  fontSize: 12, color: '#6b7b74', fontWeight: 500
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#006241" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </>
        ) : (
          /* RESULTS VIEW */
          <div style={{ padding: '48px 0 64px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0d1a14', letterSpacing: -1, marginBottom: 4 }}>
                  Your Results Explained
                </h2>
                <p style={{ fontSize: 13, color: '#6b7b74' }}>{file?.name}</p>
              </div>
              <button
                onClick={reset}
                style={{
                  background: '#e6f2ed', border: '1px solid #cce6da',
                  borderRadius: 10, padding: '10px 18px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
                  color: '#006241', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Upload another
              </button>
            </div>

            {/* Sections */}
            {parseSections(result).map((section, i) => {
              const style = sectionStyle(section.title)
              return (
                <div key={i} style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: 16, padding: 24, marginBottom: 16
                }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    textTransform: 'uppercase', color: style.titleColor,
                    marginBottom: 12
                  }}>
                    {section.title}
                  </p>
                  <div>
                    {renderMarkdown(section.content, style.dark)}
                  </div>
                </div>
              )
            })}

            {/* CTA */}
            <div style={{
              background: '#0d1a14', borderRadius: 16, padding: 28,
              marginTop: 24, textAlign: 'center'
            }}>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: -0.5 }}>
                Want to discuss these results?
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
                Book a 10-minute telehealth GP consult through our partners
              </p>
              <a
                href="https://hola.health"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', background: '#006241', color: '#fff',
                  borderRadius: 12, padding: '12px 24px',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Book a GP via Hola Health →
              </a>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}