import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './theme.css'
import Bookshelf from './Bookshelf'
import MyTree from './MyTree'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bookshelf />} />
        <Route path="/tree/:bookId" element={<MyTree />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
