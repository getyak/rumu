import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import './Bookshelf.css'
import { SHELF_BOOKS } from './books'

/**
 * 首页书架 (Bookshelf) — every book sits on a timeline by the age of its text,
 * not a bookshelf grid. Planted (live) books can be walked into; the rest are
 * "即将种下" (soon to be planted) placeholders — ghosts of a growing library.
 */

const MIN = -600
const MAX = 2026

function pct(year: number): string {
  return (((year - MIN) / (MAX - MIN)) * 100).toFixed(2) + '%'
}

function half(width: string): string {
  return '-' + parseInt(width, 10) / 2 + 'px'
}

const TICK_YEARS = [-600, -400, -200, 0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000]

export default function Bookshelf() {
  const [night, setNight] = useState(false)
  const [hover, setHover] = useState<string | null>(null)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  return (
    <div className="shelf-page">
      <header className="header">
        <Link className="brand" to="/">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
            <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
          </svg>
          <span className="brand-name">老树</span>
          <span className="tagline">千年经典的活体年轮库</span>
        </Link>
        <nav className="nav">
          <Link className="link-muted" to="/annotate">
            考据
          </Link>
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

      <main className="shelf-stage" data-screen-label="千年书架">
        <div className="intro">
          <div className="intro-line">一座还在生长的碑林。</div>
          <div className="intro-sub">
            AI 长出土壤,人在其上署名落笔,时间让字入木。
            <br />
            免登录,全站可读。
          </div>
        </div>

        <div className="timeline">
          <div className="timeline-rule" />

          {TICK_YEARS.map((y) => (
            <div key={y} className="tick" style={{ left: pct(y) }}>
              <div className="tick-mark" />
              <div className="tick-label">{y < 0 ? `前 ${-y}` : String(y === 0 ? 1 : y)}</div>
            </div>
          ))}
          <div className="tick" style={{ left: pct(MAX) }}>
            <div className="tick-mark" />
            <div className="tick-label tick-now">今</div>
          </div>

          {SHELF_BOOKS.map((b, i) => {
            const s = b.shelf
            const isHovered = hover === b.id
            const content = (
              <>
                <div className="plank-lines" />
                <span
                  className="plank-title"
                  style={{ fontSize: s.fontSize }}
                >
                  {s.shortTitle}
                </span>
                {s.seal && <div className="plank-seal" />}
              </>
            )
            return (
              <div
                key={b.id}
                className="book"
                style={{
                  left: pct(s.year),
                  width: s.width,
                  height: s.height,
                  marginLeft: half(s.width),
                  animationDelay: `${0.35 + i * 0.2}s`,
                }}
                onMouseEnter={() => setHover(b.id)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="plank-grow" style={{ animationDelay: `${0.35 + i * 0.2}s` }}>
                  {s.live ? (
                    <Link className="plank" to={`/tree/${b.id}`}>
                      {content}
                    </Link>
                  ) : (
                    <span className="plank plank-dormant" aria-disabled="true">
                      {content}
                    </span>
                  )}
                </div>
                {isHovered && (
                  <div className="hover-card">
                    <div className="hover-title">{s.shortTitle}</div>
                    <div className="hover-line">{s.line}</div>
                    <div className="hover-meta">{s.meta}</div>
                    <div className={`hover-cta ${s.live ? 'cta-live' : 'cta-dormant'}`}>
                      {s.live ? '走进这本书 →' : '即将种下'}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="shelf-caption shelf-caption-left">越老的书,年轮越厚。</div>
        <div className="shelf-caption shelf-caption-right">书架尚空。空不是缺陷,是等待被种下的余地。</div>
      </main>
    </div>
  )
}
