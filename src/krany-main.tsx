import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { KranyPage } from './pages/krany/KranyPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KranyPage />
  </StrictMode>,
)
