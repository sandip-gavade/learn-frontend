// src/hooks/useLog.js
//
// A simple helper used across all demo components.
// Gives each demo its own log state + an addLog function.

import { useState, useCallback } from 'react'

export function useLog() {
  const [entries, setEntries] = useState([])

  const addLog = useCallback((message, type = 'info') => {
    const ts = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
    setEntries(prev => [...prev, { ts, message, type }])
    // Also mirrors to the real DevTools console — useful for debugging
    console.log(`[${ts}] ${message}`)
  }, [])

  const clearLog = useCallback(() => setEntries([]), [])

  return { entries, addLog, clearLog }
}
