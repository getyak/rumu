import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './theme.css'
import MyTree from './MyTree'
import BookBio from './BookBio'
import heartSutra from './books/heartSutra'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyTree />} />
        <Route path="/book/heart-sutra" element={<BookBio book={heartSutra} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
