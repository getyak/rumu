import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import './BookDetail.css'

/** 书籍详情页 — "一本书的传记": a scroll-revealed timeline of a book's life. */
export default function BookDetail() {
  const { id } = useParams()
  const book = getBook(id)
  const { night, toggleNight } = useNightMode()
  const [seen, setSeen] = useState<Record<number, boolean>>({})
  const [asked, setAsked] = useState<Record<number, boolean>>({})
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!book) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !window.IntersectionObserver) {
      setSeen(Object.fromEntries(book.bio.map((_, i) => [i, true])))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          let changed = false
          const next = { ...prev }
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const idx = Number(en.target.getAttribute('data-node'))
              next[idx] = true
              changed = true
              io.unobserve(en.target)
            }
          })
          return changed ? next : prev
        })
      },
      { threshold: 0.12 },
    )
    const observe = () => rootRef.current?.querySelectorAll('[data-node]').forEach((el) => io.observe(el))
    const t1 = setTimeout(observe, 150)
    const t2 = setTimeout(observe, 1200)
    return () => {
      io.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [book])

  if (!book) return <Navigate to="/" replace />

  return (
    <div className="detail-page" ref={rootRef}>
      <Header night={night} onToggleNight={toggleNight} links={[{ label: '我的树', to: '/my-tree' }]} />

      <div className="detail-hero" data-screen-label="书籍详情 · Hero">
        <div className="detail-margin-quote">{book.marginQuote}</div>
        <div className="detail-category">{book.category}</div>
        <div className="detail-title">{book.title}</div>
        <div className="detail-composed">{book.composedLabel}</div>
        <div className="detail-tagline">{book.tagline}</div>
        <div className="detail-entry">
          <Link className="link-cinnabar" to={`/book/${book.id}/read`}>
            {book.entryLabel}
          </Link>
        </div>
      </div>

      <div className="detail-timeline" data-screen-label="传记时间线">
        <div className="detail-timeline-label">一本书的传记</div>
        <div className="detail-nodes">
          <div className="detail-spine" />
          {book.bio.map((n, i) => {
            const isSeen = !!seen[i]
            const yc = n.cin ? 'var(--cinnabar)' : 'var(--ink-light)'
            return (
              <div
                key={i}
                data-node={i}
                className="detail-node"
                style={{ opacity: isSeen ? 1 : 0, transform: isSeen ? 'none' : 'translateY(20px)' }}
              >
                <div className="detail-node-year" style={{ color: yc }}>
                  {n.yl}
                </div>
                <div className="detail-node-dot" style={{ background: yc }} />
                <div className="detail-node-who">{n.who}</div>
                <div className="detail-node-story">{n.story}</div>
                {n.anchor && <div className="detail-node-anchor">{n.anchor}</div>}

                {n.special && (
                  <div className="detail-special">
                    <div className="detail-special-heading">{n.special.heading}</div>
                    <div className="detail-special-grid">
                      <div className="detail-special-col-label">{n.special.left.label}</div>
                      <div className="detail-special-col-label">{n.special.right.label}</div>
                      {n.special.left.lines.map((line, li) => (
                        <Fragment key={li}>
                          <div>{line}</div>
                          <div>{n.special!.right.lines[li] ?? ''}</div>
                        </Fragment>
                      ))}
                    </div>
                    <div className="detail-special-link">
                      <Link className="link-cinnabar" to={`/book/${book.id}/read`}>
                        {n.special.linkLabel}
                      </Link>
                    </div>
                  </div>
                )}

                {n.today && (
                  <div className="detail-rings">
                    {book.rings.map((r, ri) => {
                      const c = r.tag === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)'
                      return (
                        <div key={ri} className="detail-ring">
                          <div className="detail-ring-head">
                            <span className="detail-ring-name" style={{ color: c }}>
                              {r.name}
                            </span>
                            <span className="detail-ring-badge" style={{ color: c, borderColor: c }}>
                              {r.badge}
                            </span>
                            <span className="detail-ring-tag" style={{ color: c }}>
                              {r.tag}
                            </span>
                            <span className="detail-ring-date">{r.date}</span>
                          </div>
                          <div className="detail-ring-text">{r.text}</div>
                        </div>
                      )
                    })}
                    <div className="detail-entry" style={{ marginTop: 10 }}>
                      <Link className="link-cinnabar" to={`/book/${book.id}/read`}>
                        进入,亲自落笔 →
                      </Link>
                    </div>
                  </div>
                )}

                {!n.noAsk &&
                  (asked[i] ? (
                    <div className="detail-ask-open">
                      读是自由的。落笔与问路,需要一个名字。 <span className="detail-ask-cta">→ 留下名字</span>
                    </div>
                  ) : (
                    <div className="detail-ask-off">
                      <span
                        className="link-muted"
                        role="button"
                        tabIndex={0}
                        onClick={() => setAsked((s) => ({ ...s, [i]: true }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setAsked((s) => ({ ...s, [i]: true }))
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

      <div className="detail-foot">越老的书,年轮越厚。</div>
    </div>
  )
}
