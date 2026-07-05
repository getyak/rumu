import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import MyTree from './MyTree'
import BookPage from './BookPage'
import { diamondSutra } from './books/diamondSutra'
import type { BookData } from './books/types'

// No router dependency yet — one page per book, keyed by slug, reached at
// /books/:slug. Vite's dev/preview servers fall back to index.html for
// unknown paths, so a full page load or refresh on a book route still works.
const BOOKS: Record<string, BookData> = {
  [diamondSutra.slug]: diamondSutra,
}

function App() {
  const match = window.location.pathname.match(/^\/books\/([^/]+)/)
  const book = match ? BOOKS[match[1]] : undefined
  return book ? <BookPage book={book} /> : <MyTree />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
