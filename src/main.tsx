import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './theme.css'
import MyTree from './MyTree'
import Bookshelf from './pages/Bookshelf'
import BookDetail from './pages/BookDetail'
import Reading from './pages/Reading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bookshelf />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/book/:id/read" element={<Reading />} />
        <Route path="/my-tree" element={<MyTree />} />
        <Route path="*" element={<Bookshelf />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
