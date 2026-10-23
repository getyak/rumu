import { Fragment, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import type { StrataLayer } from '../books/types'
import './DaodejingStudy.css'

type AgentKey = 'guide' | 'laozi' | 'guanyin' | 'scribe'

type AgentRole = {
  key: AgentKey
  name: string
  tagline: string
  intro: string
  quick: string[]
  reply: (question: string, verseText?: string) => string
}

const AGENTS: AgentRole[] = [
  {
    key: 'guide',
    name: '守树人',
    tagline: '为你标出这一章的地脉。',
    intro:
      '此章讲「有」「无」相资。你可以先看第一句「三十辐,共一毂」——车轮的中空,是车之用。三个比喻,一个结论。',
    quick: ['这一章讲什么?', '哪一句最难?', '为什么第十一章开始?'],
    reply: (q) => {
      if (q.includes('什么'))
        return '一句话:器物之所以有用,不因它「有」,而因它「中空」。轮、器、室,三个比喻,证一个结论——有之以为利,无之以为用。'
      if (q.includes('难'))
        return '最难的是最后一句「有之以为利,无之以为用」——历代注家对「利」和「用」的分法都不同。可以切到 关尹 试试反问自己。'
      if (q.includes('第十一章'))
        return '这是「老树」把《道德经》种下的第一节。选它,是因为这一章可以只用五个日常物件说清整本书。'
      return '守树人在此。你可以问:这一章讲什么、哪一句最难、为什么第十一章开始。'
    },
  },
  {
    key: 'laozi',
    name: '老聃',
    tagline: '与作者(传说中的)对坐。',
    intro: '我不写书。你若非要我说——车成于毂,毂成于空;器成于形,形成于空。你所见者形,所用者空。',
    quick: ['你为何西出函谷?', '「无」是什么?', '「无为」难否?'],
    reply: (q) => {
      if (q.includes('函谷') || q.includes('西出'))
        return '我不去,关尹便不留我。留我便索书。索书便有此五千字。皆非我意,顺势而已。'
      if (q.includes('无为'))
        return '「无为」不是不做,是不「妄为」。木有节,顺节而斫;水有势,顺势而引。逆之则费力,顺之则成事。'
      if (q.includes('无'))
        return '「无」非空无一物,是「未被填满」的可能。杯空,故能盛;室空,故能居。若已满,则不能再受。'
      return '你说,你说。我听着。'
    },
  },
  {
    key: 'guanyin',
    name: '关尹',
    tagline: '反问你,直到你说不下去。',
    intro: '你说「无之以为用」——那我问你:今日你身上,哪一处是「无」在为你用?',
    quick: ['杯空是用,那杯壁呢?', '房间空着,还是用吗?', '「无」需要「有」吗?'],
    reply: (q) => {
      if (q.includes('杯壁'))
        return '若无杯壁,「空」在何处?若无「空」,杯壁又围什么?——你说,是杯壁成就了空,还是空成就了杯壁?'
      if (q.includes('房间') || q.includes('空着'))
        return '一间无人住、无物存的空房,和被围出来「等待被用」的空,是同一种「无」吗?'
      if (q.includes('需要'))
        return '若「无」不需要「有」为边界,那广袤虚空为何不是最大的用?你自己想想。'
      return '再问一次——你确定你说的是同一个「无」吗?'
    },
  },
  {
    key: 'scribe',
    name: '抄经生',
    tagline: '把你说过的话,誊在竹简上。',
    intro: '你每句话,我都记下。想调出来时,叫我一声。',
    quick: ['把这段话存下', '给我一段总结', '标出我今日的疑'],
    reply: (q) => {
      if (q.includes('存') || q.includes('记'))
        return '已记。今日抄本第 3 简,存于「学修·青芽」卷。'
      if (q.includes('总结'))
        return '今日读第十一章。停留最久:「有之以为利,无之以为用」。生疑:利与用之分。未解。'
      if (q.includes('疑'))
        return '青芽 · 一则:「杯壁是利,杯空是用——那手握住杯子的时候,握住的是利,还是用?」'
      return '记。'
    },
  },
]

/**
 * 道德經 · 学修 — a bespoke study page for one book only.
 * Distinct from the shared Reading.tsx: three-column atmosphere
 * (河图 · 章句 · 问道) rather than the generic time-slider reader.
 */
export default function DaodejingStudy() {
  const book = getBook('daodejing')
  const { night, toggleNight } = useNightMode()
  const [openVerse, setOpenVerse] = useState<number | null>(0)
  const [agent, setAgent] = useState<AgentKey>('guide')
  const [thread, setThread] = useState<{ who: 'you' | 'agent'; text: string }[]>([])
  const [input, setInput] = useState('')

  const activeAgent = useMemo(() => AGENTS.find((a) => a.key === agent)!, [agent])

  if (!book) return <Navigate to="/" replace />

  const verses = book.chapter.sentences

  const ask = (question: string) => {
    if (!question.trim()) return
    const verseText = openVerse != null ? verses[openVerse]?.text : undefined
    const reply = activeAgent.reply(question, verseText)
    setThread((t) => [...t, { who: 'you', text: question }, { who: 'agent', text: reply }])
    setInput('')
  }

  return (
    <div className="dd-page">
      <Header
        night={night}
        onToggleNight={toggleNight}
        links={[
          { label: '书籍详情', to: `/book/${book.id}` },
          { label: '通用阅读', to: `/book/${book.id}/read` },
          { label: '我的树', to: '/my-tree' },
        ]}
      />

      <div className="dd-shell">
        <p role="note">交互原型：人物对话为演绎，回复使用预设内容。输入只保留在当前页面，刷新后清空。</p>
        <div className="dd-hero">
          <div>
            <div className="dd-hero-title">道德經 · 学修</div>
            <div className="dd-hero-sub">第十一章 · 有之以为利,无之以为用</div>
          </div>
          <div className="dd-hero-sub">河图 · 章句 · 问道 · 三区并观</div>
        </div>

        {/* — 河图 · 概览地脉 ————————————————————————— */}
        <aside className="dd-map">
          <div className="dd-map-label">河 图</div>

          <div className="dd-map-section">
            <h4>本章句读</h4>
            {verses.map((v, i) => (
              <div
                key={i}
                className={`dd-map-item ${openVerse === i ? 'is-active' : ''}`}
                onClick={() => setOpenVerse(i)}
              >
                <span className="dd-map-year">句 {i + 1}</span>
                <span className="dd-map-name">{v.text.slice(0, 8)}…</span>
              </div>
            ))}
          </div>

          <div className="dd-map-section">
            <h4>历代身影</h4>
            {book.bio.slice(0, 6).map((n, i) => (
              <div key={i} className="dd-map-item">
                <span className="dd-map-year">{n.yl}</span>
                <span className="dd-map-name">{n.who}</span>
              </div>
            ))}
          </div>

          <div className="dd-map-section">
            <h4>今 · 读者留痕</h4>
            {book.rings.map((r, i) => (
              <div key={i} className="dd-map-item">
                <span className="dd-map-year">{r.date}</span>
                <span className="dd-map-name">
                  {r.name} · {r.tag}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* — 章句 · 精读区 ————————————————————————— */}
        <main className="dd-scripture">
          <div className="dd-chapter-label">{book.chapter.label}</div>
          <div className="dd-chapter-caption">点开一句,看它如何被两千年反复读过</div>

          <div className="dd-verses">
            {verses.map((v, i) => {
              const isOpen = openVerse === i
              return (
                <div
                  key={i}
                  className={`dd-verse ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenVerse(isOpen ? null : i)}
                >
                  <div className="dd-verse-text">{v.text}</div>
                  <div className="dd-verse-hint">
                    {v.strata.length > 0
                      ? `${v.strata.length} 层年轮 · 点开细看`
                      : '此句尚未生长年轮'}
                  </div>

                  {isOpen && (
                    <div className="dd-verse-body" onClick={(e) => e.stopPropagation()}>
                      {v.compare && (
                        <div className="dd-compare">
                          <div>
                            <div className="dd-compare-col-label">通行本</div>
                            <div>{v.text}</div>
                          </div>
                          <div>
                            <div className="dd-compare-col-label">帛书 · 前 168 年</div>
                            <div>{v.compare.footnote}</div>
                          </div>
                        </div>
                      )}

                      {v.strata.length === 0 && (
                        <div className="dd-verse-empty">此句年轮待生长——被读一次,就多一层。</div>
                      )}

                      <div className="dd-strata">
                        {v.strata.map((s: StrataLayer, si: number) => {
                          const cls = [
                            'dd-stratum',
                            s.ai ? 'is-ai' : '',
                            s.sprout ? 'is-sprout' : '',
                            s.tag === '入木' ? 'is-inmu' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')
                          return (
                            <div key={si} className={cls}>
                              {s.follow && <div className="dd-stratum-follow">{s.follow}</div>}
                              <div className="dd-stratum-head">
                                <span className="dd-stratum-src">{s.src}</span>
                                <span className="dd-stratum-year">{s.yl}</span>
                                {s.badge && <span className="dd-stratum-badge">{s.badge}</span>}
                                {s.tag && <span className="dd-stratum-badge">{s.tag}</span>}
                              </div>
                              <div className="dd-stratum-body">{s.body}</div>
                              {(s.sig || s.date) && (
                                <div className="dd-stratum-sig">
                                  {s.sig ?? ''}
                                  {s.date ? ` · ${s.date}` : ''}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* — 问道 · agent ————————————————————————— */}
        <aside className="dd-agent">
          <div className="dd-agent-label">问 道</div>

          <div className="dd-agent-tabs">
            {AGENTS.map((a) => (
              <button
                key={a.key}
                className={`dd-agent-tab ${agent === a.key ? 'is-active' : ''}`}
                onClick={() => {
                  setAgent(a.key)
                  setThread([])
                }}
              >
                {a.name}
              </button>
            ))}
          </div>

          <div className="dd-agent-role">
            <strong>{activeAgent.name}</strong>
            {activeAgent.tagline}
            <div style={{ marginTop: 6, color: 'var(--ink-light)' }}>{activeAgent.intro}</div>
          </div>

          <div className="dd-agent-quick">
            {activeAgent.quick.map((q) => (
              <button key={q} onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>

          {thread.length > 0 && (
            <div className="dd-agent-thread">
              {thread.map((m, i) => (
                <Fragment key={i}>
                  <div className={`dd-msg ${m.who === 'you' ? 'dd-msg-user' : 'dd-msg-agent'}`}>
                    {m.text}
                  </div>
                </Fragment>
              ))}
            </div>
          )}

          <div className="dd-agent-input">
            <input
              placeholder="向此角色发问…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') ask(input)
              }}
            />
            <button onClick={() => ask(input)}>发问</button>
          </div>

          <div className="dd-agent-foot">
            四位角色皆为脚本化伴读,尚未接入模型。当前所观:
            {openVerse != null ? `「${verses[openVerse]?.text.slice(0, 12)}…」` : '(未选句)'}
          </div>
        </aside>
      </div>
    </div>
  )
}
