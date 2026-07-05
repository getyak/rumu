import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import MyTree from './MyTree'
import Genji from './Genji'

// No router dependency yet — the product has exactly two real pages so far.
// Whichever page ships next (首页书架, 阅读页, ...) is the right time to
// bring in an actual router; until then a path switch keeps this honest.
function Router() {
  const path = window.location.pathname
  if (path === '/genji' || path === '/books/genji') return <Genji />
  return <MyTree />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
