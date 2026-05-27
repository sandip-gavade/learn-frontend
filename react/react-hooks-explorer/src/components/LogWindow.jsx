// src/components/LogWindow.jsx
//
// Renders the terminal-style log used by all three demos.

export default function LogWindow({ entries }) {
  return (
    <div className="log" aria-label="effect log output">
      {entries.length === 0 && (
        <span style={{ color: '#444' }}>— log is empty —</span>
      )}
      {entries.map((e, i) => (
        <div key={i} className="log-entry">
          <span className="log-ts">{e.ts}</span>
          <span className={`color-${e.type}`}>{e.message}</span>
        </div>
      ))}
    </div>
  )
}
