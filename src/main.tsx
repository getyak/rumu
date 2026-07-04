import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import { RouterProvider, useRoute } from './router'
import MyTree from './MyTree'
import Bookshelf from './Bookshelf'
import BookGenji from './BookGenji'
import GenjiReader from './GenjiReader'

function App() {
  const { path } = useRoute()
  switch (path) {
    case '/books':
      return <Bookshelf />
    case '/books/genji':
      return <BookGenji />
    case '/books/genji/read':
      return <GenjiReader />
    default:
      return <MyTree />
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
