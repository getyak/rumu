import { createContext, useContext, useEffect, useState } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * A minimal path-based router — no external dependency, since the app is
 * still small enough that a full router would be more machinery than the
 * product needs. Listens to popstate and intercepts plain left-clicks on
 * <Link> so navigation feels like an SPA.
 */
type RouteState = { path: string }

function readRoute(): RouteState {
  return { path: window.location.pathname }
}

const RouteContext = createContext<RouteState>(readRoute())

export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RouteState>(readRoute)

  useEffect(() => {
    const onPopState = () => setState(readRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return <RouteContext.Provider value={state}>{children}</RouteContext.Provider>
}

export function useRoute() {
  return useContext(RouteContext)
}

export function navigate(to: string) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type LinkProps = { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
