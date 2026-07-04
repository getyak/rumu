import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import MyTree from './MyTree'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyTree />
  </StrictMode>,
)
