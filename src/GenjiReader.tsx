import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from './Header'
import { Link } from './router'
import './GenjiReader.css'

const MIN = 1000
const MAX = 2026

type Stratum = {
  src: string
  yl: string
  year: number
  badge?: string
  tag?: '入木' | '青芽'
  ai?: boolean
  sprout?: boolean
  follow?: string
  sig?: string
  date?: string
  body: string
}

type Sentence = {
  text: string
  earliest: number | null
  strata: Stratum[]
}

type TimelineEvent = {
  y: number
  label: string
  cin?: boolean
}

const EVENTS: TimelineEvent[] = [
  { y: 1008, label: '1008 前后 · 《源氏物语》约成书' },
  { y: 1225, label: '1225 · 藤原定家「青表纸本」校订', cin: true },
  { y: 1236, label: '1236 前后 · 源光行·亲行「河内本」' },
  { y: 1362, label: '1362 前后 · 四辻善成《河海抄》' },
  { y: 1796, label: '1796 · 本居宣长《玉の小栉》「物哀」说' },
  { y: 1925, label: '1925 · Arthur Waley 英译' },
  { y: 1976, label: '1976 · Edward Seidensticker 英译' },
  { y: 1983, label: '1983 · 大和和纪《あさきゆめみし》' },
  { y: 2001, label: '2001 · Royall Tyler 英译' },
  { y: 2024, label: '2024 · 苏未「证」入木', cin: true },
  { y: 2026, label: '2026 · 今,青芽初生' },
]

const SENTENCES: Sentence[] = [
  {
    text: 'いづれの御時にか、女御、更衣あまたさぶらひたまひける中に、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。',
    earliest: 1225,
    strata: [
      {
        src: '四辻善成《河海抄》',
        yl: '1362 前后',
        year: 1362,
        badge: '注',
        body: '「女御」「更衣」皆后宫位阶,女御高而更衣次之。开篇即写帝独宠位阶不高者,后文满宫的嫉妒与非议,皆由此一句种下。',
      },
      {
        src: '本居宣长《玉の小栉》',
        yl: '1796',
        year: 1796,
        badge: '注',
        body: '不书年号朝代,只说「不知是哪一朝」,正是「物哀」笔法——让读者一开始就脱开具体的史实时间,进入普遍的人情之中。',
      },
      {
        src: '版本对照',
        yl: '1225 起',
        year: 1225,
        ai: true,
        body: '「候ひたまひける」在部分河内本系抄本中或作「さぶらひたまひける」——同一敬语动词的两种假名书写,是写本时代最常见的异文类型之一。青表纸本与河内本自此分流,此后近八百年的刊本多循青表纸本一系。',
      },
      {
        src: 'Arthur Waley',
        yl: '1925',
        year: 1925,
        badge: '注',
        body: '“At the Court of an Emperor (he lived it matters not when) there was, among the many gentlewomen of the Wisteria Chamber…” 意译弱化了「女御」「更衣」的位阶差异,让英语读者先读懂故事,再读懂制度。',
      },
      {
        src: '苏未',
        yl: '2024',
        year: 2024,
        badge: '证',
        tag: '入木',
        sig: '苏未',
        date: '2024 年 秋',
        body: '母亲走后重读这一句,忽然明白开篇「不知是哪一朝」的写法,是紫式部在提醒我们:接下来要写的不是历史,是任何时代都会发生的偏爱与嫉妒——包括我自己家里那种。',
      },
      {
        src: '陆知遥',
        yl: '2026',
        year: 2026,
        badge: '疑',
        tag: '青芽',
        sprout: true,
        follow: '2 年后 · 接续 苏未',
        sig: '陆知遥',
        date: '2026 年 春',
        body: 'Waley 后来把桐壺更衣译成「the lady of the Paulownia Court」,可原文从没给过她一个名字。是我们比紫式部更想知道她是谁,还是没有名字,才是这本书真正想写的?',
      },
    ],
  },
  {
    text: 'はじめより我はと思ひ上がりたまへる御方々、めざましきものにおとしめそねみたまふ。',
    earliest: 1362,
    strata: [
      {
        src: '四辻善成《河海抄》',
        yl: '1362 前后',
        year: 1362,
        badge: '注',
        body: '平安朝的后妃多由外戚家族送入宫中,恩宠背后连着一整个家族的政治筹码。这一句的嫉妒,从不只是私情,也是家族之间的代理战争。',
      },
      {
        src: '林见山',
        yl: '2025',
        year: 2025,
        badge: '疑',
        tag: '青芽',
        sprout: true,
        sig: '林见山',
        date: '2025 年 冬',
        body: '「めざましきもの」——看不顺眼到近乎刺眼的嫉妒。放到今天的职场里读,竟一点也不陌生:恩宠有限,资源有限,嫉妒从来都精确计算得很。',
      },
    ],
  },
  {
    text: '同じほど、それより下臈の更衣たちは、ましてやすからず。',
    earliest: null,
    strata: [],
  },
  {
    text: '朝夕の宮仕へにつけても、人の心をのみ動かし、恨みを負ふ積もりにやありけむ、いと篤しくなりゆき、もの心細げに里がちなるを、いよいよあかずあはれなるものに思ほして、人のそしりをもえ憚らせたまはず、世のためしにもなりぬべき御もてなしなり。',
    earliest: 1796,
    strata: [
      {
        src: '本居宣长《玉の小栉》',
        yl: '1796',
        year: 1796,
        badge: '注',
        body: '「あはれなるもの」——全书反复出现数百次的「あはれ」,第一次在此显影:帝越是被人非议,越是心疼更衣,这种明知不可为而更深陷的情感,正是「物哀」的原型。',
      },
      {
        src: 'Edward Seidensticker',
        yl: '1976',
        year: 1976,
        badge: '注',
        body: '“It may have been because she had to be conscious always of this displeasure that…” 尽量贴合原文的迂回句法,把「恨みを負ふ積もりにや」译得同样犹疑不定——他不替紫式部把话说满。',
      },
      {
        src: '苏未',
        yl: '2024',
        year: 2024,
        badge: '证',
        tag: '入木',
        sig: '苏未',
        date: '2024 年 秋',
        body: '照顾一个人到「もの心细げに里がちなる」的地步,身边的闲话只会越来越多——这句话让我想起自己陪病房那半年,越用力,越被说闲话,越被说,越不敢松手。',
      },
    ],
  },
]

function pct(y: number) {
  return (((y - MIN) / (MAX - MIN)) * 100).toFixed(2) + '%'
}

function yearLabel(y: number) {
  const yr = Math.round(y)
  return yr >= MAX ? '今 · 2026' : '公元 ' + yr
}

export default function GenjiReader() {
  const [night, setNight] = useState(false)
  const [displayYear, setDisplayYear] = useState<number>(MAX)
  const [targetYear, setTargetYear] = useState<number>(MAX)
  const [sweeping, setSweeping] = useState(true)
  const [dragged, setDragged] = useState(false)
  const [hoverTick, setHoverTick] = useState('')
  const [open, setOpen] = useState<number | null>(null)
  const [layersVisible, setLayersVisible] = useState(false)
  const [foldAi, setFoldAi] = useState(false)
  const [compareIdx, setCompareIdx] = useState<number | null>(null)
  const [wallFoot, setWallFoot] = useState(false)
  const [wallDrawer, setWallDrawer] = useState(false)

  const reducedRef = useRef(false)
  const draggingRef = useRef(false)
  const sweepRafRef = useRef<number>(0)
  const layerTimerRef = useRef<number>(0)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  // Intro sweep: the axis grows from 1000 to today on first load, echoing 老树's "growth" motif.
  useEffect(() => {
    reducedRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reducedRef.current) {
      setSweeping(false)
      setDisplayYear(MAX)
      setTargetYear(MAX)
    } else {
      setDisplayYear(MIN)
      setTargetYear(MIN)
      const dur = 3600
      const delay = 500
      const t0 = performance.now()
      const step = (t: number) => {
        const p = Math.min(1, (t - t0 - delay) / dur)
        if (p < 0) {
          sweepRafRef.current = requestAnimationFrame(step)
          return
        }
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        const y = MIN + (MAX - MIN) * e
        if (p < 1) {
          setDisplayYear(y)
          setTargetYear(y)
          sweepRafRef.current = requestAnimationFrame(step)
        } else {
          setDisplayYear(MAX)
          setTargetYear(MAX)
          setSweeping(false)
        }
      }
      sweepRafRef.current = requestAnimationFrame(step)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const d = e.key === 'ArrowLeft' ? -20 : 20
        setTargetYear((y) => Math.max(MIN, Math.min(MAX, y + d)))
        setDragged(true)
      } else if (e.key === 'Escape') {
        setOpen(null)
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(sweepRafRef.current)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ease displayYear toward targetYear once the intro sweep has finished.
  useEffect(() => {
    if (sweeping) return
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      setDisplayYear((dy) => {
        const diff = targetYear - dy
        if (Math.abs(diff) > 0.4) return dy + diff * (reducedRef.current ? 1 : 0.12)
        return targetYear
      })
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sweeping, targetYear])

  const yearFromClientX = useCallback((clientX: number, rect: DOMRect) => {
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(MIN + p * (MAX - MIN))
  }, [])

  const trackDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (sweeping) {
        cancelAnimationFrame(sweepRafRef.current)
        setSweeping(false)
      }
      e.currentTarget.setPointerCapture(e.pointerId)
      draggingRef.current = true
      const rect = e.currentTarget.getBoundingClientRect()
      setTargetYear(yearFromClientX(e.clientX, rect))
      setDragged(true)
    },
    [sweeping, yearFromClientX],
  )

  const trackMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      const rect = e.currentTarget.getBoundingClientRect()
      setTargetYear(yearFromClientX(e.clientX, rect))
    },
    [yearFromClientX],
  )

  const trackUp = useCallback(() => {
    draggingRef.current = false
    setTargetYear((t) => {
      let best: number | null = null
      for (const ev of EVENTS) {
        if (best === null || Math.abs(ev.y - t) < Math.abs(best - t)) best = ev.y
      }
      return best !== null && Math.abs(best - t) <= 12 ? best : t
    })
  }, [])

  const stepEvent = useCallback((dir: number) => {
    setSweeping(false)
    setDragged(true)
    setTargetYear((t) => {
      const ys = EVENTS.map((e) => e.y).sort((a, b) => a - b)
      if (dir > 0) {
        const n = ys.find((y) => y > t + 0.5)
        return n ?? MAX
      }
      const p = [...ys].reverse().find((y) => y < t - 0.5)
      return p ?? MIN
    })
  }, [])

  const openRoom = useCallback((i: number) => {
    setOpen(i)
    setLayersVisible(false)
    setWallDrawer(false)
    window.clearTimeout(layerTimerRef.current)
    layerTimerRef.current = window.setTimeout(() => setLayersVisible(true), 60)
  }, [])

  const dy = displayYear
  const yr = Math.round(dy)
  const currentSentence = open != null ? SENTENCES[open] : null

  const layers = useMemo(() => {
    if (!currentSentence) return []
    return currentSentence.strata.map((L, i) => {
      const folded = !!L.ai && foldAi
      const on = L.year <= dy + 0.5
      return {
        ...L,
        idx: i,
        folded,
        full: !folded,
        opacity: on ? 1 : 0.13,
        delay: i * 0.07 + 's',
        lineTop: i === 0 || L.follow ? 'transparent' : 'var(--line)',
        srcColor: L.ai ? 'var(--ink-light)' : 'var(--ink)',
        bodyColor: L.ai ? 'var(--ink-light)' : 'var(--ink)',
        accent: L.sprout ? 'var(--verdigris)' : 'var(--cinnabar)',
        sigLine: L.tag ? `—— ${L.sig} · ${L.date}` : '',
      }
    })
  }, [currentSentence, foldAi, dy])

  const underlineColor = (i: number) => {
    const s = SENTENCES[i]
    if (!s.earliest) return 'transparent'
    if (open === i) return 'var(--cinnabar)'
    return dy + 0.5 >= s.earliest ? 'var(--u-soft)' : 'transparent'
  }

  const hintLabel = sweeping
    ? '一千零二十年,正在生长——'
    : hoverTick || (dragged ? '' : '点一枚刻度、按 ‹ › 逐层走,或拖动圆点')

  const compareActive = compareIdx != null && dy + 0.5 >= 1225

  return (
    <div className="reader-page">
      <Header night={night} onToggleNight={toggleNight} home="/books/genji" />

      <div className="reader-slider" data-screen-label="时间滑杆">
        <div className="reader-slider-inner">
          <div className="reader-slider-labels">
            <span className="onum">1000</span>
            <span className="reader-slider-hint">{hintLabel}</span>
            <span>今</span>
          </div>
          <div className="reader-slider-row">
            <span className="reader-step" title="上一处年轮" onClick={() => stepEvent(-1)}>
              ‹
            </span>
            <div
              className="reader-track"
              onPointerDown={trackDown}
              onPointerMove={trackMove}
              onPointerUp={trackUp}
              tabIndex={0}
              role="slider"
              aria-label="年轮轴:拖动或点击回到任何一年"
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={yr}
            >
              <div className="reader-track-base" />
              <div className="reader-track-fill" style={{ width: pct(Math.max(MIN, Math.min(MAX, dy))) }} />
              {EVENTS.map((ev, i) => (
                <div
                  key={i}
                  className="reader-tick"
                  style={{ left: pct(ev.y), opacity: ev.y <= dy + 0.5 ? 0.9 : 0.18 }}
                  onClick={() => {
                    setSweeping(false)
                    setDragged(true)
                    setTargetYear(ev.y)
                  }}
                  onMouseEnter={() => setHoverTick(ev.label)}
                  onMouseLeave={() => setHoverTick('')}
                >
                  <div className="reader-tick-dot" style={{ background: ev.cin ? 'var(--cinnabar)' : 'var(--ink-light)' }} />
                </div>
              ))}
              <div className="reader-handle" style={{ left: pct(Math.max(MIN, Math.min(MAX, dy))) }}>
                <div className="reader-handle-ring">
                  <div className="reader-handle-dot" />
                </div>
                <div className="reader-handle-label onum">{yearLabel(dy)}</div>
              </div>
            </div>
            <span className="reader-step" title="下一处年轮" onClick={() => stepEvent(1)}>
              ›
            </span>
          </div>
        </div>
      </div>

      <div className="reader-body">
        <div className="reader-column" data-screen-label="阅读页 · 第一帖 桐壺">
          <div className="reader-crumb">
            <Link to="/books/genji" title="回到这本书的传记" className="link-muted">
              源氏物語
            </Link>
            <span className="reader-crumb-sep"> · 第一帖 桐壺</span>
          </div>

          <div className="reader-text">
            <div className="reader-line">
              <span
                className="reader-openable"
                style={{ borderBottomColor: underlineColor(0) }}
                onClick={() => openRoom(0)}
              >
                いづれの御時にか、女御、
                <span
                  className="reader-compare-word"
                  style={{ borderBottomColor: dy >= 1225 ? 'var(--cinnabar)' : 'transparent' }}
                  onMouseEnter={() => dy >= 1225 && setCompareIdx(0)}
                  onMouseLeave={() => setCompareIdx(null)}
                >
                  更衣あまたさぶらひたまひける
                </span>
                中に、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。
              </span>
            </div>
            <div className="reader-line reader-line-plain">
              <span
                className="reader-openable"
                style={{ borderBottomColor: underlineColor(1) }}
                onClick={() => openRoom(1)}
              >
                はじめより我はと思ひ上がりたまへる御方々、めざましきものにおとしめそねみたまふ。
              </span>
            </div>
            <div className="reader-line reader-line-plain">同じほど、それより下臈の更衣たちは、ましてやすからず。</div>
            <div className="reader-line">
              <span
                className="reader-openable"
                style={{ borderBottomColor: underlineColor(3) }}
                onClick={() => openRoom(3)}
              >
                朝夕の宮仕へにつけても、人の心をのみ動かし、恨みを負ふ積もりにやありけむ、いと篤しくなりゆき、もの心細げに里がちなるを、いよいよあかずあはれなるものに思ほして、人のそしりをもえ憚らせたまはず、世のためしにもなりぬべき御もてなしなり。
              </span>
            </div>
          </div>

          <div className="reader-compare-caption" style={{ opacity: compareActive ? 1 : 0 }}>
            青表纸本「候ひたまひける」<span className="cin"> · </span>河内本系「さぶらひたまひける」
            <span className="onum reader-compare-year"> 1225 年校订,此后两条源流并行至今</span>
          </div>

          <div className="reader-wall">
            {!wallFoot ? (
              <span className="link-muted reader-wall-link" onClick={() => setWallFoot(true)}>
                抄录本帖,获得落笔资格 →
              </span>
            ) : (
              <span className="reader-wall-note">
                读是自由的。落笔与问路,需要一个名字。 <span className="cin">→ 留下名字</span>
              </span>
            )}
          </div>
        </div>

        <div className="reader-drawer" style={{ width: open != null ? 476 : 0 }}>
          <div className="reader-drawer-inner">
            <div className="reader-drawer-head">
              <span className="reader-drawer-title">一句话的地层</span>
              <div className="reader-drawer-actions">
                <span className="link-muted" onClick={() => setFoldAi((v) => !v)}>
                  {foldAi ? '展开底图' : '折叠底图'}
                </span>
                <span className="link-muted" onClick={() => setOpen(null)}>
                  收起
                </span>
              </div>
            </div>

            {currentSentence && (
              <>
                <div className="reader-open-text">{currentSentence.text}</div>
                {layersVisible && (
                  <div>
                    {layers.map((L) => (
                      <div key={L.idx} style={{ opacity: L.opacity, transition: 'opacity .45s ease' }}>
                        <div style={{ animation: 'layerIn .45s ease-out both', animationDelay: L.delay }}>
                          {L.follow && (
                            <div className="reader-follow">
                              <div className="reader-follow-line" />
                              <span>{L.follow}</span>
                            </div>
                          )}
                          {L.folded ? (
                            <div
                              className="reader-fold-toggle"
                              style={{ borderTopColor: L.lineTop }}
                              onClick={() => setFoldAi((v) => !v)}
                            >
                              底图 · AI 整理 · 已折叠 →
                            </div>
                          ) : (
                            <div className="reader-layer" style={{ borderTopColor: L.lineTop }}>
                              {L.ai && <div className="reader-layer-ai-badge">底图 · AI 整理</div>}
                              <div className="reader-layer-head">
                                <span className="reader-layer-src" style={{ color: L.srcColor }}>
                                  {L.src}
                                </span>
                                <span className="reader-layer-yl onum">{L.yl}</span>
                                {L.badge && (
                                  <span className="reader-layer-badge" style={{ color: L.accent, borderColor: L.accent }}>
                                    {L.badge}
                                  </span>
                                )}
                                {L.tag && (
                                  <span className="reader-layer-tag" style={{ color: L.accent }}>
                                    {L.tag}
                                  </span>
                                )}
                              </div>
                              <div className="reader-layer-body" style={{ color: L.bodyColor }}>
                                {L.body}
                              </div>
                              {L.sigLine && (
                                <div className="reader-layer-sig" style={{ color: L.accent }}>
                                  {L.sigLine}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="reader-drawer-foot">
                      {!wallDrawer ? (
                        <span className="cin reader-wall-link" onClick={() => setWallDrawer(true)}>
                          在此落笔 →
                        </span>
                      ) : (
                        <span className="reader-wall-note">
                          读是自由的。落笔与问路,需要一个名字。{' '}
                          <span className="cin">→ 留下名字</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
