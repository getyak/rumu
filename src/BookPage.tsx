import { useCallback, useEffect, useRef, useState } from 'react'
import './BookPage.css'
import type { BookData } from './books/types'

/**
 * 书籍详情页 · 一本书的传记 — a scrollable biography of a book: who carried
 * the text forward across centuries, ending in the living 年轮 of readers'
 * own annotations today. Ported from the design's
 * 老树 · 道德经.dc.html prototype, generalised to take any book's data.
 */
export default function BookPage({ book }: { book: BookData }) {
  const [night, setNight] = useState(false)
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [asking, setAsking] = useState<string | null>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    document.title = `老树 · ${book.title} · 一本书的传记`
  }, [book.title])

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !window.IntersectionObserver) {
      const all: Record<string, boolean> = {}
      book.timeline.forEach((n) => (all[n.id] = true))
      setSeen(all)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-node')
          if (entry.isIntersecting && id) {
            setSeen((prev) => (prev[id] ? prev : { ...prev, [id]: true }))
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    ioRef.current = io
    const observe = () => document.querySelectorAll('[data-node]').forEach((el) => io.observe(el))
    const t1 = setTimeout(observe, 150)
    const t2 = setTimeout(observe, 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      io.disconnect()
    }
  }, [book.timeline])

  return (
    <div className="book-page">
      <header className="header">
        <a className="brand" href="/">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
            <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
          </svg>
          <span className="brand-name">老树</span>
          <span className="brand-tag">千年经典的活体年轮库</span>
        </a>
        <nav className="nav">
          <span
            className="link-muted"
            onClick={toggleNight}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleNight()
              }
            }}
          >
            {night ? '昼读' : '夜读'}
          </span>
        </nav>
      </header>

      <div className="book-hero" data-screen-label="书籍详情 · Hero">
        <div className="hero-side-quote">{book.sideQuote}</div>
        <div className="eyebrow">{book.shelfCategory}</div>
        <h1 className="book-title">{book.title}</h1>
        <div className="book-meta">{book.metaLine}</div>
        <div className="hero-quote">{book.heroQuote}</div>
        <div className="hero-cta">
          <a className="link-cinnabar" href={book.ctaHref}>
            {book.ctaLabel}
          </a>
        </div>
      </div>

      <div className="biography">
        <div className="biography-label">一本书的传记</div>
        <div className="timeline">
          {book.timeline.map((node) => {
            const isSeen = !!seen[node.id]
            const showAsk = !node.noAsk && asking !== node.id
            const showAsking = !node.noAsk && asking === node.id
            return (
              <div
                key={node.id}
                data-node={node.id}
                className="timeline-node"
                style={{
                  opacity: isSeen ? 1 : 0,
                  transform: isSeen ? 'none' : 'translateY(20px)',
                }}
              >
                <div className="node-year" style={{ color: node.cinnabar ? 'var(--cinnabar)' : 'var(--ink-light)' }}>
                  {node.year}
                </div>
                <div className="node-dot" style={{ background: node.cinnabar ? 'var(--cinnabar)' : 'var(--ink-light)' }} />
                <div className="node-who">{node.who}</div>
                <div className="node-story">{node.story}</div>
                {node.anchor && <div className="node-anchor">{node.anchor}</div>}

                {node.special && (
                  <div className="comparison">
                    <div className="comparison-label">{book.comparison.label}</div>
                    <div className="comparison-grid">
                      <div className="comparison-header">{book.comparison.columns[0]}</div>
                      <div className="comparison-header">{book.comparison.columns[1]}</div>
                      {book.comparison.rows.map((row, i) => (
                        <div className="comparison-row-pair" key={i}>
                          <div>{row[0]}</div>
                          <div>{row[1]}</div>
                        </div>
                      ))}
                    </div>
                    <div className="comparison-note">{book.comparison.note}</div>
                    <div className="comparison-cta">
                      <a className="link-cinnabar" href={book.comparison.cta.href}>
                        {book.comparison.cta.label}
                      </a>
                    </div>
                  </div>
                )}

                {node.today && (
                  <div className="today-rings">
                    {book.rings.map((r) => (
                      <div className="ring-note" key={r.name + r.date}>
                        <div className="ring-head">
                          <span
                            className="ring-name"
                            style={{ color: r.state === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)' }}
                          >
                            {r.name}
                          </span>
                          <span
                            className="ring-badge"
                            style={{
                              color: r.state === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)',
                              borderColor: r.state === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)',
                            }}
                          >
                            {r.genre}
                          </span>
                          <span
                            className="ring-tag"
                            style={{ color: r.state === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)' }}
                          >
                            {r.state}
                          </span>
                          <span className="ring-date">{r.date}</span>
                        </div>
                        <div className="ring-text">{r.text}</div>
                      </div>
                    ))}
                    <div className="today-cta">
                      <a className="link-cinnabar" href={book.ctaHref}>
                        进入,亲自落笔 →
                      </a>
                    </div>
                  </div>
                )}

                {showAsk && (
                  <div className="ask-row">
                    <span className="link-muted ask-link" onClick={() => setAsking(node.id)}>
                      与守树人细究此节 →
                    </span>
                  </div>
                )}
                {showAsking && (
                  <div className="ask-row ask-gate">
                    读是自由的。落笔与问路,需要一个名字。 <span className="link-cinnabar-inline">→ 留下名字</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="book-footer">{book.footerLine}</div>

      <a className="watcher-link" href="/watcher">
        问守树人
      </a>
    </div>
  )
}
