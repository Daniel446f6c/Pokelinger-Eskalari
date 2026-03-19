import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './context/GameContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </ToastProvider>
  </StrictMode>
)
