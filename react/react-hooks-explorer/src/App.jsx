import { useState } from 'react'
import UseEffectDemo from './components/UseEffectDemo'
import UseLayoutEffectDemo from './components/UseLayoutEffectDemo'
import UseInsertionEffectDemo from './components/UseInsertionEffectDemo'
import './App.css'

const TABS = [
  { id: 'useEffect',         label: 'UseEffectDemo.jsx' },
  { id: 'useLayoutEffect',   label: 'UseLayoutEffectDemo.jsx' },
  { id: 'useInsertionEffect',label: 'UseInsertionEffectDemo.jsx' },
]

export default function App() {
  const [active, setActive] = useState('useEffect')

  return (
    <div className="app">
      <div className="app-header">
        <h1>react-hooks-explorer /</h1>
        <p className="subtitle">
          Open DevTools → Console to see StrictMode double-invoke behavior
        </p>
      </div>

      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab ${active === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {active === 'useEffect'          && <UseEffectDemo />}
        {active === 'useLayoutEffect'    && <UseLayoutEffectDemo />}
        {active === 'useInsertionEffect' && <UseInsertionEffectDemo />}
      </div>
    </div>
  )
}
