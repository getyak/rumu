import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import { Link } from './router'
import './BookGenji.css'

type Ring = {
  name: string
  badge: string
  tag: '入木' | '青芽'
  date: string
  text: string
}

type Node = {
  yl: string
  who: string
  story: string
  anchor?: string
  special?: boolean
  cin?: boolean
  today?: boolean
}

const NODES: Node[] = [
  {
    yl: '1008 年前后',
    who: '紫式部执笔',
    story:
      '紫式部日记中第一次留下「源氏の物语」之名,写于她以女房身份侍读一条天皇中宫彰子期间。此后近千年,再没有人确切知道她动笔的那一天,也没有人见过她的亲笔手稿。',
    anchor: 'いづれの御時にか、女御、更衣あまた候ひたまひける中に……',
  },
  {
    yl: '11 世纪',
    who: '写本时代的散佚',
    story:
      '在印刷术传入日本之前,这本书只靠宫中女房手抄流传。紫式部的原稿从未留存,后世读到的,是抄本的抄本的抄本——每一次转抄,字句都会悄悄漂移一点。',
  },
  {
    yl: '1225 年前后',
    who: '藤原定家「青表纸本」',
    story:
      '歌人藤原定家——《新古今和歌集》的编者之一——将当时纷杂的传抄本重新校订,写成后世通行的底本,因用青色封面装订得名「青表纸本」。此后近八百年,大多数刊本与译本都以此为源头。',
    special: true,
    cin: true,
  },
  {
    yl: '1236 年前后',
    who: '源光行 · 源亲行「河内本」',
    story:
      '与定家同时,源光行、源亲行父子两代人另行校订出一部体系,称「河内本」。两个版本在字句、乃至个别章节顺序上都有出入——这本书从很早起,就不是唯一的一本。',
  },
  {
    yl: '1360 年代',
    who: '四辻善成《河海抄》',
    story:
      '室町时代最重要的注释书之一。四百年后的读者已经读不懂平安朝的官阶、节令与和歌典故,《河海抄》逐句为它们作注——没有这部书,后世多数人将读不懂第一页。',
  },
  {
    yl: '1796 年',
    who: '本居宣长《源氏物语玉の小栉》',
    story:
      '国学者本居宣长在此提出「物哀」（もののあはれ）说:这本书的核心不是儒家式的劝善惩恶,而是对人情世事的感发与共鸣。此后两百年,人们理解这部书的方式被他重新定义。',
  },
  {
    yl: '1925—1933',
    who: 'Arthur Waley 英译',
    story:
      '第一部完整英译本,分六卷出版。译笔自由,略去了不少和歌与官职细节,却第一次让西方读者把它与普鲁斯特相提并论——一部十一世纪的日本宫廷小说,由此进入「世界文学」的谈论范围。',
  },
  {
    yl: '1976 年',
    who: 'Edward Seidensticker 英译',
    story:
      '更贴近原文的新译本,此后数十年成为英语学界的通行译本。他在译序里写道:忠实与可读,几乎永远不能两全,他选择尽量不替紫式部做决定。',
  },
  {
    yl: '1980 年代',
    who: '大和和纪《あさきゆめみし》',
    story:
      '漫画版《浅梦》连载十三年,成为此后数代日本人认识这部书的第一入口——很多人先在漫画里认识了光源氏,很多年后才回头去读平安朝的原文。',
  },
  {
    yl: '2001 年',
    who: 'Royall Tyler 英译',
    story:
      '新译本刻意保留了原文的陌生感:书中人物本就没有姓名,只以官职、居所相称,泰勒没有像前人一样替他们「取名」,而是大量加注,把这种暧昧还给了读者。',
  },
  {
    yl: '今 · 2026',
    who: '这本书仍在被写下',
    story: '时间线的最后一站,是正在生长的年轮。最近入木与新生的批注:',
    today: true,
    cin: true,
  },
]

const RINGS: Ring[] = [
  {
    name: '苏未',
    badge: '证',
    tag: '入木',
    date: '2024',
    text: '母亲走后第二年重读桐壺卷,才明白「亡き人の面影身に添ひて」不是修辞——是那种走到哪儿都带着的重量,帝的哀伤原来一点都不夸张。',
  },
  {
    name: '林见山',
    badge: '疑',
    tag: '青芽',
    date: '2025',
    text: '源氏一生都在追一个替身的替身——藤壺像母亲,紫の上又像藤壺。这算是命运安排给他的诅咒,还是他自己一直在选择重复?',
  },
  {
    name: '陆知遥',
    badge: '疑',
    tag: '青芽',
    date: '2026',
    text: 'Waley 把桐壺更衣译成「the lady of the Paulownia Court」,可原文从没给过她一个名字。是我们比作者更想知道她是谁,还是没有名字才是紫式部真正想写的?',
  },
]

export default function BookGenji() {
  const [night, setNight] = useState(false)
  const [seen, setSeen] = useState<Record<number, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

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
    if (reduced || !('IntersectionObserver' in window)) {
      setSeen(Object.fromEntries(NODES.map((_, i) => [i, true])))
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
                observerRef.current?.unobserve(entry.target)
              }
            }
          }
          return changed ? next : prev
        })
      },
      { threshold: 0.12 },
    )
    observerRef.current = io
    const timers = [150, 1200].map((ms) =>
      window.setTimeout(() => {
        document.querySelectorAll('[data-node]').forEach((el) => io.observe(el))
      }, ms),
    )
    return () => {
      io.disconnect()
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div className="genji-page">
      <Header night={night} onToggleNight={toggleNight} />

      <div className="genji-hero" data-screen-label="书籍详情 · Hero">
        <div className="genji-hero-quote">いづれの御時にか</div>
        <div className="genji-shelf">書架 · 日本古典</div>
        <div className="genji-title">源氏物語</div>
        <div className="genji-meta">
          约成书于公元 1008 年前后 · 五十四帖,近百万言 · 已生长约 1,020 年 · 92 层年轮
        </div>
        <div className="genji-lead">五十四帖,写尽人心与无常。</div>
        <div className="genji-cta">
          <Link to="/books/genji/read" className="link-cinnabar">
            进入第一帖「桐壺」,亲自读 →
          </Link>
        </div>
      </div>

      <div className="genji-timeline" data-screen-label="传记时间线">
        <div className="genji-timeline-label">一本书的传记</div>
        <div className="genji-nodes">
          {NODES.map((n, i) => (
            <div
              key={i}
              data-node={i}
              className="genji-node"
              style={{
                opacity: seen[i] ? 1 : 0,
                transform: seen[i] ? 'none' : 'translateY(20px)',
              }}
            >
              <div className="genji-node-year" style={{ color: n.cin ? 'var(--cinnabar)' : 'var(--ink-light)' }}>
                {n.yl}
              </div>
              <div className="genji-node-dot" style={{ background: n.cin ? 'var(--cinnabar)' : 'var(--ink-light)' }} />
              <div className="genji-node-who">{n.who}</div>
              <div className="genji-node-story">{n.story}</div>
              {n.anchor && <div className="genji-node-anchor">{n.anchor}</div>}

              {n.special && (
                <div className="genji-special">
                  <div className="genji-special-label">经文自此有了两条源流</div>
                  <div className="genji-special-body">
                    定家的「青表纸本」与源氏父子的「河内本」在部分字句、乃至个别章节的先后顺序上互有出入——现存所有刊本与译本,几乎都要先在这两条源流之间做出取舍。
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Link to="/books/genji/read" className="link-cinnabar" style={{ fontSize: 12 }}>
                      在阅读页看这一支源流如何进入通行本 →
                    </Link>
                  </div>
                </div>
              )}

              {n.today && (
                <div className="genji-rings">
                  {RINGS.map((r, ri) => (
                    <div className="genji-ring" key={ri}>
                      <div className="genji-ring-head">
                        <span
                          className="genji-ring-name"
                          style={{ color: r.tag === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)' }}
                        >
                          {r.name}
                        </span>
                        <span
                          className="genji-ring-badge"
                          style={{
                            color: r.tag === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)',
                            borderColor: r.tag === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)',
                          }}
                        >
                          {r.badge}
                        </span>
                        <span
                          className="genji-ring-tag"
                          style={{ color: r.tag === '入木' ? 'var(--cinnabar)' : 'var(--verdigris)' }}
                        >
                          {r.tag}
                        </span>
                        <span className="genji-ring-date">{r.date}</span>
                      </div>
                      <div className="genji-ring-text">{r.text}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 10 }}>
                    <Link to="/books/genji/read" className="link-cinnabar" style={{ fontSize: 13, letterSpacing: '0.14em' }}>
                      进入,亲自落笔 →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="genji-foot">越老的书,年轮越厚。</div>
    </div>
  )
}
