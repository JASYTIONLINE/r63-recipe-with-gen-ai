/**
 * main.jsx
 *
 * Application entry point: mounts the root React tree inside `#root` and wraps the app in
 * `BrowserRouter` so any component may use routing hooks. `StrictMode` enables additional
 * development checks in React 19; it does not affect production bundles materially.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
