// src/components/UseLayoutEffectDemo.jsx
// ─────────────────────────────────────────────────────────────────────────────
//
//  WHAT IS useLayoutEffect?
//  ────────────────────────
//  Like useEffect, but fires SYNCHRONOUSLY after React mutates the DOM
//  and BEFORE the browser gets a chance to paint.
//
//  TIMING:
//    1. State/props change
//    2. React re-renders (virtual DOM diff)
//    3. React writes changes to the actual DOM
//    4. useLayoutEffect callback runs ← your code here (DOM is ready, not painted)
//    5. Browser paints                ← user sees the new UI
//    6. useEffect callback runs
//
//  THE PROBLEM IT SOLVES:
//    Sometimes you need to READ the DOM (measure sizes, positions) and then
//    make adjustments BEFORE the user sees the result.
//
//    If you do this in useEffect, the sequence is:
//      → browser paints (user sees old/wrong layout)
//      → effect reads DOM
//      → effect updates state
//      → browser re-paints (user sees corrected layout)
//    This creates a visual flicker / "layout thrash".
//
//    With useLayoutEffect:
//      → effect reads DOM (browser hasn't painted yet)
//      → effect updates state
//      → browser paints (user sees correct layout from the start)
//    No flicker.
//
//  REAL-WORLD USE CASES:
//    - Tooltip / popover positioning (read target rect, compute position)
//    - Scroll restoration (set scrollTop before paint)
//    - Animations that need to start from a measured size
//    - Any "measure then adjust" pattern
//
//  WHY NOT ALWAYS USE useLayoutEffect?
//    It BLOCKS painting. Your callback runs synchronously on the main thread.
//    If it's slow, the user sees a frozen/janky UI.
//    Keep it fast — only DOM reads and immediate state updates.
//    Never do async work (fetch, timers) inside useLayoutEffect.
//
//  SSR WARNING:
//    useLayoutEffect does nothing on the server (no DOM).
//    React will show a warning if you use it in an SSR app.
//    For SSR-safe code, use useEffect, or conditionally pick based on
//    typeof window !== 'undefined'.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import LogWindow from './LogWindow'
import { useLog } from '../hooks/useLog'
import './Demo.css'

// ── DEMO A: Tooltip positioning ───────────────────────────────────────────────
// The classic useLayoutEffect use case.
// We need to know the button's position to render the tooltip above it.
// That measurement must happen before paint so the tooltip appears
// in the correct position on the first render.
function TooltipDemo({ addLog }) {
  const [show, setShow]         = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef               = useRef(null)
  const tooltipRef              = useRef(null)

  useLayoutEffect(() => {
    // This block runs AFTER the DOM update (tooltip is in the DOM)
    // but BEFORE the browser paints.
    if (show && buttonRef.current && tooltipRef.current) {
      const btnRect     = buttonRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      // Position tooltip centered above the button
      const top  = btnRect.top - tooltipRect.height - 8
      const left = btnRect.left + (btnRect.width / 2) - (tooltipRect.width / 2)

      setPosition({ top, left })
      addLog(
        `[useLayoutEffect] tooltip positioned → top:${Math.round(top)}px left:${Math.round(left)}px`,
        'useLayoutEffect'
      )
    }
  }, [show]) // re-run whenever show toggles

  return (
    <div style={{ position: 'relative' }}>
      <button ref={buttonRef} onClick={() => setShow(s => !s)}>
        {show ? 'hide tooltip' : 'show tooltip'}
      </button>

      {show && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            background: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 11,
            color: '#dcdcaa',
            pointerEvents: 'none',
            // Without useLayoutEffect, this would briefly flash at top:0 left:0
            // before jumping to the correct position
            whiteSpace: 'nowrap',
          }}
        >
          ↑ positioned before paint
        </div>
      )}
    </div>
  )
}

// ── DEMO B: Visualising the timing gap between the two hooks ──────────────────
// Both hooks depend on the same state change.
// Watching the log order proves useLayoutEffect always fires first.
function TimingDemo({ addLog }) {
  const [tick, setTick] = useState(0)

  useLayoutEffect(() => {
    // Fires BEFORE paint
    addLog(`[useLayoutEffect] tick=${tick} — DOM ready, not painted yet`, 'useLayoutEffect')
  }, [tick])

  useEffect(() => {
    // Fires AFTER paint
    addLog(`[useEffect]       tick=${tick} — browser already painted`, 'useEffect')
  }, [tick])

  return (
    <button onClick={() => setTick(t => t + 1)}>
      trigger both hooks (tick = {tick})
    </button>
  )
}

// ── DEMO C: DOM measurement without flicker ───────────────────────────────────
// Reads the rendered height of a list and displays it.
// Try swapping useLayoutEffect for useEffect here and look for the flicker.
function MeasureDemo({ addLog }) {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
  const [height, setHeight] = useState(null)
  const listRef = useRef(null)

  useLayoutEffect(() => {
    if (listRef.current) {
      const h = listRef.current.getBoundingClientRect().height
      setHeight(Math.round(h))
      addLog(`[useLayoutEffect] list height measured = ${Math.round(h)}px`, 'useLayoutEffect')
    }
  }, [items]) // re-measure whenever items array changes

  return (
    <div>
      <ul
        ref={listRef}
        style={{
          padding: '8px 12px',
          background: '#1a1a1a',
          borderRadius: 4,
          border: '1px solid #2a2a2a',
          marginBottom: 8,
          listStyle: 'none',
        }}
      >
        {items.map(item => (
          <li key={item} style={{ padding: '3px 0', borderBottom: '1px solid #222' }}>
            {item}
          </li>
        ))}
      </ul>

      <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        measured height: <span style={{ color: '#dcdcaa' }}>{height ?? '…'}px</span>
      </p>

      <div className="controls">
        <button onClick={() => setItems(i => [...i, `Item ${i.length + 1}`])}>
          add item
        </button>
        <button onClick={() => setItems(i => i.slice(0, -1))} disabled={items.length <= 1}>
          remove item
        </button>
      </div>
    </div>
  )
}

// ── Main exported component ───────────────────────────────────────────────────
export default function UseLayoutEffectDemo() {
  const { entries, addLog, clearLog } = useLog()

  return (
    <div className="demo">
      <div className="demo-section">
        <h2>useLayoutEffect</h2>
        <p className="hook-timing">
          Fires: <strong>after DOM update, before browser paint</strong> (synchronous)
        </p>
        <p className="hook-desc">
          Use when you need to read the DOM and adjust layout before the user
          sees anything. Identical API to useEffect — just different timing.
          Keep it fast — it blocks painting.
        </p>
      </div>

      <div className="demo-section">
        <p className="section-label">Demo A — tooltip positioning (measure before paint)</p>
        <TooltipDemo addLog={addLog} />
      </div>

      <div className="demo-section">
        <p className="section-label">Demo B — timing order: useLayoutEffect fires before useEffect</p>
        <TimingDemo addLog={addLog} />
        <p className="hint">Click and watch log order — LayoutEffect always appears first.</p>
      </div>

      <div className="demo-section">
        <p className="section-label">Demo C — DOM measurement without flicker</p>
        <MeasureDemo addLog={addLog} />
      </div>

      <div className="demo-section">
        <div className="controls" style={{ marginBottom: 8 }}>
          <button onClick={clearLog}>clear log</button>
        </div>
        <LogWindow entries={entries} />
      </div>
    </div>
  )
}
