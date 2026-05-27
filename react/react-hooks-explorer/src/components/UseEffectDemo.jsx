// src/components/UseEffectDemo.jsx
// ─────────────────────────────────────────────────────────────────────────────
//
//  WHAT IS useEffect?
//  ──────────────────
//  The standard hook for running side effects.
//  It runs AFTER React renders and AFTER the browser paints.
//
//  TIMING:
//    1. State/props change
//    2. React re-renders (virtual DOM diff)
//    3. Browser paints the updated screen  ← user sees the new UI here
//    4. useEffect callback runs            ← your side effect fires here
//
//  THE PROBLEM IT SOLVES:
//    Before hooks, side effects (fetch, subscriptions, timers) lived in
//    class lifecycle methods: componentDidMount, componentDidUpdate,
//    componentWillUnmount. These were verbose and scattered logic.
//    useEffect collocates all of it in one place, per concern.
//
//  DEPENDENCY ARRAY — the trigger mechanism:
//    useEffect(fn)          → runs after EVERY render (rarely what you want)
//    useEffect(fn, [])      → runs ONCE on mount
//    useEffect(fn, [a, b])  → runs when `a` or `b` changes (shallow compare)
//
//  CLEANUP:
//    Return a function from your callback. React will call it:
//      - Before running the effect again (on dep change)
//      - When the component unmounts
//    Use it to: cancel fetch, clear timer, unsubscribe event listener.
//
//  COMMON GOTCHA — async:
//    You CANNOT make the callback itself async.
//    The callback must return either nothing or a cleanup function.
//    Returning a Promise (what async does) breaks cleanup.
//    Solution: define an inner async function and call it immediately.
//
//  STRICTMODE DOUBLE INVOKE:
//    In development, React intentionally mounts → unmounts → remounts
//    every component. This means your effect + cleanup will run twice.
//    This is a feature — it surfaces missing cleanups.
//    It does NOT happen in production.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import LogWindow from './LogWindow'
import { useLog } from '../hooks/useLog'
import './Demo.css'

export default function UseEffectDemo() {
  const [count, setCount]       = useState(0)
  const [userId, setUserId]     = useState(1)
  const [mounted, setMounted]   = useState(true)  // for unmount demo
  const { entries, addLog, clearLog } = useLog()

  // ── EFFECT 1: Empty dependency array → runs once on mount ─────────────────
  useEffect(() => {
    addLog('[effect 1] mounted — runs once because dep array is []', 'useEffect')

    // The cleanup here runs ONLY when the component unmounts.
    return () => {
      addLog('[effect 1] cleanup — component is unmounting', 'cleanup')
    }
  }, []) // ← empty array = "no dependencies, run once"

  // ── EFFECT 2: Depends on `count` → re-runs when count changes ─────────────
  useEffect(() => {
    addLog(`[effect 2] count changed → now ${count}`, 'useEffect')

    // This cleanup runs BEFORE the next time this effect runs.
    // i.e. React does: cleanup(old) → run(new)
    return () => {
      addLog(`[effect 2] cleanup before re-run (count was ${count})`, 'cleanup')
    }
  }, [count]) // ← only re-runs when `count` changes

  // ── EFFECT 3: Async data fetch inside useEffect ───────────────────────────
  useEffect(() => {
    // Pattern: use a "cancelled" flag to prevent setting state
    // on an unmounted component (avoids memory leaks + React warnings).
    let cancelled = false

    // ✅ Correct async pattern inside useEffect
    async function fetchUser() {
      addLog(`[effect 3] fetching user ${userId}...`, 'useEffect')

      try {
        // Real fetch — hits JSONPlaceholder, a free mock API
        const res  = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        const data = await res.json()

        // Guard: don't update state if the component unmounted
        // or if this effect was superseded by a newer userId
        if (!cancelled) {
          addLog(`[effect 3] ✓ received user: "${data.name}"`, 'useEffect')
        } else {
          addLog(`[effect 3] ✗ response ignored (cancelled)`, 'info')
        }
      } catch (err) {
        if (!cancelled) addLog(`[effect 3] fetch error: ${err.message}`, 'cleanup')
      }
    }

    fetchUser()

    // Cleanup: flip the flag. If userId changes before fetch completes,
    // the previous fetch result is discarded.
    return () => {
      cancelled = true
      addLog(`[effect 3] cleanup — cancelling previous fetch for user ${userId}`, 'cleanup')
    }
  }, [userId]) // ← re-fetches whenever userId changes

  return (
    <div className="demo">
      <div className="demo-section">
        <h2>useEffect</h2>
        <p className="hook-timing">
          Fires: <strong>after browser paint</strong>
        </p>
        <p className="hook-desc">
          The default hook for side effects. Non-blocking — the browser
          paints first, then your effect runs. Safe for fetch, subscriptions, timers.
        </p>
      </div>

      {/* DEMO: Mount/Unmount to see effect 1 cleanup */}
      <div className="demo-section">
        <p className="section-label">Effect 1 — mount / unmount</p>
        <div className="controls">
          <button onClick={() => setMounted(m => !m)}>
            {mounted ? 'unmount component' : 'remount component'}
          </button>
          <span className="badge">{mounted ? 'mounted' : 'unmounted'}</span>
        </div>
        {/* When unmounted, effects 2 and 3 also unmount — check the log */}
        {!mounted && (
          <p className="hint">Component unmounted. Remount to restart all effects.</p>
        )}
      </div>

      {/* DEMO: Increment to trigger effect 2 */}
      <div className="demo-section">
        <p className="section-label">Effect 2 — dep on count</p>
        <div className="controls">
          <button onClick={() => setCount(c => c + 1)}>
            increment count
          </button>
          <span className="badge">count = {count}</span>
        </div>
      </div>

      {/* DEMO: Change userId to trigger effect 3 (real fetch) */}
      <div className="demo-section">
        <p className="section-label">Effect 3 — async fetch on userId</p>
        <div className="controls">
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => setUserId(id)}
              style={{ opacity: userId === id ? 1 : 0.5 }}
            >
              user {id}
            </button>
          ))}
          <span className="badge">fetching user {userId}</span>
        </div>
        <p className="hint">
          Click quickly between users — watch the "cancelled" log entries.
          The cancellation flag prevents stale responses from updating state.
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
