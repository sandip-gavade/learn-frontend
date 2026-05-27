import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// NOTE: StrictMode intentionally runs effects TWICE in development
// to help you catch bugs (missing cleanups, non-idempotent effects).
// This is expected behavior. Effects run once in production builds.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
