import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import './Genji.css'

/**
 * 源氏物语 · 一本书的传记 (a book's biography)
 *
 * Port of the same pattern as the unbuilt `老树 · 道德经.dc.html` prototype —
 * a book's detail page told as a timeline of who kept it alive, not a blurb.
 * Content here is a different theme: Murasaki Shikibu's 11th-century Tale of
 * Genji, generally regarded as the world's first great novel.
 *
 * Each node is a real, dateable moment in the book's transmission. The final
 * node is "still being written" and carries reader annotations (年轮),
 * mirroring 我的树's 朱砂/青绿 leaf convention: 入木 = enshrined, 青芽 = sprout.
 */

type SpecialBox = {
  /** heading, e.g. "经文在此改变" */
  label: string
  columns: [string, string]
  rows: [string, string][]
  note?: string
}

type TimelineNode = {
  year: string
  who: string
  story: string
  /** a short, safely-quotable anchor — a term or chapter title, not invented prose */
  anchor?: string
  /** a moment where the text itself forked or was re-founded */
  special?: SpecialBox
  /** marks the final "still being written" node — renders reader rings below it */
  today?: boolean
  /** renders the year in cinnabar, for turning points */
  cinnabar?: boolean
}

type Ring = {
  name: string
  badge: '注' | '疑' | '证' | '驳'
  tag: '入木' | '青芽'
  date: string
  text: string
  wood?: boolean
}

const NODES: TimelineNode[] = [
  {
    year: '约 1008 年',
    who: '藤原道长的一句调笑',
    story:
      '现存最早提到这部小说存在的文字,来自紫式部自己的日记:一条天皇朝的权臣藤原道长路过她的房间,笑着把她比作书中人物。日记没提书名,但后世学者认定,那时《源氏物语》至少已写到了「若紫」一帖。',
    anchor: '若紫',
  },
  {
    year: '平安末期(约 12 世纪)',
    who: '无名画师与书家',
    story:
      '紫式部的亲笔手稿从未留存于世。留下来的最古老的具象证据,是几卷绘卷:词书与大和绘交替,把文字之外的表情画了出来。四卷残卷后来分藏于德川美术馆与五岛美术馆,今天都是日本国宝。',
  },
  {
    year: '约 1225 年',
    who: '藤原定家校订「青表纸本」',
    story:
      '和歌世家出身的藤原定家,凭个人学识与手头能找到的写本,校定出一部他认为「雅正」的文本,因封面用浅蓝纸而得名「青表纸本」。他未必想过,这份私人校本会成为此后八百年绝大多数印本的祖先。',
  },
  {
    year: '约 1255 年',
    who: '源光行、亲行父子完成「河内本」',
    story:
      '几乎同一时代,另一支学者广搜诸本、以「存异」而非「求正」为原则,编成「河内本」。镰仓中期它一度比青表纸本流传更广——一部没有作者亲笔的书,从此有了两个说法不完全相同的自己。',
    special: {
      label: '一部书,两个祖本',
      columns: ['青表纸本 · 藤原定家系统', '河内本 · 源光行、亲行系统'],
      rows: [
        ['凭个人学识校订,力求「雅正」一种读法', '广搜诸本,宁可「存异」也不轻易删定'],
        ['镰仓晚期起渐成主流', '镰仓中期一度流传更广'],
        ['今天几乎所有排印本、译本的底本', '多数抄本后世散佚,仅存零篇'],
      ],
      note: '两支文本字句多有出入——今天读到的「源氏」,其实是一场持续了八百年的校勘选择。',
    },
    cinnabar: true,
  },
  {
    year: '江户中期(18 世纪)',
    who: '本居宣长提出「物哀」',
    story:
      '在此之前,《源氏物语》长期被读作劝善惩恶的教训之书。国学家本居宣长反其道而言:这本书教人的不是道德,而是「知物哀」——感于物而心为之动。这个词后来成了理解整部作品,乃至日本古典美学的钥匙。',
    anchor: '物の哀れ',
  },
  {
    year: '江户时代',
    who: '香道座上的「源氏香」',
    story:
      '贵族女性的香道游戏里,五炷香的组合方式恰有五十二种,被一一对应到五十四帖中除首尾外的五十二个帖名,画成图案。这些「源氏香之图」后来印上和服与家纹,不识字也能在生活里认得这本书。',
  },
  {
    year: '1925–1933 年',
    who: 'Arthur Waley 六卷英译',
    story:
      '汉学家兼日本学者 Arthur Waley 译出 The Tale of Genji,分六卷陆续出版。英语世界第一次完整读到这部常被称为「世界最早长篇小说」的作品——此后西方每一个新译本,都要先回答:同不同意 Waley 的取舍。',
  },
  {
    year: '1939 年起,三度重译',
    who: '谷崎润一郎的「现代语译」',
    story:
      '古典日语对多数现代日本人已如外语。小说家谷崎润一郎将全书译为当代日文,此后又两次重译修订,前后跨越二十余年——一位当世文豪,把一千年前的宫廷日语,重新交回给普通读者。',
  },
  {
    year: '1979–1993 年',
    who: '山本和纪《浅梦》连载十四年',
    story:
      '漫画家やまと和纪把全书画成少女漫画《あさきゆめみし》(浅梦),连载十四年才完结。它让《源氏物语》第一次成为一代日本少女的枕边书——比任何学术译本传播得都远。',
  },
  {
    year: '2001 年',
    who: 'Royall Tyler 新英译本',
    story:
      '学者 Royall Tyler 推出新译本,附大量脚注,力图还原平安宫廷的官职称谓、四季节令与含蓄措辞。相比 Waley 的意译,这个版本把「难读」也一并译了出来。',
  },
  {
    year: '2008 年',
    who: '「源氏物语千年纪」',
    story:
      '以 1008 年那则日记为起点,日本各地——尤其是京都——举办了一整年的纪念活动,称这本书满一千岁。一份私人日记里的调笑,一千年后成了一个国家的纪念日。',
    cinnabar: true,
  },
  {
    year: '今 · 2026',
    who: '这本书仍在被写下',
    story: '时间线的最后一站,是正在生长的年轮。最近入木与新生的批注:',
    today: true,
    cinnabar: true,
  },
]

const RINGS: Ring[] = [
  {
    name: '沈一苇',
    badge: '证',
    tag: '入木',
    date: '2024',
    wood: true,
    text: '光源氏一生追的都是「像谁」的人——像已故的桐壶更衣。这两年才懂,他爱的从来不是替身本身,是替身没法替的那部分空缺。',
  },
  {
    name: '周菡',
    badge: '疑',
    tag: '青芽',
    date: '2025',
    text: '物哀,是先知道会散,才敢去爱吗?还是爱到深处,才不得不知道会散?',
  },
  {
    name: '陈拾',
    badge: '注',
    tag: '青芽',
    date: '2026',
    text: '雲隠一帖有目无文——源氏之死,作者干脆不写。空白比任何一句话都更响。',
  },
]

function useRevealOnScroll(count: number) {
  const [seen, setSeen] = useState<Record<number, boolean>>({})
  const ioRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !window.IntersectionObserver) {
      const all: Record<number, boolean> = {}
      for (let i = 0; i < count; i++) all[i] = true
      setSeen(all)
      return
    }
    ioRef.current = new IntersectionObserver(
      (entries) => {
        setSeen((prev) => {
          let changed = false
          const next = { ...prev }
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.getAttribute('data-node'))
              if (!next[idx]) {
                next[idx] = true
                changed = true
                ioRef.current?.unobserve(entry.target)
              }
            }
          })
          return changed ? next : prev
        })
      },
      { threshold: 0.12 },
    )
    const observe = () => document.querySelectorAll('[data-node]').forEach((el) => ioRef.current?.observe(el))
    const t1 = setTimeout(observe, 150)
    const t2 = setTimeout(observe, 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      ioRef.current?.disconnect()
    }
  }, [count])

  return seen
}

export default function Genji() {
  const [night, setNight] = useState(false)
  const [askOpen, setAskOpen] = useState<number | null>(null)
  const seen = useRevealOnScroll(NODES.length)

  useEffect(() => {
    document.title = '老树 · 源氏物语 · 一本书的传记'
  }, [])

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  return (
    <div className="page">
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

      <div className="book-hero" data-screen-label="书籍详情 · Hero">
        <div className="book-hero-side" aria-hidden="true">
          もののあはれ
        </div>
        <div className="book-eyebrow">書架 · 日本古典 · 物語</div>
        <h1 className="book-title">源氏物語</h1>
        <div className="book-meta">
          成书于 11 世纪初 · 五十四帖 · 已生长约 1,020 年 · 世界最早的长篇小说之一
        </div>
        <div className="book-tagline">五十四帖,一千年读不尽。</div>
        <div className="book-cta">
          <a className="link-cinnabar" href="/read">
            进入桐壺一帖,亲自读 →
          </a>
        </div>
      </div>

      <div className="timeline-wrap">
        <div className="timeline-label">一本书的传记</div>
        <div className="timeline">
          <div className="timeline-rail" />
          {NODES.map((n, i) => {
            const visible = !!seen[i]
            return (
              <div
                key={i}
                data-node={i}
                className={`t-node${visible ? ' is-visible' : ''}`}
              >
                <div className="t-year" style={{ color: n.cinnabar ? 'var(--cinnabar)' : 'var(--ink-light)' }}>
                  {n.year}
                </div>
                <div className="t-dot" style={{ background: n.cinnabar ? 'var(--cinnabar)' : 'var(--ink-light)' }} />
                <div className="t-who">{n.who}</div>
                <div className="t-story">{n.story}</div>

                {n.anchor && <div className="t-anchor">{n.anchor}</div>}

                {n.special && (
                  <div className="t-special">
                    <div className="t-special-label">{n.special.label}</div>
                    <div className="t-special-grid">
                      <div className="t-special-head">{n.special.columns[0]}</div>
                      <div className="t-special-head">{n.special.columns[1]}</div>
                      {n.special.rows.map((row, ri) => (
                        <Fragment key={ri}>
                          <div>{row[0]}</div>
                          <div>{row[1]}</div>
                        </Fragment>
                      ))}
                    </div>
                    {n.special.note && <div className="t-special-note">{n.special.note}</div>}
                  </div>
                )}

                {n.today && (
                  <div className="t-rings">
                    {RINGS.map((r, ri) => (
                      <div className="ring-card" key={ri}>
                        <div className="ring-head">
                          <span className="ring-name" style={{ color: r.wood ? 'var(--cinnabar)' : 'var(--verdigris)' }}>
                            {r.name}
                          </span>
                          <span
                            className="ring-badge"
                            style={{ color: r.wood ? 'var(--cinnabar)' : 'var(--verdigris)', borderColor: r.wood ? 'var(--cinnabar)' : 'var(--verdigris)' }}
                          >
                            {r.badge}
                          </span>
                          <span className="ring-tag" style={{ color: r.wood ? 'var(--cinnabar)' : 'var(--verdigris)' }}>
                            {r.tag}
                          </span>
                          <span className="ring-date">{r.date}</span>
                        </div>
                        <div className="ring-text">{r.text}</div>
                      </div>
                    ))}
                    <div className="t-enter">
                      <a className="link-cinnabar" href="/inscribe">
                        进入,亲自落笔 →
                      </a>
                    </div>
                  </div>
                )}

                {!n.today &&
                  (askOpen === i ? (
                    <div className="t-ask-on">
                      读是自由的。落笔与问路,需要一个名字。 <span className="ask-cta">→ 留下名字</span>
                    </div>
                  ) : (
                    <div className="t-ask-off">
                      <span className="link-muted" role="button" tabIndex={0} onClick={() => setAskOpen(i)}>
                        与守树人细究此节 →
                      </span>
                    </div>
                  ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="book-footer">一千年过去,物哀未散。</div>

      <a className="ask-keeper" href="/kaoju">
        问守树人
      </a>
    </div>
  )
}
