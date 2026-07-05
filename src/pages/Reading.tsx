import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import type { ReadingChapter as ReadingChapterData, ReadingEvent, ReadingSentence } from '../books/types'
import './Reading.css'

const SWEEP_MS = 3600
const SWEEP_DELAY_MS = 700
const SNAP_FRACTION = 0.012 // nearest-event snap distance, as a fraction of the chapter's year range

function easeInOutCubic(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

export default function Reading() {
  const { id } = useParams()
  const book = getBook(id)
  const { night, toggleNight } = useNightMode()

  if (!book) return <Navigate to="/" replace />
  return <ReadingChapter bookId={book.id} bookTitle={book.title} night={night} toggleNight={toggleNight} chapter={book.chapter} />
}

function ReadingChapter({
  bookId,
  bookTitle,
  night,
  toggleNight,
  chapter,
}: {
  bookId: string
  bookTitle: string
  night: boolean
  toggleNight: () => void
  chapter: ReadingChapterData
}) {
  const { min, max } = chapter
  const [displayYear, setDisplayYear] = useState(max)
  const [targetYear, setTargetYear] = useState(max)
  const [sweeping, setSweeping] = useState(false)
  const [dragged, setDragged] = useState(false)
  const [hoverTick, setHoverTick] = useState('')
  const [open, setOpen] = useState<number | null>(null)
  const [layersVisible, setLayersVisible] = useState(false)
  const [foldAi, setFoldAi] = useState(false)
  const [compareOn, setCompareOn] = useState(false)
  const [wallFoot, setWallFoot] = useState(false)
  const [wallDrawer, setWallDrawer] = useState(false)

  const dragRef = useRef(false)
  const rafRef = useRef(0)
  const sweepRafRef = useRef(0)
  const stateRef = useRef({ displayYear, targetYear, sweeping })
  stateRef.current = { displayYear, targetYear, sweeping }
  const layerTimerRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const reduced = useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // continuous lerp toward the target year, paused while the intro sweep drives displayYear itself
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      const s = stateRef.current
      if (s.sweeping) return
      const diff = s.targetYear - s.displayYear
      if (Math.abs(diff) > 0.4) {
        setDisplayYear(s.displayYear + diff * (reduced ? 1 : 0.055))
      } else if (s.displayYear !== s.targetYear) {
        setDisplayYear(s.targetYear)
      }
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduced])

  // one-time intro sweep from the chapter's earliest year up to today, on load
  useEffect(() => {
    if (reduced) return
    setDisplayYear(min)
    setTargetYear(min)
    setSweeping(true)
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0 - SWEEP_DELAY_MS) / SWEEP_MS)
      if (p < 0) {
        sweepRafRef.current = requestAnimationFrame(step)
        return
      }
      const e = easeInOutCubic(p)
      const y = min + (max - min) * e
      if (p < 1) {
        setDisplayYear(y)
        setTargetYear(y)
        sweepRafRef.current = requestAnimationFrame(step)
      } else {
        setDisplayYear(max)
        setTargetYear(max)
        setSweeping(false)
      }
    }
    sweepRafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(sweepRafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const step = (max - min) * 0.01
        const d = e.key === 'ArrowLeft' ? -step : step
        setTargetYear((y) => Math.max(min, Math.min(max, y + d)))
        setDragged(true)
      } else if (e.key === 'Escape') {
        setOpen(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [min, max])

  const visibleEvents = chapter.events.filter((ev) => !(ev.hidden && displayYear < (ev.revealAt ?? Infinity)))

  const pct = (y: number) => `${(((y - min) / (max - min)) * 100).toFixed(2)}%`

  const yearFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return targetYear
    const r = el.getBoundingClientRect()
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width))
    return Math.round(min + p * (max - min))
  }

  const trackDown = (e: PointerEvent<HTMLDivElement>) => {
    if (sweeping) {
      cancelAnimationFrame(sweepRafRef.current)
      setSweeping(false)
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = true
    setTargetYear(yearFromClientX(e.clientX))
    setDragged(true)
  }
  const trackMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) setTargetYear(yearFromClientX(e.clientX))
  }
  const trackUp = () => {
    dragRef.current = false
    setTargetYear((t) => {
      let best: number | null = null
      const threshold = (max - min) * SNAP_FRACTION
      for (const ev of visibleEvents) {
        if (best === null || Math.abs(ev.y - t) < Math.abs(best - t)) best = ev.y
      }
      if (best !== null && Math.abs(best - t) <= threshold) return best
      return t
    })
  }

  const stepEvent = (dir: 1 | -1) => {
    const years = visibleEvents.map((e) => e.y).sort((a, b) => a - b)
    let t: number
    if (dir > 0) {
      const n = years.find((y) => y > targetYear + 0.5)
      t = n ?? max
    } else {
      const p = [...years].reverse().find((y) => y < targetYear - 0.5)
      t = p ?? min
    }
    setTargetYear(t)
    setDragged(true)
    setSweeping(false)
  }

  const openRoom = (i: number) => {
    setOpen(i)
    setLayersVisible(false)
    setWallDrawer(false)
    clearTimeout(layerTimerRef.current)
    layerTimerRef.current = window.setTimeout(() => setLayersVisible(true), 60)
  }

  const yr = Math.round(displayYear)
  const yearLabel = yr >= max ? `今 · ${max}` : yr < 0 ? `前 ${-yr}` : yr === 0 ? '公元元年' : `公元 ${yr}`
  const hintLabel = sweeping
    ? `${max - min} 年,正在生长——`
    : hoverTick || (dragged ? '' : '点一枚刻度、按 ‹ › 逐层走,或拖动圆点')

  const openSentence: ReadingSentence | null = open != null ? chapter.sentences[open] : null

  return (
    <div className="read-page">
      <Header night={night} onToggleNight={toggleNight} links={[{ label: '我的树', to: '/my-tree' }]} />

      <div className="read-slider" data-screen-label="时间滑杆">
        <div className="read-slider-inner">
          <div className="read-slider-labels">
            <span>{min < 0 ? `前 ${-min}` : min === 0 ? '公元元年' : `公元 ${min}`}</span>
            <span className="read-slider-hint">{hintLabel}</span>
            <span>今</span>
          </div>
          <div className="read-slider-row">
            <span className="read-slider-step" onClick={() => stepEvent(-1)} title="上一处年轮">
              ‹
            </span>
            <div
              ref={trackRef}
              className="read-track"
              role="slider"
              tabIndex={0}
              aria-label="年轮轴:拖动或点击回到任何一年"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={yr}
              onPointerDown={trackDown}
              onPointerMove={trackMove}
              onPointerUp={trackUp}
            >
              <div className="read-track-base" />
              <div className="read-track-fill" style={{ width: pct(Math.max(min, Math.min(max, displayYear))) }} />
              {visibleEvents.map((ev: ReadingEvent) => (
                <div
                  key={ev.label}
                  className="read-tick"
                  style={{ left: pct(ev.y) }}
                  onClick={() => {
                    setTargetYear(ev.y)
                    setDragged(true)
                    setSweeping(false)
                  }}
                  onMouseEnter={() => setHoverTick(ev.label)}
                  onMouseLeave={() => setHoverTick('')}
                >
                  <div
                    className="read-tick-dot"
                    style={{
                      background: ev.cin ? 'var(--cinnabar)' : ev.verd ? 'var(--verdigris)' : 'var(--ink-light)',
                      opacity: ev.y <= displayYear + 0.5 ? 0.9 : 0.18,
                    }}
                  />
                </div>
              ))}
              <div className="read-handle" style={{ left: pct(Math.max(min, Math.min(max, displayYear))) }}>
                <div className="read-handle-dot" />
                <div className="read-handle-label">{yearLabel}</div>
              </div>
            </div>
            <span className="read-slider-step" onClick={() => stepEvent(1)} title="下一处年轮">
              ›
            </span>
          </div>
        </div>
      </div>

      <div className="read-body">
        <div className="read-column" data-screen-label={`阅读页 · ${chapter.label}`}>
          <div className="read-crumb">
            <Link className="link-muted" to={`/book/${bookId}`} title="回到这本书的传记">
              {bookTitle}
            </Link>
            <span className="read-crumb-sep"> · {chapter.label}</span>
          </div>

          <div className="read-text">
            {chapter.sentences.map((s, i) => (
              <SentenceLine
                key={i}
                sentence={s}
                displayYear={displayYear}
                isOpen={open === i}
                onOpen={s.strata.length ? () => openRoom(i) : undefined}
                onCompareEnter={() => setCompareOn(true)}
                onCompareLeave={() => setCompareOn(false)}
              />
            ))}
          </div>

          <div className="read-footnote-slot">
            {chapter.sentences.map(
              (s, i) =>
                s.compare &&
                compareOn && (
                  <div key={i} className="read-footnote">
                    {s.compare.footnote}
                  </div>
                ),
            )}
          </div>

          <div className="read-wall">
            {wallFoot ? (
              <span className="read-wall-inert">
                读是自由的。落笔与问路,需要一个名字。 <span className="read-ask-cta">→ 留下名字</span>
              </span>
            ) : (
              <span className="link-muted" role="button" tabIndex={0} onClick={() => setWallFoot(true)}>
                抄录本章,获得落笔资格 →
              </span>
            )}
          </div>
        </div>

        <div className={`read-drawer ${open != null ? 'is-open' : ''}`}>
          <div className="read-drawer-inner">
            <div className="read-drawer-head">
              <span>一句话的地层</span>
              <div className="read-drawer-head-actions">
                <span className="link-muted" role="button" tabIndex={0} onClick={() => setFoldAi((v) => !v)}>
                  {foldAi ? '展开底图' : '折叠底图'}
                </span>
                <span className="link-muted" role="button" tabIndex={0} onClick={() => setOpen(null)}>
                  收起
                </span>
              </div>
            </div>
            <div className="read-drawer-quote">{openSentence?.text}</div>
            {layersVisible && openSentence && (
              <div>
                {openSentence.strata.map((L, li) => {
                  const folded = !!L.ai && foldAi
                  const on = L.year <= displayYear + 0.5
                  const accent = L.sprout ? 'var(--verdigris)' : 'var(--cinnabar)'
                  return (
                    <div key={li} className="read-layer" style={{ opacity: on ? 1 : 0.13 }}>
                      {L.follow && (
                        <div className="read-layer-follow">
                          <div className="read-layer-follow-rule" />
                          <span>{L.follow}</span>
                        </div>
                      )}
                      {folded ? (
                        <div className="read-layer-folded link-muted" onClick={() => setFoldAi(false)}>
                          底图 · AI 整理 · 已折叠 →
                        </div>
                      ) : (
                        <div className="read-layer-full" style={{ borderTopColor: li === 0 || L.follow ? 'transparent' : 'var(--line)' }}>
                          {L.ai && <div className="read-layer-ai-badge">底图 · AI 整理</div>}
                          <div className="read-layer-meta">
                            <span className="read-layer-src" style={{ color: L.ai ? 'var(--ink-light)' : 'var(--ink)' }}>
                              {L.src}
                            </span>
                            {L.yl && <span className="read-layer-yl">{L.yl}</span>}
                            {L.badge && (
                              <span className="read-layer-badge" style={{ color: accent, borderColor: accent }}>
                                {L.badge}
                              </span>
                            )}
                            {L.tag && (
                              <span className="read-layer-tag" style={{ color: accent }}>
                                {L.tag}
                              </span>
                            )}
                          </div>
                          <div className="read-layer-body" style={{ color: L.ai ? 'var(--ink-light)' : 'var(--ink)' }}>
                            {L.body}
                          </div>
                          {L.tag && (
                            <div className="read-layer-sig" style={{ color: accent }}>
                              —— {L.sig} · {L.date}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
                <div className="read-drawer-write">
                  {wallDrawer ? (
                    <span className="read-wall-inert">
                      读是自由的。落笔与问路,需要一个名字。{' '}
                      <Link className="link-cinnabar" to={`/book/${bookId}`}>
                        → 留下名字
                      </Link>
                    </span>
                  ) : (
                    <span className="link-cinnabar" role="button" tabIndex={0} onClick={() => setWallDrawer(true)}>
                      在此落笔 →
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SentenceLine({
  sentence,
  displayYear,
  isOpen,
  onOpen,
  onCompareEnter,
  onCompareLeave,
}: {
  sentence: ReadingSentence
  displayYear: number
  isOpen: boolean
  onOpen?: () => void
  onCompareEnter: () => void
  onCompareLeave: () => void
}) {
  const hasStrata = sentence.strata.length > 0
  const underline = !hasStrata
    ? 'transparent'
    : isOpen
      ? 'var(--cinnabar)'
      : sentence.earliest != null && displayYear + 0.5 >= sentence.earliest
        ? 'var(--u-soft)'
        : 'transparent'

  if (sentence.compare) {
    const eligible = displayYear + 0.5 >= sentence.compare.activeYear
    return (
      <div className="read-sentence">
        {sentence.compare.segments.map((seg, i) => {
          if (!seg.hoverable) return <span key={i}>{seg.text}</span>
          if (sentence.compare!.appended && !eligible) return null
          return (
            <span
              key={i}
              className="read-compare-span"
              style={{ borderBottomColor: eligible ? 'var(--cinnabar)' : 'transparent' }}
              onMouseEnter={() => eligible && onCompareEnter()}
              onMouseLeave={onCompareLeave}
            >
              {seg.text}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="read-sentence">
      <span
        className={onOpen ? 'read-sentence-clickable' : undefined}
        style={{ borderBottomColor: underline }}
        onClick={onOpen}
      >
        {sentence.text}
      </span>
    </div>
  )
}
