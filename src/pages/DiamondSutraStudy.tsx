import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { useNightMode } from '../hooks/useNightMode'
import { getBook } from '../books/registry'
import type { StrataLayer } from '../books/types'
import './DiamondSutraStudy.css'

/** Book-specific reading, with existing sources and a temporary reader draft. */
export default function DiamondSutraStudy() {
  const book = getBook('diamondSutra')
  const { night, toggleNight } = useNightMode()
  const [openVerse, setOpenVerse] = useState<number | null>(0)
  const [draft, setDraft] = useState('')

  if (!book) return <Navigate to="/" replace />

  const verses = book.chapter.sentences
  const selectedVerse = openVerse === null ? undefined : verses[openVerse]

  return (
    <div className="ds-page">
      <Header
        night={night}
        onToggleNight={toggleNight}
        links={[
          { label: '书籍详情', to: '/book/' + book.id },
          { label: '共读原文', to: '/book/' + book.id + '/read' },
          { label: '我的树', to: '/my-tree' },
        ]}
      />

      <div className="ds-shell">
        <header className="ds-hero">
          <div>
            <h1 className="ds-hero-title">{book.title}</h1>
            <div className="ds-hero-sub">{book.chapter.label}</div>
          </div>
          <div className="ds-hero-meta">原文 · 年轮 · 本页草稿</div>
        </header>

        <main className="ds-scripture" aria-labelledby="ds-chapter-title">
          <h2 id="ds-chapter-title" className="ds-chapter-label">经文与年轮</h2>
          <p className="ds-chapter-caption">选一句原文，查看它已有的注疏与年轮。</p>

          <div className="ds-verses" id="ds-verses">
            {verses.map((verse, i) => {
              const isOpen = openVerse === i
              const toggleId = 'ds-verse-toggle-' + i
              const panelId = 'ds-verse-panel-' + i
              return (
                <section key={i} className={isOpen ? 'ds-verse is-open' : 'ds-verse'}>
                  <h3 className="ds-verse-heading">
                    <button
                      id={toggleId}
                      className="ds-verse-toggle"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenVerse((current) => current === i ? null : i)}
                    >
                      <span className="ds-verse-text">{verse.text}</span>
                      <span className="ds-verse-hint">
                        {verse.strata.length > 0 ? '查看年轮' : '此句年轮待生长'}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    className="ds-verse-body"
                    role="region"
                    aria-labelledby={toggleId}
                    hidden={!isOpen}
                  >
                    {verse.compare && (
                      <div className="ds-compare">
                        <div className="ds-compare-label">版本对照</div>
                        <p>{verse.compare.footnote}</p>
                      </div>
                    )}

                    {verse.strata.length === 0 && (
                      <p className="ds-verse-empty">此句尚无年轮，可以继续读原文。</p>
                    )}

                    <div className="ds-strata">
                      {verse.strata.map((layer: StrataLayer, si: number) => {
                        const className = [
                          'ds-stratum',
                          layer.ai ? 'is-ai' : '',
                          layer.sprout ? 'is-sprout' : '',
                          layer.tag === '入木' ? 'is-inmu' : '',
                        ].filter(Boolean).join(' ')
                        return (
                          <div
                            key={si}
                            id={'ds-stratum-' + i + '-' + si}
                            className={className}
                            tabIndex={-1}
                          >
                            {layer.follow && <div className="ds-stratum-follow">{layer.follow}</div>}
                            <div className="ds-stratum-head">
                              <span className="ds-stratum-src">{layer.src}</span>
                              <span className="ds-stratum-year">{layer.yl}</span>
                              {layer.badge && <span className="ds-stratum-badge">{layer.badge}</span>}
                              {layer.tag && <span className="ds-stratum-badge">{layer.tag}</span>}
                            </div>
                            <div className="ds-stratum-body">{layer.body}</div>
                            {(layer.sig || layer.date) && (
                              <div className="ds-stratum-sig">
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

          <section className="ds-guide" aria-labelledby="ds-guide-title">
            <h2 id="ds-guide-title">守树人只引路，不作答</h2>
            <p className="ds-guide-label">读者自问 · 固定提示</p>
            <p className="ds-guide-question">「你说『很有感触』，是哪件事让你有感触？」</p>
            <p>这是固定的自问提示，不会分析或改写你的草稿。</p>
            {selectedVerse ? (
              selectedVerse.strata.length > 0 ? (
                <nav className="ds-source-links" aria-label="当前句的已有年轮">
                  {selectedVerse.strata.map((layer, si) => (
                    <a key={si} href={'#ds-stratum-' + openVerse + '-' + si}>
                      <span>{layer.src}</span>
                      {layer.yl && <span>{layer.yl}</span>}
                    </a>
                  ))}
                </nav>
              ) : <p>这句尚无年轮，可以继续读原文。</p>
            ) : <p>先选一句原文，再查看它已有的年轮。</p>}
          </section>

          <section className="ds-draft">
            <label htmlFor="ds-reader-draft">本页临时读者草稿</label>
            <p id="ds-draft-boundary">
              仅在当前页面临时保留，刷新后清空；不会保存到「我的树」或发表为年轮。
            </p>
            <textarea
              id="ds-reader-draft"
              aria-describedby="ds-draft-boundary"
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
