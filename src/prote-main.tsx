import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ProtePage } from './pages/prote/ProtePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtePage />
  </StrictMode>,
)
