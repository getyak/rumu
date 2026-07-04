import { Link } from 'react-router-dom'
import './Header.css'

type HeaderLink = { label: string; to: string }

type HeaderProps = {
  night: boolean
  onToggleNight: () => void
  links?: HeaderLink[]
}

/** The brand mark + nav bar shared by every page past 我的树. */
export default function Header({ night, onToggleNight, links = [] }: HeaderProps) {
  return (
    <div className="site-header">
      <Link className="site-brand" to="/">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <circle cx="11" cy="11" r="9" fill="none" stroke="var(--cinnabar)" strokeWidth="1" />
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="var(--cinnabar)" strokeWidth="0.8" opacity="0.65" />
          <circle cx="11" cy="11" r="2" fill="none" stroke="var(--cinnabar)" strokeWidth="0.7" opacity="0.4" />
        </svg>
        <span className="site-brand-name">老树</span>
        <span className="site-brand-tag">千年经典的活体年轮库</span>
      </Link>
      <nav className="site-nav">
        {links.map((l) => (
          <Link key={l.to} className="link-muted" to={l.to}>
            {l.label}
          </Link>
        ))}
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
      </nav>
    </div>
  )
}
