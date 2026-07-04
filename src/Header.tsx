import { Link } from './router'
import './Header.css'

/** Shared chrome for the bookshelf / book-detail / reader pages. */
export default function Header({
  home = '/books',
  night,
  onToggleNight,
}: {
  home?: string
  night: boolean
  onToggleNight: () => void
}) {
  return (
    <div className="site-header">
      <Link to={home} className="site-brand">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
          <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
        </svg>
        <span className="site-brand-name">老树</span>
        <span className="site-brand-tagline">千年经典的活体年轮库</span>
      </Link>
      <div className="site-nav">
        <span
          className="link-muted"
          onClick={onToggleNight}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggleNight()
            }
          }}
        >
          {night ? '昼读' : '夜读'}
        </span>
      </div>
    </div>
  )
}
