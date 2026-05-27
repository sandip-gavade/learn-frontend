import { useState, useMemo } from 'react';

// Expensive function — wastes time on purpose

function MemoExample() {
  const [number, setNumber] = useState(5);
  const [theme, setTheme] = useState('light');

  function slowDouble(n) {
    console.log('🐌 Running slow calculation...');
    for (let i = 0; i < 500000000; i++) {} // ~500ms delay
    return n * 2;
  }

  //const doubled = slowDouble(number);
  // ✅ Only re-runs when `number` changes, NOT when theme changes
  const doubled = useMemo(() => slowDouble(number), [number]);

  // Toggle between light/dark to test — it should be instant
  // Remove useMemo wrapper above and try again — theme toggle will lag

  return (
    <div
      style={{
        background: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
        padding: 20,
      }}
    >
      <h2>5. useMemo</h2>
      <p>
        The slow calculation only runs when "number" changes. Toggle theme —
        it's instant because useMemo returns cached result.
      </p>
      <p>
        Try removing useMemo in code and toggle theme — you'll feel the lag.
      </p>

      <div>
        <label>Number: </label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
        />
      </div>

      <p>
        Double: <strong>{doubled}</strong>
      </p>

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme ({theme})
      </button>

      <p style={{ fontSize: 12, opacity: 0.6 }}>
        Check console for "🐌 Running slow calculation..." logs
      </p>
    </div>
  );
}

export default MemoExample;
