import { useCallback, useState } from 'react'
import './MyTree.css'

/**
 * One branch of the abstract tree.
 * 枝 = a chapter read; 叶 (leaf) = an annotation left;
 * 朱砂 leaf = 入木 (enshrined, alongside the ancients);
 * 青绿 leaf = 青芽 (a sprout, awaiting time & peers);
 * thread = someone continued your line across the years.
 *
 * Hovering / focusing a branch quietly surfaces what you wrote there — the
 * page's one concession to 探索欲, kept as an inline caption, never a bubble.
 */
type LeafKind = '' | 'cinnabar' | 'verdigris'
type State = '入木' | '青芽' | '读过'

type Branch = {
  id: string
  /** chapter label (Chinese numeral) shown on the branch */
  label: string
  /** chapter name for the caption */
  chapter: string
  /** SVG path drawn on as the branch grows */
  d: string
  /** stroke width — upper (younger) branches read thinner */
  w: number
  leaf: LeafKind
  leafAt?: { x: number; y: number }
  labelAt: { x: number; y: number; anchor: 'start' | 'end' }
  drawDelay: string
  leafDelay: string
  state: State
  /** 注/疑/证/驳 — only annotated branches carry a genre */
  genre?: string
  /** the anchored line of scripture */
  source?: string
  /** the annotation itself */
  note?: string
  /** cinnabar signature + date */
  sign?: string
  /** a verdigris "someone continued you" thread hangs off this branch */
  thread?: { d: string; at: { x: number; y: number }; label: string }
}

// Geometry hand-tuned in a 440×360 space for an organic, drawn look.
// Lower branches are longer/older; higher branches shorter/younger.
const BRANCHES: Branch[] = [
  {
    id: 'ch11',
    label: '十一',
    chapter: '第十一章',
    d: 'M 220 250 Q 276 234 332 231',
    w: 1.5,
    leaf: 'cinnabar',
    leafAt: { x: 332, y: 231 },
    labelAt: { x: 342, y: 235, anchor: 'start' },
    drawDelay: '0.9s',
    leafDelay: '1.7s',
    state: '入木',
    genre: '证',
    source: '当其无,有器之用。',
    note: '学陶那年最废的一只碗,是我捏得最厚的那只——几乎没有「无」,盛不下什么。',
    sign: '沈一苇 · 2023 冬',
    thread: { d: 'M 332 231 L 374 205', at: { x: 378, y: 201 }, label: '陈拾 · 3 年后接续' },
  },
  {
    id: 'ch8',
    label: '八',
    chapter: '第八章',
    d: 'M 220 214 Q 168 202 116 196',
    w: 1.4,
    leaf: '',
    labelAt: { x: 106, y: 200, anchor: 'end' },
    drawDelay: '1.15s',
    leafDelay: '1.7s',
    state: '读过',
    source: '上善若水。',
  },
  {
    id: 'ch44',
    label: '四十四',
    chapter: '第四十四章',
    d: 'M 221 176 Q 268 166 312 162',
    w: 1.3,
    leaf: 'verdigris',
    leafAt: { x: 312, y: 162 },
    labelAt: { x: 322, y: 166, anchor: 'start' },
    drawDelay: '1.4s',
    leafDelay: '2.0s',
    state: '青芽',
    genre: '证',
    source: '知足不辱,知止不殆。',
    note: '辞掉第二份工作的那晚我写:知道停在哪里,比知道去哪里难。',
    sign: '沈一苇 · 2025 春',
  },
  {
    id: 'ch22',
    label: '二十二',
    chapter: '第二十二章',
    d: 'M 220 146 Q 178 138 138 134',
    w: 1.2,
    leaf: '',
    labelAt: { x: 128, y: 138, anchor: 'end' },
    drawDelay: '1.65s',
    leafDelay: '2.2s',
    state: '读过',
    source: '曲则全,枉则直。',
  },
  {
    id: 'ch64',
    label: '六十四',
    chapter: '第六十四章',
    d: 'M 221 116 Q 256 108 288 105',
    w: 1.1,
    leaf: '',
    labelAt: { x: 298, y: 109, anchor: 'start' },
    drawDelay: '1.9s',
    leafDelay: '2.4s',
    state: '读过',
    source: '千里之行,始于足下。',
  },
]

const LEAF_COLOR: Record<Exclude<LeafKind, ''>, string> = {
  cinnabar: 'var(--cinnabar)',
  verdigris: 'var(--verdigris)',
}

/** A hovered branch's detail, or the resting hint. */
function BranchDetail({ branch }: { branch: Branch | null }) {
  if (!branch) {
    return <div className="detail detail-rest">悬停一枝,看你在那一章写下的。</div>
  }
  const annotated = branch.state !== '读过'
  return (
    <div className="detail" key={branch.id}>
      <div className="detail-head">
        <span className={`state state-${branch.state}`}>
          {branch.state !== '读过' && <span className="state-dot" />}
          {branch.state === '读过' ? '读过 · 尚未落笔' : branch.state}
        </span>
        <span className="detail-chapter">道德经 · {branch.chapter}</span>
        {branch.genre && <span className="genre">{branch.genre}</span>}
      </div>
      {branch.source && <div className="detail-source">{branch.source}</div>}
      {annotated && branch.note && <div className="detail-note">{branch.note}</div>}
      {annotated && branch.sign && <div className="detail-sign">{branch.sign}</div>}
    </div>
  )
}

export default function MyTree() {
  // Night ("夜读") is a whole-page atmosphere; the prototype toggled a body attribute.
  const [night, setNight] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  const activeBranch = BRANCHES.find((b) => b.id === active) ?? null

  return (
    <div className="page">
      <header className="header">
        <a className="brand" href="/">
          {/* three concentric rings — a tree's growth rings, the product's mark */}
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
            <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
          </svg>
          <span className="brand-name">老树</span>
        </a>
        <nav className="nav">
          <a className="link-muted" href="/books/jingangjing">
            金刚经
          </a>
          <a className="link-muted" href="/read">
            回到阅读
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
        </nav>
      </header>

      <main className="stage" data-screen-label="我的树">
        <div className="eyebrow">我的树</div>
        <div className="tree-name">沈一苇</div>
        <div className="tree-planted">种于 2023 年冬</div>

        <div className="tree-stage" onMouseLeave={() => setActive(null)}>
          <svg viewBox="0 0 440 360" className="tree-svg" role="img" aria-label="沈一苇的树:五枝,一枚入木、一枚青芽。">
            {/* 年轮 — growth rings at the root, echoing the mark and the metaphor */}
            <g className="rings">
              <ellipse cx="220" cy="320" rx="70" ry="13" className="ring" style={{ animationDelay: '0.3s' }} />
              <ellipse cx="220" cy="320" rx="48" ry="9" className="ring" style={{ animationDelay: '0.45s' }} />
              <ellipse cx="220" cy="320" rx="28" ry="5.5" className="ring" style={{ animationDelay: '0.6s' }} />
            </g>
            <line x1="150" y1="320" x2="290" y2="320" className="ground" />

            <g className="sway">
              {/* trunk, drawn upward from the ground on load */}
              <path
                d="M 220 320 C 214 252, 226 178, 222 96"
                className="trunk draw"
                pathLength={1}
                style={{ animationDelay: '0.15s' }}
              />

              {BRANCHES.map((b) => {
                const isActive = active === b.id
                return (
                  <g
                    key={b.id}
                    className={`branch-group${isActive ? ' is-active' : ''}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`道德经 ${b.chapter},${b.state === '读过' ? '读过,尚未落笔' : b.state}`}
                    onMouseEnter={() => setActive(b.id)}
                    onFocus={() => setActive(b.id)}
                    onBlur={() => setActive(null)}
                  >
                    {/* generous invisible hit area so a thin branch is easy to reach */}
                    <path d={b.d} className="hit" strokeWidth={20} />
                    <path
                      d={b.d}
                      className="branch draw"
                      pathLength={1}
                      strokeWidth={b.w}
                      style={{ animationDelay: b.drawDelay }}
                    />
                    {b.thread && (
                      <path
                        d={b.thread.d}
                        className="thread draw"
                        pathLength={1}
                        style={{ animationDelay: '2.5s' }}
                      />
                    )}
                    {b.thread && (
                      <text
                        x={b.thread.at.x}
                        y={b.thread.at.y}
                        className="thread-label fade"
                        style={{ animationDelay: '2.9s' }}
                      >
                        {b.thread.label}
                      </text>
                    )}
                    {b.leaf && b.leafAt && (
                      <circle
                        cx={b.leafAt.x}
                        cy={b.leafAt.y}
                        r={4.6}
                        className="leaf fade"
                        fill={LEAF_COLOR[b.leaf]}
                        style={{ animationDelay: b.leafDelay }}
                      />
                    )}
                    <text
                      x={b.labelAt.x}
                      y={b.labelAt.y}
                      textAnchor={b.labelAt.anchor}
                      className="branch-label fade"
                      style={{ animationDelay: b.leafDelay }}
                    >
                      {b.label}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        <BranchDetail branch={activeBranch} />

        <div className="legend">
          枝,是读过的章。叶,是留下的年轮。
          <br />
          朱砂叶已入木,与古人同列。细线,是有人接续了你。
        </div>

        <section className="echo">
          <div className="echo-label">周年回声</div>
          <div className="echo-lead">一年前的你,在「知足不辱,知止不殆」之下写过一枚青芽。</div>
          <div className="echo-quote">辞掉第二份工作的那晚我写:知道停在哪里,比知道去哪里难。</div>
          <div className="echo-ask">现在的你,还这么读吗?</div>
          <div className="echo-actions">
            <a className="link-cinnabar" href="/read">
              回去看看 →
            </a>
            <a className="link-muted" href="/inscribe">
              接续一年前的自己 →
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
