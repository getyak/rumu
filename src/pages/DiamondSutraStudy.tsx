import { Fragment, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import type { StrataLayer } from '../books/types'
import './DiamondSutraStudy.css'

type AgentKey = 'subhuti' | 'buddha' | 'kumarajiva' | 'chan'

type AgentRole = {
  key: AgentKey
  name: string
  tagline: string
  intro: string
  quick: string[]
  reply: (question: string) => string
}

const AGENTS: AgentRole[] = [
  {
    key: 'subhuti',
    name: '须菩提',
    tagline: '替你把问题问出口。',
    intro:
      '世尊,我常代人发问,因我知道:很多人不是不懂,是不敢问「这句到底在说什么」。你若有疑,尽管说,我替你问下去。',
    quick: ['这一分讲什么?', '"如如不动"到底是什么状态?', '为什么总是先说"是名"再否定?'],
    reply: (q) => {
      if (q.includes('这一分') || q.includes('讲什么'))
        return '世尊在此分总结全经:说法者,实无法可说;度众生者,实无众生可度。一切名相,说过即遣,遣过仍要说——这便是"应化非真"。'
      if (q.includes('如如不动'))
        return '我曾也困于此。后来明白:"如如"不是石头一样的不动,是不被"这是好、那是坏"的分别心牵着转。心仍在照见万物,只是不再攀附。'
      if (q.includes('是名'))
        return '你看得很准。"佛说 A,即非 A,是名 A"——先说,是因为不能不用语言;再否定,是怕你执着于语言;最后"是名",是告诉你:这只是个方便的称呼,别当真有个实体叫 A。'
      return '你且说说看,是哪一句让你停下来的?我替你转问世尊。'
    },
  },
  {
    key: 'buddha',
    name: '世尊',
    tagline: '不直接给答案,层层反问回你。',
    intro: '须菩提,于意云何?你以为,是有一个"我"在为你解经,还是这解经之事,本来无解经者、无所解之经?',
    quick: ['什么是"如梦幻泡影"?', '为什么"应无所住而生其心"?', '我该如何理解"空"?'],
    reply: (q) => {
      if (q.includes('如梦幻泡影'))
        return '你见过梦醒后,梦中之物还在否?泡灭之后,泡还在否?一切有为之法,生灭不住,如是而已——不是叫你不认真活,是叫你别把无常的东西,认作恒常的。'
      if (q.includes('应无所住'))
        return '你手中若紧握一物不放,还能否再接住下一个递来的东西?心若牢牢粘在一念,又如何生出下一念的清明?不住,是为了能生。'
      if (q.includes('空'))
        return '你问"空"是什么,便已经把"空"也当成了一个"有"来问。空不是"无一物",是"无自性"——一切都在因缘里,没有一个不变的本体。你再想想。'
      return '你且反问自己:提出这个问题的,是谁?这个"谁",可曾找到过?'
    },
  },
  {
    key: 'kumarajiva',
    name: '鸠摩罗什',
    tagline: '译者视角:字句背后的取舍。',
    intro:
      '贫僧于长安逍遥园译此经,凡五千余言。梵本原意繁富,汉语求其可诵、可记、可传世——每一个字,都是一次取舍。',
    quick: ['你为什么把九喻删成六喻?', '"如如不动"这四个字怎么来的?', '你的译本和玄奘的有何不同?'],
    reply: (q) => {
      if (q.includes('九喻') || q.includes('六喻'))
        return '梵本原作星、翳、灯、幻、露、泡、梦、电、云九喻。贫僧删并为梦、幻、泡、影、露、电六喻——为求诵读时朗朗上口,如一首偈,而非一份清单。少三喻,失几分精确;多几分,得千年传诵。'
      if (q.includes('如如不动'))
        return '梵文原词意为"不动、不摇"。贫僧叠"如"字为"如如",取"如其本然"之意——这是我的选择,不是字面直译,是为了让汉语读者一读就懂"不为境转"的意思。'
      if (q.includes('玄奘'))
        return '玄奘法师之译更贴梵本语序,逐字对应,谨严有加;贫僧之译更近汉语心性,求其能背诵、能感发。故千年而下,人诵者众,仍是贫僧此本。孰优孰劣,不必强分,各有所长。'
      return '译经如摆渡人,渡的是意,不是字。你若问某字为何如此译,我大抵都能说出取舍的理由。'
    },
  },
  {
    key: 'chan',
    name: '禅师',
    tagline: '公案式反问,不给你答案。',
    intro: '你读经至此,可曾发现——你一直在"求懂"。求懂本身,也是一种"住"。',
    quick: ['那我该怎么读这部经?', '不给答案,那我怎么办?', '"不取于相"要怎么做到?'],
    reply: (q) => {
      if (q.includes('怎么读'))
        return '喝茶时喝茶,读经时读经。你问"怎么读",这问题本身,就是多出来的一层。'
      if (q.includes('怎么办'))
        return '庭前柏树子。'
      if (q.includes('不取于相'))
        return '你现在正盯着这行字,想"抓住"一个方法。松手看看——不是不看,是看了,不抓。'
      return '……(禅师只是看着你,不说话)'
    },
  },
]

/**
 * 金剛經 · 破执 — a bespoke study page for one book only.
 * Distinct from DaodejingStudy.tsx: the core interaction is dialectic
 * unfolding (正-反-合) of the sutra's "A, non-A, therefore named A"
 * argument structure, not a strata/annotation timeline.
 */
export default function DiamondSutraStudy() {
  const book = getBook('diamondSutra')
  const { night, toggleNight } = useNightMode()
  const [openVerse, setOpenVerse] = useState<number | null>(0)
  const [agent, setAgent] = useState<AgentKey>('subhuti')
  const [thread, setThread] = useState<{ who: 'you' | 'agent'; text: string }[]>([])
  const [input, setInput] = useState('')

  const activeAgent = useMemo(() => AGENTS.find((a) => a.key === agent)!, [agent])

  if (!book) return <Navigate to="/" replace />

  const verses = book.chapter.sentences

  const ask = (question: string) => {
    if (!question.trim()) return
    const reply = activeAgent.reply(question)
    setThread((t) => [...t, { who: 'you', text: question }, { who: 'agent', text: reply }])
    setInput('')
  }

  return (
    <div className="ds-page">
      <Header
        night={night}
        onToggleNight={toggleNight}
        links={[
          { label: '书籍详情', to: `/book/${book.id}` },
          { label: '通用阅读', to: `/book/${book.id}/read` },
          { label: '我的树', to: '/my-tree' },
        ]}
      />

      <div className="ds-shell">
        <p role="note">交互原型：人物对话为演绎，回复使用预设内容。输入只保留在当前页面，刷新后清空。</p>
        <div className="ds-hero">
          <div>
            <div className="ds-hero-title">金剛經 · 破执</div>
            <div className="ds-hero-sub">{book.chapter.label}</div>
          </div>
          <div className="ds-hero-meta">正 · 反 · 合 —— 拆开一句偈语的辩证结构</div>
        </div>

        <div className="ds-layout">
          {/* — 破执 · 正反合三栏 ————————————————————————— */}
          <main>
            <div className="ds-verse-label">经 文</div>
            <div className="ds-verse-caption">
              点开一句,看它如何「说 → 破 → 立」——这正是金刚经反复使用的论证方式
            </div>

            <div className="ds-verses">
              {verses.map((v, i) => {
                const isOpen = openVerse === i
                const triad = TRIADS[i]
                return (
                  <div
                    key={i}
                    className={`ds-verse-card ${isOpen ? 'is-open' : ''}`}
                    onClick={() => setOpenVerse(isOpen ? null : i)}
                  >
                    <div className="ds-verse-original">{v.text}</div>
                    <div className="ds-verse-source">
                      {v.strata.length > 0 ? `${v.strata.length} 家注疏 · 点开细看` : '本经结语 · 无历代分层'}
                    </div>

                    {isOpen && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {triad && (
                          <div className="ds-triad">
                            <div className="ds-triad-col is-zheng">
                              <div className="ds-triad-tag">正 · 名相</div>
                              <div className="ds-triad-text">{triad.zheng}</div>
                              <div className="ds-triad-gloss">{triad.zhengGloss}</div>
                            </div>
                            <div className="ds-triad-arrow">→</div>
                            <div className="ds-triad-col is-fan">
                              <div className="ds-triad-tag">反 · 遮遣</div>
                              <div className="ds-triad-text">{triad.fan}</div>
                              <div className="ds-triad-gloss">{triad.fanGloss}</div>
                            </div>
                            <div className="ds-triad-arrow">→</div>
                            <div className="ds-triad-col is-he">
                              <div className="ds-triad-tag">合 · 假名</div>
                              <div className="ds-triad-text">{triad.he}</div>
                              <div className="ds-triad-gloss">{triad.heGloss}</div>
                            </div>
                          </div>
                        )}

                        {v.compare && <div className="ds-compare-note">{v.compare.footnote}</div>}

                        {v.strata.length > 0 && (
                          <div className="ds-strata">
                            {v.strata.map((s: StrataLayer, si: number) => {
                              const cls = ['ds-stratum', s.ai ? 'is-ai' : '', s.sprout ? 'is-sprout' : '']
                                .filter(Boolean)
                                .join(' ')
                              return (
                                <div key={si} className={cls}>
                                  <div className="ds-stratum-head">
                                    <span className="ds-stratum-src">{s.src}</span>
                                    <span className="ds-stratum-year">{s.yl}</span>
                                    {s.badge && <span className="ds-stratum-badge">{s.badge}</span>}
                                  </div>
                                  <div className="ds-stratum-body">{s.body}</div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </main>

          {/* — 问法 · agent ————————————————————————— */}
          <aside className="ds-agent">
            <div className="ds-agent-label">问 法</div>

            <div className="ds-agent-tabs">
              {AGENTS.map((a) => (
                <button
                  key={a.key}
                  className={`ds-agent-tab ${agent === a.key ? 'is-active' : ''}`}
                  onClick={() => {
                    setAgent(a.key)
                    setThread([])
                  }}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <div className="ds-agent-role">
              <strong>{activeAgent.name}</strong>
              {activeAgent.tagline}
              <div className="ds-agent-intro">{activeAgent.intro}</div>
            </div>

            <div className="ds-agent-quick">
              {activeAgent.quick.map((q) => (
                <button key={q} onClick={() => ask(q)}>
                  {q}
                </button>
              ))}
            </div>

            {thread.length > 0 && (
              <div className="ds-agent-thread">
                {thread.map((m, i) => (
                  <Fragment key={i}>
                    <div className={`ds-msg ${m.who === 'you' ? 'ds-msg-user' : 'ds-msg-agent'}`}>{m.text}</div>
                  </Fragment>
                ))}
              </div>
            )}

            {agent === 'chan' && thread.length === 0 && (
              <div className="ds-koan-strip">禅师通常不主动开口。你若不问,他便只是看着这一分经文,与你一同坐着。</div>
            )}

            <div className="ds-agent-input">
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

            <div className="ds-agent-foot">四位角色皆为脚本化伴读,尚未接入模型。</div>
          </aside>
        </div>
      </div>
    </div>
  )
}

/** 正-反-合 dialectic breakdown for each of the chapter's three sentences. */
const TRIADS: Record<
  number,
  { zheng: string; zhengGloss: string; fan: string; fanGloss: string; he: string; heGloss: string } | null
> = {
  0: {
    zheng: '云何为人演说?',
    zhengGloss: '先立一问:该如何为他人讲说这部经?——这是"名相"层面,还在语言、方法的框架里。',
    fan: '不取于相,',
    fanGloss: '随即遮遣:讲说之法,不在于抓住某种固定的相状、套路。一旦"取相",讲法就变成了执着于形式。',
    he: '如如不动。',
    heGloss: '归于"假名"的安顿:心如其本然,不为所讲之相牵动摇摆——这便是"演说"真正的样子,而非否定演说本身。',
  },
  1: {
    zheng: '一切有为法,',
    zhengGloss: '先说"有"——凡是因缘和合而生的一切现象,都在这一句的范围之内,这是对世界的肯定性描述。',
    fan: '如梦幻泡影,如露亦如电,',
    fanGloss: '随即遮遣其"实有":这些现象生灭不住、刹那即逝,如梦、如泡、如闪电——否定它们有恒常不变的自性。',
    he: '应作如是观。',
    heGloss: '归于"假名"的安顿:不是叫你否定现象的存在,是叫你以"如是"——如其生灭本然——的方式去看待,不多加一分执着。',
  },
}
