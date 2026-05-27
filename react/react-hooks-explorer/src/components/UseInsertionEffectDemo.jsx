// src/components/UseInsertionEffectDemo.jsx
// ─────────────────────────────────────────────────────────────────────────────
//
//  WHAT IS useInsertionEffect?
//  ───────────────────────────
//  Added in React 18. The earliest-firing effect hook.
//  Runs BEFORE React makes any DOM mutations.
//
//  FULL TIMING ORDER (within a single render cycle):
//    1. React renders (virtual DOM diff computed)
//    2. useInsertionEffect ← runs here (DOM has NOT been touched yet)
//    3. React commits DOM mutations (actual DOM updated)
//    4. useLayoutEffect ← runs here (DOM updated, not yet painted)
//    5. Browser paints
//    6. useEffect ← runs here (fully async, after paint)
//
//  WHO IS IT FOR?
//    CSS-in-JS library authors. Specifically: emotion, styled-components,
//    vanilla-extract, and similar libraries.
//    You should almost NEVER call this in application code.
//
//  THE PROBLEM IT SOLVES:
//    CSS-in-JS libraries inject <style> tags at runtime (they generate
//    class names from JS objects and write the CSS dynamically).
//
//    The problem: if a library injects styles in useLayoutEffect, the
//    browser doesn't know about those styles when useLayoutEffect runs
//    and calls getBoundingClientRect(). The browser computes layout
//    WITHOUT the styles, giving wrong measurements — then the styles
//    arrive, causing re-layout and flickering.
//
//    useInsertionEffect fires BEFORE the DOM is touched, so:
//      → styles are injected into <head>
//      → React commits the DOM with the new class names
//      → useLayoutEffect reads layout — styles already present ✓
//      → correct measurements, no flicker
//
//  CONSTRAINTS (more restricted than other hooks):
//    ❌ Cannot read refs (DOM doesn't exist yet in this phase)
//    ❌ Cannot update state (would cause infinite loops / incorrect behavior)
//    ❌ Cannot schedule other effects
//    ✅ Can write to document.head (inject <style> tags)
//    ✅ Can write to a style cache/registry
//
//  TYPICAL PATTERN (what a CSS-in-JS lib does internally):
//    1. User writes:  const Box = styled.div`color: red`
//    2. At render, library hashes CSS → className = "css-1abc2"
//    3. useInsertionEffect injects:  .css-1abc2 { color: red }
//    4. Component renders with className="css-1abc2"
//    5. Style is already present when browser lays out the DOM
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useLayoutEffect, useInsertionEffect, useRef } from 'react'
import LogWindow from './LogWindow'
import { useLog } from '../hooks/useLog'
import './Demo.css'

// ── Simulated CSS-in-JS engine ────────────────────────────────────────────────
//
// This mimics the internal workings of emotion or styled-components.
// In a real library this is much more complex (caching, specificity, SSR),
// but the useInsertionEffect usage pattern is exactly the same.

// Cache: tracks which class names have already been injected.
// In a real library this would be a more sophisticated data structure.
const injectedStyles = new Map() // className → css string

function injectStyleTag(className, cssText) {
  if (injectedStyles.has(className)) {
    return false // already in DOM, skip
  }

  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-css-in-js', className) // easy to inspect in DevTools
  styleEl.textContent = `.${className} { ${cssText} }`
  document.head.appendChild(styleEl)

  injectedStyles.set(className, cssText)
  return true // was newly injected
}

// ── useCSS — the hook a CSS-in-JS library would export ───────────────────────
//
// Usage:  const className = useCSS('padding: 8px; color: red;')
// Returns a stable className that has a <style> tag backing it.
function useCSS(cssText, addLog) {
  // Generate a deterministic class name from the CSS string.
  // Real libraries use a proper hash (MurmurHash, etc.).
  // We use a simple sum of char codes as a demo hash.
  const hash = cssText
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const className = `css-${hash}`

  useInsertionEffect(() => {
    // ← fires BEFORE React touches the DOM
    const wasNew = injectStyleTag(className, cssText)
    if (wasNew) {
      addLog(`[useInsertionEffect] injected <style> for .${className}`, 'useInsertion')
    } else {
      addLog(`[useInsertionEffect] .${className} already cached — no DOM write`, 'useInsertion')
    }
    // Note: no cleanup needed here.
    // <style> tags are intentionally persistent (like a CSS file).
  }, [className, cssText])

  return className
}

// ── Demo component: dynamically styled box ────────────────────────────────────
function StyledBox({ color, size, addLog }) {
  // Generate CSS dynamically from props — exactly what styled-components does
  const colorMap = {
    teal:   'background: #1D9E75; color: #fff;',
    amber:  'background: #EF9F27; color: #412402;',
    purple: 'background: #7F77DD; color: #fff;',
    red:    'background: #E24B4A; color: #fff;',
  }
  const sizeMap = {
    small:  'padding: 6px 12px; font-size: 11px;',
    medium: 'padding: 12px 20px; font-size: 13px;',
    large:  'padding: 18px 32px; font-size: 16px;',
  }

  // Each unique combination gets its own class + style tag.
  // useInsertionEffect guarantees the style is in the DOM before layout.
  const colorClass = useCSS(colorMap[color], addLog)
  const sizeClass  = useCSS(sizeMap[size], addLog)

  return (
    // Two classes — same pattern as real CSS-in-JS output
    <div className={`${colorClass} ${sizeClass}`} style={{ borderRadius: 4, display: 'inline-block' }}>
      .{colorClass} .{sizeClass}
    </div>
  )
}

// ── Timing comparison: all three hooks on the same render cycle ───────────────
function TimingOrderDemo({ addLog }) {
  const [tick, setTick] = useState(0)

  // 1. Fires first — before DOM mutations
  useInsertionEffect(() => {
    addLog(`[1] useInsertionEffect  tick=${tick}  (before DOM mutations)`, 'useInsertion')
  }, [tick])

  // 2. Fires second — after DOM mutations, before paint
  useLayoutEffect(() => {
    addLog(`[2] useLayoutEffect     tick=${tick}  (after DOM, before paint)`, 'useLayoutEffect')
  }, [tick])

  // 3. Fires last — after paint
  useEffect(() => {
    addLog(`[3] useEffect           tick=${tick}  (after paint)`, 'useEffect')
  }, [tick])

  return (
    <button onClick={() => setTick(t => t + 1)}>
      trigger all three hooks (tick = {tick})
    </button>
  )
}

// ── Main exported component ───────────────────────────────────────────────────
export default function UseInsertionEffectDemo() {
  const { entries, addLog, clearLog } = useLog()

  const [color, setColor] = useState('teal')
  const [size, setSize]   = useState('medium')

  return (
    <div className="demo">
      <div className="demo-section">
        <h2>useInsertionEffect</h2>
        <p className="hook-timing">
          Fires: <strong>before any DOM mutations</strong> — earliest possible
        </p>
        <p className="hook-desc">
          For CSS-in-JS library authors only. Guarantees injected{' '}
          <code>&lt;style&gt;</code> tags exist before the browser computes layout.
          Do not use this in application code.
        </p>
      </div>

      <div className="demo-section">
        <p className="section-label">
          Demo A — simulated CSS-in-JS: change color/size, watch style injection
        </p>
        <p className="hint">
          Open DevTools → Elements → &lt;head&gt; and look for{' '}
          <code>style[data-css-in-js]</code> tags appearing.
        </p>

        <div className="controls" style={{ marginBottom: 12 }}>
          {['teal', 'amber', 'purple', 'red'].map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ opacity: color === c ? 1 : 0.5 }}>
              {c}
            </button>
          ))}
          <span style={{ color: '#555' }}>|</span>
          {['small', 'medium', 'large'].map(s => (
            <button key={s} onClick={() => setSize(s)} style={{ opacity: size === s ? 1 : 0.5 }}>
              {s}
            </button>
          ))}
        </div>

        <StyledBox color={color} size={size} addLog={addLog} />
      </div>

      <div className="demo-section">
        <p className="section-label">
          Demo B — execution order: Insertion → Layout → Effect
        </p>
        <TimingOrderDemo addLog={addLog} />
        <p className="hint">
          Each click shows the precise firing order across all three hooks.
        </p>
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
