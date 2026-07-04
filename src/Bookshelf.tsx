import { useCallback, useState } from 'react'
import Header from './Header'
import { Link } from './router'
import './Bookshelf.css'

type ShelfBook = {
  id: string
  title: string
  shelf: string
  line: string
  meta: string
  href: string
  live: boolean
}

const BOOKS: ShelfBook[] = [
  {
    id: 'ddj',
    title: '道德經',
    shelf: '書架 · 道家',
    line: '五千字,两千年读不尽。',
    meta: '已生长约 2,400 年 · 137 层年轮',
    href: '/read',
    live: false,
  },
  {
    id: 'genji',
    title: '源氏物語',
    shelf: '書架 · 日本古典',
    line: '五十四帖,写尽人心与无常。',
    meta: '已生长约 1,020 年 · 92 层年轮',
    href: '/books/genji',
    live: true,
  },
]

export default function Bookshelf() {
  const [night, setNight] = useState(false)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  return (
    <div className="shelf-page">
      <Header night={night} onToggleNight={toggleNight} />

      <main className="shelf-stage" data-screen-label="千年书架">
        <div className="shelf-lead">
          <div className="shelf-title">一座还在生长的碑林。</div>
          <div className="shelf-sub">
            AI 长出土壤,人在其上署名落笔,时间让字入木。
            <br />
            免登录,全站可读。
          </div>
        </div>

        <div className="shelf-row">
          {BOOKS.map((b) => (
            <Link key={b.id} to={b.href} className="shelf-card">
              <div className="shelf-card-tag">{b.shelf}</div>
              <div className="shelf-card-title">{b.title}</div>
              <div className="shelf-card-line">{b.line}</div>
              <div className="shelf-card-meta">{b.meta}</div>
              <div className={`shelf-card-cta${b.live ? '' : ' is-dim'}`}>
                {b.live ? '走进这本书 →' : '正在生长 →'}
              </div>
            </Link>
          ))}
        </div>

        <div className="shelf-foot">越老的书,年轮越厚。</div>
      </main>
    </div>
  )
}
