import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { books, comingSoon } from '../books/registry'
import './Bookshelf.css'

const MIN = -600
const MAX = 2026

function pct(y: number) {
  return `${(((y - MIN) / (MAX - MIN)) * 100).toFixed(2)}%`
}

function half(w: string) {
  return `-${parseInt(w, 10) / 2}px`
}

const TICKS = (() => {
  const t: { pct: string; label: string; cinnabar?: boolean }[] = []
  for (let y = -600; y <= 2000; y += 200) {
    t.push({ pct: pct(y), label: y < 0 ? `前 ${-y}` : String(y === 0 ? 1 : y) })
  }
  t.push({ pct: pct(2026), label: '今', cinnabar: true })
  return t
})()

// Ambient, unlabeled ghost slots — the shelf has more room than books yet.
const GHOSTS = [
  { y: 100, w: '14px', h: '150px' },
  { y: 700, w: '16px', h: '160px' },
  { y: 1600, w: '15px', h: '150px' },
]

export default function Bookshelf() {
  const { night, toggleNight } = useNightMode()
  const [hover, setHover] = useState<string | null>(null)

  return (
    <div className="shelf-page">
      <Header night={night} onToggleNight={toggleNight} links={[{ label: '我的树', to: '/my-tree' }]} />

      <main className="shelf-stage" data-screen-label="千年书架">
        <div className="shelf-intro">
          <div className="shelf-headline">一座还在生长的碑林。</div>
          <div className="shelf-sub">
            AI 长出土壤,人在其上署名落笔,时间让字入木。
            <br />
            免登录,全站可读。
          </div>
        </div>

        <div className="shelf-axis">
          <div className="shelf-baseline" />

          {TICKS.map((t) => (
            <div key={t.label} className="shelf-tick" style={{ left: t.pct }}>
              <div className="shelf-tick-mark" />
              <div className="shelf-tick-label" style={{ color: t.cinnabar ? 'var(--cinnabar)' : undefined }}>
                {t.label}
              </div>
            </div>
          ))}

          {GHOSTS.map((g, i) => (
            <div
              key={i}
              className="shelf-ghost"
              style={{ left: pct(g.y), width: g.w, height: g.h, marginLeft: half(g.w), animationDelay: `${1.1 + i * 0.15}s` }}
            />
          ))}

          {books.map((b, i) => {
            const s = b.shelf
            const isHover = hover === s.id
            return (
              <div
                key={s.id}
                className="shelf-slot"
                style={{ left: pct(s.y), width: s.w, height: s.h, marginLeft: half(s.w) }}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="shelf-grow" style={{ animationDelay: `${0.35 + i * 0.2}s` }}>
                  <Link to={`/book/${b.id}`} className="shelf-spine">
                    <span className="shelf-spine-rule left" />
                    <span className="shelf-spine-rule right" />
                    <span className="shelf-spine-title" style={{ fontSize: s.fs }}>
                      {s.title}
                    </span>
                    {s.seal && <span className="shelf-seal" />}
                  </Link>
                </div>
                {isHover && (
                  <div className="shelf-card">
                    <div className="shelf-card-title">{s.title}</div>
                    <div className="shelf-card-line">{s.line}</div>
                    <div className="shelf-card-meta">{s.meta}</div>
                    <div className="shelf-card-cta">走进这本书 →</div>
                  </div>
                )}
              </div>
            )
          })}

          {comingSoon.map((c) => {
            const isHover = hover === c.id
            return (
              <div
                key={c.id}
                className="shelf-slot"
                style={{ left: pct(c.y), width: c.w, height: c.h, marginLeft: half(c.w) }}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="shelf-grow shelf-grow-pending">
                  <div className="shelf-spine shelf-spine-pending">
                    <span className="shelf-spine-rule left" />
                    <span className="shelf-spine-rule right" />
                    <span className="shelf-spine-title" style={{ fontSize: c.fs }}>
                      {c.title}
                    </span>
                  </div>
                </div>
                {isHover && (
                  <div className="shelf-card">
                    <div className="shelf-card-title">{c.title}</div>
                    <div className="shelf-card-line">{c.line}</div>
                    <div className="shelf-card-meta">{c.meta}</div>
                    <div className="shelf-card-cta shelf-card-cta-muted">即将种下</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="shelf-foot shelf-foot-left">越老的书,年轮越厚。</div>
        <div className="shelf-foot shelf-foot-right">书架尚空。空不是缺陷,是等待被种下的余地。</div>
      </main>
    </div>
  )
}
