import { useCallback, useState } from 'react'
import './MyTree.css'
import { BOOKS, BOOK_ORDER, LEAF_COLOR, type Branch } from './books'

/**
 * 我的树 renders one book's tree at a time.
 * 枝 = a chapter read; 叶 (leaf) = an annotation left;
 * 朱砂 leaf = 入木 (enshrined, alongside the ancients);
 * 青绿 leaf = 青芽 (a sprout, awaiting time & peers);
 * thread = someone continued your line across the years.
 *
 * Hovering / focusing a branch quietly surfaces what you wrote there — the
 * page's one concession to 探索欲, kept as an inline caption, never a bubble.
 * A reader may grow more than one tree — the switcher below the eyebrow
 * moves between books without leaving the page.
 */

const READER_NAME = '沈一苇'

/** A hovered branch's detail, or the resting hint. */
function BranchDetail({ branch, bookTitle }: { branch: Branch | null; bookTitle: string }) {
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
        <span className="detail-chapter">
          {bookTitle} · {branch.chapter}
        </span>
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
  const [bookId, setBookId] = useState(BOOK_ORDER[0])
  const [active, setActive] = useState<string | null>(null)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  const book = BOOKS[bookId]
  const activeBranch = book.branches.find((b) => b.id === active) ?? null
  const echoBranch = book.branches.find((b) => b.id === book.echo.branchId) ?? null

  const selectBook = useCallback((id: string) => {
    setBookId(id)
    setActive(null)
  }, [])

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
        <div className="tree-name">{READER_NAME}</div>

        <div className="book-switch" role="tablist" aria-label="选一棵树">
          {BOOK_ORDER.map((id) => {
            const b = BOOKS[id]
            const isCurrent = id === bookId
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                className={`book-tab${isCurrent ? ' is-current' : ''}`}
                onClick={() => selectBook(id)}
              >
                <span className="book-tab-title">{b.title}</span>
                <span className="book-tab-subtitle">{b.subtitle}</span>
              </button>
            )
          })}
        </div>

        <div className="tree-planted">{book.planted}</div>

        <div className="tree-stage" onMouseLeave={() => setActive(null)}>
          <svg
            viewBox="0 0 440 360"
            className="tree-svg"
            role="img"
            aria-label={`${READER_NAME}在《${book.title}》里的树:五枝,一枚入木、一枚青芽。`}
          >
            {/* 年轮 — growth rings at the root, echoing the mark and the metaphor */}
            <g className="rings">
              <ellipse cx="220" cy="320" rx="70" ry="13" className="ring" style={{ animationDelay: '0.3s' }} />
              <ellipse cx="220" cy="320" rx="48" ry="9" className="ring" style={{ animationDelay: '0.45s' }} />
              <ellipse cx="220" cy="320" rx="28" ry="5.5" className="ring" style={{ animationDelay: '0.6s' }} />
            </g>
            <line x1="150" y1="320" x2="290" y2="320" className="ground" />

            <g className="sway" key={book.id}>
              {/* trunk, drawn upward from the ground on load */}
              <path
                d="M 220 320 C 214 252, 226 178, 222 96"
                className="trunk draw"
                pathLength={1}
                style={{ animationDelay: '0.15s' }}
              />

              {book.branches.map((b) => {
                const isActive = active === b.id
                return (
                  <g
                    key={b.id}
                    className={`branch-group${isActive ? ' is-active' : ''}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${book.title} ${b.chapter},${b.state === '读过' ? '读过,尚未落笔' : b.state}`}
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

        <BranchDetail branch={activeBranch} bookTitle={book.title} />

        <div className="legend">
          枝,是读过的章。叶,是留下的年轮。
          <br />
          朱砂叶已入木,与古人同列。细线,是有人接续了你。
        </div>

        {echoBranch && (
          <section className="echo" key={book.id}>
            <div className="echo-label">周年回声</div>
            <div className="echo-lead">{book.echo.lead}</div>
            <div className="echo-quote">{book.echo.quote}</div>
            <div className="echo-ask">{book.echo.ask}</div>
            <div className="echo-actions">
              <a className="link-cinnabar" href="/read">
                回去看看 →
              </a>
              <a className="link-muted" href="/inscribe">
                接续一年前的自己 →
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
