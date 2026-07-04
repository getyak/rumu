import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { BookBioData } from './books/types'
import './BookBio.css'

/**
 * 一本书的传记 (a book's biography) — a scrolling timeline of the moments a
 * text passed through a hand: the one who wrote it, the ones who copied,
 * translated, argued over, and are still annotating it today.
 *
 * Ported from `design/project/老树 · 道德经.dc.html`. That prototype is
 * book-specific (道德经); this component is not — any book's `BookBioData`
 * (see `src/books/`) renders the same biography shape.
 */
export default function BookBio({ book }: { book: BookBioData }) {
  const [night, setNight] = useState(() => document.body.hasAttribute('data-night'))
  const [seen, setSeen] = useState<Record<number, boolean>>({})
  const [wallOpen, setWallOpen] = useState<number | null>(null)
  const ioRef = useRef<IntersectionObserver | null>(null)

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
      setSeen(Object.fromEntries(book.nodes.map((_, i) => [i, true])))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          let changed = false
          const next = { ...prev }
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.getAttribute('data-node'))
              if (!next[idx]) {
                next[idx] = true
                changed = true
                io.unobserve(entry.target)
              }
            }
          }
          return changed ? next : prev
        })
      },
      { threshold: 0.12 },
    )
    ioRef.current = io
    const observe = () =>
      document.querySelectorAll('[data-node]').forEach((el) => io.observe(el))
    const t1 = setTimeout(observe, 150)
    const t2 = setTimeout(observe, 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      io.disconnect()
    }
    // book.nodes.length is stable per mounted book; re-running per book instance is intended.
  }, [book.nodes.length])

  return (
    <div className="bio-page">
      <header className="header">
        <Link className="brand" to="/">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
            <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
          </svg>
          <span className="brand-name">老树</span>
          <span className="brand-sub">千年经典的活体年轮库</span>
        </Link>
        <nav className="nav">
          <a className="link-muted" href="/kaoju">
            考据
          </a>
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
          <span className="link-muted">登录</span>
        </nav>
      </header>

      <div className="bio-hero" data-screen-label="书籍详情 · Hero">
        <div className="hero-epigraph" aria-hidden="true">
          {book.epigraph}
        </div>
        <div className="hero-shelf">{book.shelfLabel}</div>
        <div className="hero-title">{book.title}</div>
        <div className="hero-colophon">{book.colophon}</div>
        <div className="hero-lead">{book.lead}</div>
        <div className="hero-cta">
          <a className="link-cinnabar" href={book.ctaHref}>
            {book.ctaLabel}
          </a>
        </div>
      </div>

      <div className="bio-timeline-wrap" data-screen-label="传记时间线">
        <div className="timeline-label">{book.biographyLabel}</div>
        <div className="timeline">
          <div className="timeline-rail" />
          {book.nodes.map((n, i) => {
            const revealed = !!seen[i]
            return (
              <div
                key={i}
                data-node={i}
                className="node"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'none' : 'translateY(20px)',
                }}
              >
                <div className="node-year" style={{ color: n.turning ? 'var(--cinnabar)' : 'var(--ink-light)' }}>
                  {n.year}
                </div>
                <div className="node-dot" style={{ background: n.turning ? 'var(--cinnabar)' : 'var(--ink-light)' }} />
                <div className="node-who">{n.who}</div>
                <div className="node-story">{n.story}</div>

                {n.anchor && <div className="node-anchor">{n.anchor}</div>}

                {n.compare && (
                  <div className="compare">
                    <div className="compare-label">经文在此改变</div>
                    <div className="compare-grid">
                      <div className="compare-head">{n.compare.columns[0]}</div>
                      <div className="compare-head">{n.compare.columns[1]}</div>
                      {n.compare.rows.map((row, ri) => (
                        <Fragment key={ri}>
                          <div>{row[0]}</div>
                          <div>{row[1]}</div>
                        </Fragment>
                      ))}
                    </div>
                    <div className="compare-link">
                      <a className="link-cinnabar" href={n.compare.linkHref}>
                        {n.compare.linkLabel}
                      </a>
                    </div>
                  </div>
                )}

                {n.today && (
                  <div className="rings">
                    {book.rings.map((r, ri) => {
                      const color = r.state === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)'
                      return (
                        <div className="ring-card" key={ri}>
                          <div className="ring-head">
                            <span className="ring-name" style={{ color }}>
                              {r.name}
                            </span>
                            <span className="ring-badge" style={{ color, borderColor: color }}>
                              {r.genre}
                            </span>
                            <span className="ring-tag" style={{ color }}>
                              {r.state}
                            </span>
                            <span className="ring-date">{r.date}</span>
                          </div>
                          <div className="ring-text">{r.text}</div>
                        </div>
                      )
                    })}
                    <div className="rings-cta">
                      <a className="link-cinnabar" href={book.ctaHref}>
                        进入,亲自落笔 →
                      </a>
                    </div>
                  </div>
                )}

                {!n.today &&
                  (wallOpen === i ? (
                    <div className="ask-on">
                      读是自由的。落笔与问路,需要一个名字。 <span className="link-cinnabar">→ 留下名字</span>
                    </div>
                  ) : (
                    <div className="ask-off">
                      <span
                        className="ask-trigger"
                        role="button"
                        tabIndex={0}
                        onClick={() => setWallOpen(i)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setWallOpen(i)
                          }
                        }}
                      >
                        与守树人细究此节 →
                      </span>
                    </div>
                  ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bio-footer">{book.footerLine}</div>

      <a className="keeper-link" href="/keeper">
        问守树人
      </a>
    </div>
  )
}
