import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import type { StrataLayer } from '../books/types'
import './DaodejingStudy.css'

/** Book-specific reading, with existing sources and a temporary reader draft. */
export default function DaodejingStudy() {
  const book = getBook('daodejing')
  const { night, toggleNight } = useNightMode()
  const [openVerse, setOpenVerse] = useState<number | null>(0)
  const [draft, setDraft] = useState('')

  if (!book) return <Navigate to="/" replace />

  const verses = book.chapter.sentences
  const selectedVerse = openVerse === null ? undefined : verses[openVerse]

  return (
    <div className="dd-page">
      <Header
        night={night}
        onToggleNight={toggleNight}
        links={[
          { label: '书籍详情', to: '/book/' + book.id },
          { label: '共读原文', to: '/book/' + book.id + '/read' },
          { label: '我的树', to: '/my-tree' },
        ]}
      />

      <div className="dd-shell">
        <header className="dd-hero">
          <div>
            <h1 className="dd-hero-title">{book.title}</h1>
            <div className="dd-hero-sub">{book.chapter.label}</div>
          </div>
          <div className="dd-hero-meta">原文 · 年轮 · 本页草稿</div>
        </header>

        <main className="dd-scripture" aria-labelledby="dd-chapter-title">
          <h2 id="dd-chapter-title" className="dd-chapter-label">经文与年轮</h2>
          <p className="dd-chapter-caption">选一句原文，查看它已有的注疏与年轮。</p>

          <div className="dd-verses" id="dd-verses">
            {verses.map((verse, i) => {
              const isOpen = openVerse === i
              const toggleId = 'dd-verse-toggle-' + i
              const panelId = 'dd-verse-panel-' + i
              return (
                <section key={i} className={isOpen ? 'dd-verse is-open' : 'dd-verse'}>
                  <h3 className="dd-verse-heading">
                    <button
                      id={toggleId}
                      className="dd-verse-toggle"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenVerse((current) => current === i ? null : i)}
                    >
                      <span className="dd-verse-text">{verse.text}</span>
                      <span className="dd-verse-hint">
                        {verse.strata.length > 0 ? '查看年轮' : '此句年轮待生长'}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    className="dd-verse-body"
                    role="region"
                    aria-labelledby={toggleId}
                    hidden={!isOpen}
                  >
                    {verse.compare && (
                      <div className="dd-compare">
                        <div className="dd-compare-label">版本对照</div>
                        <p>{verse.compare.footnote}</p>
                      </div>
                    )}

                    {verse.strata.length === 0 && (
                      <p className="dd-verse-empty">此句尚无年轮，可以继续读原文。</p>
                    )}

                    <div className="dd-strata">
                      {verse.strata.map((layer: StrataLayer, si: number) => {
                        const className = [
                          'dd-stratum',
                          layer.ai ? 'is-ai' : '',
                          layer.sprout ? 'is-sprout' : '',
                          layer.tag === '入木' ? 'is-inmu' : '',
                        ].filter(Boolean).join(' ')
                        return (
                          <div
                            key={si}
                            id={'dd-stratum-' + i + '-' + si}
                            className={className}
                            tabIndex={-1}
                          >
                            {layer.follow && <div className="dd-stratum-follow">{layer.follow}</div>}
                            <div className="dd-stratum-head">
                              <span className="dd-stratum-src">{layer.src}</span>
                              <span className="dd-stratum-year">{layer.yl}</span>
                              {layer.badge && <span className="dd-stratum-badge">{layer.badge}</span>}
                              {layer.tag && <span className="dd-stratum-badge">{layer.tag}</span>}
                            </div>
                            <div className="dd-stratum-body">{layer.body}</div>
                            {(layer.sig || layer.date) && (
                              <div className="dd-stratum-sig">
                                {layer.sig ?? ''}
                                {layer.date ? ' · ' + layer.date : ''}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          <section className="dd-guide" aria-labelledby="dd-guide-title">
            <h2 id="dd-guide-title">守树人只引路，不作答</h2>
            <p className="dd-guide-label">读者自问 · 固定提示</p>
            <p className="dd-guide-question">「你说『很有感触』，是哪件事让你有感触？」</p>
            <p>这是固定的自问提示，不会分析或改写你的草稿。</p>
            {selectedVerse ? (
              selectedVerse.strata.length > 0 ? (
                <nav className="dd-source-links" aria-label="当前句的已有年轮">
                  {selectedVerse.strata.map((layer, si) => (
                    <a key={si} href={'#dd-stratum-' + openVerse + '-' + si}>
                      <span>{layer.src}</span>
                      {layer.yl && <span>{layer.yl}</span>}
                    </a>
                  ))}
                </nav>
              ) : <p>这句尚无年轮，可以继续读原文。</p>
            ) : <p>先选一句原文，再查看它已有的年轮。</p>}
          </section>

          <section className="dd-draft">
            <label htmlFor="dd-reader-draft">本页临时读者草稿</label>
            <p id="dd-draft-boundary">
              仅在当前页面临时保留，刷新后清空；不会保存到「我的树」或发表为年轮。
            </p>
            <textarea
              id="dd-reader-draft"
              aria-describedby="dd-draft-boundary"
              rows={5}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="写下你自己的疑问或读法…"
            />
          </section>
        </main>
      </div>
    </div>
  )
}
