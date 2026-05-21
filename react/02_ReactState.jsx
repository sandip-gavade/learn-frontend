// =============================================================================
// 📗 REACT STATE — A Complete Deep Dive
// =============================================================================
//
// WHAT IS STATE?
// --------------
// State is data that a component OWNS and can CHANGE over time. When state
// changes, React automatically re-renders the component to reflect the new
// data on screen. It's what makes your UI interactive and dynamic.
//
// KEY MENTAL MODEL:
//   State is a component's "memory" — it remembers values between renders.
//   Without state, every render would start fresh with no knowledge of what
//   happened before (like a function that forgets its variables after returning).
//
// WHY DOES STATE EXIST?
// ---------------------
// Regular JavaScript variables DON'T work for dynamic UIs:
//
//   function Counter() {
//     let count = 0;        // ← resets to 0 on every render!
//     return <p>{count}</p>; // always shows 0
//   }
//
// Problems with regular variables:
//   1. They reset on every render (function re-invoked = variables re-declared)
//   2. Changing them doesn't trigger a re-render (React doesn't know to update)
//
// useState() solves both: it PERSISTS values across renders AND tells React
// to re-render when the value changes.
//
// STATE IN THE COMPONENT LIFECYCLE:
// ---------------------------------
//
//   1. MOUNTING PHASE (first render):
//      - React calls your component function for the first time
//      - useState(initialValue) creates a state "slot" internally and stores
//        the initial value. React returns [currentValue, setterFunction].
//      - Your component uses currentValue to produce JSX
//      - React commits that JSX to the DOM
//      - After DOM is painted, useEffect callbacks run (if any)
//
//   2. UPDATING PHASE (re-renders due to state change):
//      - User interaction (click, type, etc.) calls the setter: setState(newValue)
//      - React SCHEDULES a re-render (it doesn't happen instantly!)
//      - React re-invokes your component function
//      - useState() now returns the NEW value (not the initial value)
//      - Component produces new JSX with the updated state
//      - React diffs old vs new JSX, updates only the changed DOM nodes
//      - useEffect runs if its dependencies changed
//
//      CRITICAL INSIGHT: setState does NOT immediately mutate the variable.
//      The new value is available only on the NEXT render. This is called
//      "asynchronous" state updates (explained in detail in Concept 4).
//
//   3. UNMOUNTING PHASE (component removed):
//      - React discards the component's state entirely
//      - Cleanup functions in useEffect run
//      - The state "slot" no longer exists — if the component mounts again
//        later, useState(initialValue) creates a FRESH slot
//
//   4. STATE PRESERVATION RULE:
//      - React preserves state as long as the component is rendered at the
//        SAME POSITION in the component tree (same type, same key).
//      - If you render <Counter /> at position 0 in a list, and on next render
//        there's still a <Counter /> at position 0, its state survives.
//      - Changing the `key` prop forces React to DESTROY the old instance and
//        CREATE a new one, resetting all state (useful for "reset" patterns).
//
// =============================================================================

import React, { useState, useEffect, useReducer, useRef } from "react";

// =============================================================================
// CONCEPT 1: useState — The Foundation
// =============================================================================
//
// Syntax: const [value, setValue] = useState(initialValue);
//
// - `value`: the current state (read this to render UI)
// - `setValue`: function to update the state (call this to trigger re-render)
// - `initialValue`: what the state starts as on the FIRST render only
//
// RULES OF HOOKS (apply to useState and all hooks):
//   1. Only call hooks at the TOP LEVEL of your component — never inside
//      loops, conditions, or nested functions. React tracks hooks by their
//      ORDER of invocation, so the order must be identical on every render.
//   2. Only call hooks from React function components or custom hooks.

function SimpleCounter() {
  // Declaring state: count starts at 0
  const [count, setCount] = useState(0);

  // On every render, `count` holds the current value.
  // Calling setCount(newValue) tells React: "re-render with this new value."
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <button onClick={() => setCount(count - 1)}>−</button>
      <span style={{ fontSize: "24px", fontWeight: 700, minWidth: "40px", textAlign: "center" }}>
        {count}
      </span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// =============================================================================
// CONCEPT 2: Functional Updates (Updater Functions)
// =============================================================================
//
// There are TWO ways to call the setter:
//
//   (a) Direct value:     setCount(5)          — "set count to 5"
//   (b) Updater function: setCount(prev => prev + 1) — "compute from previous"
//
// WHEN TO USE WHICH:
//   - Use (a) when the new value does NOT depend on the previous value
//     Example: setName("Sandip"), setIsOpen(true)
//
//   - Use (b) when the new value DEPENDS on the previous value
//     Example: setCount(prev => prev + 1), setItems(prev => [...prev, newItem])
//
// WHY (b) matters — the "stale closure" problem:
//
// React batches state updates. If you call setCount(count + 1) three times
// in the same event handler, `count` is the SAME stale value in all three
// calls (the value from the current render), so you get +1 instead of +3.
//
// With setCount(prev => prev + 1), each call receives the LATEST value
// from the queue, so three calls give +3.

function BatchingDemo() {
  const [count, setCount] = useState(0);

  const incrementThreeTimes_BROKEN = () => {
    // ❌ All three read the SAME `count` from this render's closure
    // If count is 0, all three do: setCount(0 + 1) = 1
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Result: count becomes 1, not 3!
  };

  const incrementThreeTimes_CORRECT = () => {
    // ✅ Each updater receives the latest value from the queue
    // First:  prev=0, returns 1
    // Second: prev=1, returns 2
    // Third:  prev=2, returns 3
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    // Result: count becomes 3!
  };

  return (
    <div>
      <p>Count: <strong>{count}</strong></p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={incrementThreeTimes_BROKEN}>
          +3 (Broken — direct value)
        </button>
        <button onClick={incrementThreeTimes_CORRECT}>
          +3 (Correct — updater fn)
        </button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

// =============================================================================
// CONCEPT 3: State with Objects and Arrays (Immutable Updates)
// =============================================================================
//
// GOLDEN RULE: Never mutate state directly. Always create a NEW object/array.
//
// WHY: React uses Object.is() (reference equality) to detect changes.
//   const obj = { a: 1 };
//   obj.a = 2;          // same reference — React thinks nothing changed!
//   setObj(obj);         // ❌ no re-render
//
//   setObj({ ...obj, a: 2 }); // ✅ new object, new reference — React re-renders
//
// This is because:
//   Object.is(obj, obj) === true     (same reference, even if contents changed)
//   Object.is(obj, { ...obj }) === false  (different reference — triggers render)

function UserForm() {
  // State as an object
  const [user, setUser] = useState({
    name: "",
    email: "",
    preferences: {
      newsletter: false,
      theme: "light",
    },
  });

  // ✅ Correct: spread the object, override the changed field
  const handleNameChange = (e) => {
    setUser({ ...user, name: e.target.value });
    // This creates a NEW object with all of user's properties,
    // but `name` overridden with the new value.
  };

  // ✅ Correct: for NESTED objects, spread at each level
  const toggleNewsletter = () => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences, // spread the nested object too!
        newsletter: !user.preferences.newsletter,
      },
    });
    // If you only did { ...user, preferences: { newsletter: true } },
    // you'd LOSE the `theme` property!
  };

  // ❌ WRONG approaches (for awareness):
  // user.name = "New Name";          // direct mutation, no re-render
  // user.preferences.theme = "dark"; // nested mutation, no re-render
  // setUser(user);                   // same reference, React skips render

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        type="text"
        value={user.name}
        onChange={handleNameChange}
        placeholder="Name"
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          checked={user.preferences.newsletter}
          onChange={toggleNewsletter}
        />
        Subscribe to newsletter
      </label>
      <pre style={{ background: "#f3f4f6", padding: "12px", borderRadius: "6px", fontSize: "13px" }}>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}

// STATE WITH ARRAYS — Common Immutable Patterns:
//
// ADD item:    setItems(prev => [...prev, newItem])
// REMOVE item: setItems(prev => prev.filter(item => item.id !== targetId))
// UPDATE item: setItems(prev => prev.map(item =>
//                item.id === targetId ? { ...item, done: true } : item
//              ))
// REORDER:    setItems(prev => { const copy = [...prev]; /* mutate copy */ return copy; })

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn Props", done: true },
    { id: 2, text: "Learn State", done: false },
    { id: 3, text: "Build a project", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  // ADD: spread old array, append new item
  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: newTodo, done: false }, // Date.now() as a quick unique ID
    ]);
    setNewTodo("");
  };

  // UPDATE: map over array, replace the matching item with a new object
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // REMOVE: filter creates a new array excluding the target
  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#9ca3af" : "inherit" }}>
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// CONCEPT 4: State Updates Are Asynchronous (Batching)
// =============================================================================
//
// When you call setState, React does NOT immediately re-render. Instead it:
//   1. Queues the update
//   2. Continues executing the rest of your event handler
//   3. After the handler finishes, React processes ALL queued updates together
//   4. Then triggers ONE re-render with all the new values
//
// This is called "automatic batching" (introduced fully in React 18).
//
// CONSEQUENCE: You CANNOT read the new state right after calling setState.

function AsyncStateDemo() {
  const [value, setValue] = useState(0);

  const handleClick = () => {
    setValue(42);
    // ❌ If you log `value` here, it's still the OLD value (0 on first click)!
    // console.log(value); // → 0, not 42!
    //
    // WHY: `value` is a const captured from this render's closure.
    // The new value (42) only appears on the NEXT render.
    //
    // If you need to act on the new value, either:
    //   (a) Use the new value directly:  const newVal = 42; setValue(newVal); doSomething(newVal);
    //   (b) Use useEffect to react to changes (shown below)
  };

  // This useEffect runs AFTER the re-render when `value` changes
  useEffect(() => {
    if (value !== 0) {
      console.log("Value changed to:", value); // ← this sees the NEW value
    }
  }, [value]); // dependency array: only run when `value` changes

  return (
    <div>
      <p>Value: <strong>{value}</strong></p>
      <button onClick={handleClick}>Set to 42</button>
      <button onClick={() => setValue(0)}>Reset</button>
    </div>
  );
}

// =============================================================================
// CONCEPT 5: Lazy Initialization
// =============================================================================
//
// If computing the initial state is expensive (e.g., reading from
// localStorage, parsing a large dataset), pass a FUNCTION to useState.
//
// useState(expensiveComputation())  ← runs on EVERY render (wasted work)
// useState(() => expensiveComputation()) ← runs only on the FIRST render

function ExpensiveInitDemo() {
  // ✅ The function is called only once, on mount
  const [data, setData] = useState(() => {
    console.log("Computing initial state (runs once)...");
    // Imagine this is: JSON.parse(localStorage.getItem("bigData"))
    // or processing a huge dataset
    const result = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      value: Math.random(),
    }));
    return result;
  });

  const [renderCount, setRenderCount] = useState(0);

  return (
    <div>
      <p>Data items: {data.length} | Render count: {renderCount}</p>
      <button onClick={() => setRenderCount((c) => c + 1)}>
        Force Re-render (check console — initializer doesn't re-run)
      </button>
    </div>
  );
}

// =============================================================================
// CONCEPT 6: useReducer — State for Complex Logic
// =============================================================================
//
// When state updates involve complex logic or multiple sub-values that
// depend on each other, useReducer is often clearer than multiple useState.
//
// It works exactly like Array.reduce():
//   newState = reducer(currentState, action)
//
// WHEN TO USE useReducer OVER useState:
//   - State is an object with multiple related fields
//   - Next state depends on previous state in complex ways
//   - You want to centralize state logic (easier testing, fewer bugs)
//   - You need to pass `dispatch` down to deep children (stable reference)

// The reducer is a PURE function — no side effects, no API calls.
// Given the same state and action, it always returns the same new state.
function shoppingCartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        // If item exists, increment quantity (immutable update)
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      // New item — add with qty 1
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      // Unknown action? Return state unchanged. Never throw in a reducer
      // during development — log a warning instead.
      console.warn(`Unknown action: ${action.type}`);
      return state;
  }
}

function ShoppingCartDemo() {
  const [cart, dispatch] = useReducer(shoppingCartReducer, { items: [] });

  const sampleProducts = [
    { id: "p1", name: "React T-Shirt", price: 799 },
    { id: "p2", name: "useState Mug", price: 399 },
    { id: "p3", name: "useEffect Sticker", price: 99 },
  ];

  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <h4 style={{ marginTop: 0 }}>Available Products</h4>
      {sampleProducts.map((p) => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
          <span>{p.name} — ₹{p.price}</span>
          {/* dispatch sends an ACTION to the reducer */}
          <button onClick={() => dispatch({ type: "ADD_ITEM", payload: p })}>
            Add
          </button>
        </div>
      ))}

      <hr style={{ margin: "12px 0" }} />
      <h4>Cart ({cart.items.length} unique items)</h4>
      {cart.items.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>Empty</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>{item.name} × {item.qty}</span>
              <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                Remove
              </button>
            </div>
          ))}
          <p style={{ fontWeight: 700 }}>Total: ₹{total}</p>
          <button onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

// =============================================================================
// CONCEPT 7: useRef vs useState — "State" That Doesn't Trigger Re-renders
// =============================================================================
//
// Sometimes you need to persist a value between renders WITHOUT causing
// a re-render when it changes. That's useRef.
//
// | Feature         | useState                   | useRef                        |
// |-----------------|----------------------------|-------------------------------|
// | Triggers render | Yes, on every update       | No — never triggers render    |
// | Persists        | Yes, across renders        | Yes, across renders           |
// | Access          | value (via destructuring)   | ref.current                   |
// | Use case        | Data shown in UI           | DOM refs, timers, prev values |

function StopwatchDemo() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // useRef to store the interval ID — we need it to persist across renders,
  // but changing it should NOT cause a re-render.
  const intervalRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 10); // updater function: always latest value
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsed(0);
  };

  // Cleanup on unmount — clear the interval so it doesn't leak
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "36px", fontFamily: "monospace", fontWeight: 700 }}>
        {formatTime(elapsed)}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        {!isRunning ? (
          <button onClick={start}>▶ Start</button>
        ) : (
          <button onClick={stop}>⏸ Stop</button>
        )}
        <button onClick={reset}>↺ Reset</button>
      </div>
    </div>
  );
}

// =============================================================================
// CONCEPT 8: Lifting State Up
// =============================================================================
//
// When two sibling components need to share state, the state lives in their
// CLOSEST common ancestor (parent). The parent passes the value down as
// props and passes setter/callback functions so children can request changes.
//
// This is the bridge between Props and State:
//   - State LIVES in the parent
//   - Props CARRY the state and callbacks DOWN to children
//   - Callbacks CARRY events UP from children to parent
//
//   Parent (owns state) ──── value prop ────→ ChildA (displays)
//          │
//          └──── onChange prop ──→ ChildB (modifies via callback)

function TemperatureConverter() {
  // State lives HERE — the single source of truth
  const [celsius, setCelsius] = useState("");

  // Derived value — NOT separate state! Compute from existing state.
  // RULE: Don't put something in state if you can compute it from other state.
  const fahrenheit = celsius !== "" ? ((parseFloat(celsius) * 9) / 5 + 32).toFixed(1) : "";

  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <label style={{ display: "block", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Celsius</label>
        <input
          type="number"
          value={celsius}
          onChange={(e) => setCelsius(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100px" }}
        />
      </div>
      <span style={{ fontSize: "24px", paddingTop: "18px" }}>=</span>
      <div>
        <label style={{ display: "block", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Fahrenheit</label>
        <input
          type="text"
          value={fahrenheit}
          readOnly
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #e5e7eb", width: "100px", background: "#f9fafb" }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// CONCEPT 9: Resetting State with `key`
// =============================================================================
//
// React preserves state when a component stays at the same position in the
// tree with the same type. To FORCE a reset, change the `key` prop.
//
// This is useful for:
//   - Resetting a form when switching between items
//   - Restarting an animation
//   - Clearing a component's internal state without a manual reset function

function EditableProfile({ userId, userName }) {
  // This component has its own internal state
  const [draft, setDraft] = useState(userName);

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <span style={{ color: "#9ca3af", fontSize: "13px" }}>Editing user {userId}</span>
    </div>
  );
}

function KeyResetDemo() {
  const [selectedId, setSelectedId] = useState(1);
  const users = [
    { id: 1, name: "Sandip" },
    { id: 2, name: "Priya" },
    { id: 3, name: "Rahul" },
  ];
  const selected = users.find((u) => u.id === selectedId);

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {users.map((u) => (
          <button
            key={u.id}
            onClick={() => setSelectedId(u.id)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: selectedId === u.id ? "2px solid #2563eb" : "1px solid #ccc",
              background: selectedId === u.id ? "#eff6ff" : "white",
              cursor: "pointer",
            }}
          >
            {u.name}
          </button>
        ))}
      </div>
      {/* KEY PROP: when selectedId changes, React destroys the old
          EditableProfile and mounts a fresh one — all internal state resets.
          Without key, switching users would keep the old draft text! */}
      <EditableProfile key={selectedId} userId={selected.id} userName={selected.name} />
    </div>
  );
}

// =============================================================================
// CONCEPT 10: useEffect and State — Side Effects in Response to State Changes
// =============================================================================
//
// useEffect lets you run code AFTER React has rendered and committed to DOM.
// It's how you synchronize state with the outside world:
//   - API calls when a search query (state) changes
//   - Starting/stopping subscriptions
//   - Updating document.title
//   - Writing to localStorage
//
// DEPENDENCY ARRAY controls when the effect runs:
//   useEffect(() => { ... })              → runs after EVERY render
//   useEffect(() => { ... }, [])          → runs ONCE after first render (mount)
//   useEffect(() => { ... }, [a, b])      → runs when `a` or `b` changes
//
// CLEANUP: return a function to clean up before the effect re-runs or on unmount
//   useEffect(() => {
//     const id = setInterval(...);
//     return () => clearInterval(id);  ← cleanup
//   }, []);

function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Don't search if query is empty
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Debounce: wait 300ms after user stops typing
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      // Simulated API call — in real code, you'd fetch() here
      const fakeResults = [
        `Result for "${query}" — item 1`,
        `Result for "${query}" — item 2`,
        `Result for "${query}" — item 3`,
      ];
      setResults(fakeResults);
      setIsLoading(false);
    }, 300);

    // CLEANUP: if query changes before 300ms, cancel the previous timeout.
    // This prevents stale results from overwriting newer ones.
    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [query]); // ← Dependency: re-run this effect whenever `query` changes

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search (min 2 chars)..."
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
      />
      {isLoading && <p style={{ color: "#6b7280" }}>Searching...</p>}
      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "8px" }}>
          {results.map((r, i) => (
            <li key={i} style={{ padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============================================================================
// 🧪 LIVE DEMO: Putting It All Together
// =============================================================================

export default function StateDemo() {
  // Track which section is expanded — a simple state-driven UI toggle
  const [openSection, setOpenSection] = useState(null);

  const toggle = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const Section = ({ id, title, children }) => (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        marginBottom: "12px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => toggle(id)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: openSection === id ? "#eff6ff" : "#f9fafb",
          border: "none",
          textAlign: "left",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>{openSection === id ? "▲" : "▼"}</span>
      </button>
      {openSection === id && (
        <div style={{ padding: "16px" }}>{children}</div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px", fontFamily: "system-ui" }}>
      <h1 style={{ borderBottom: "2px solid #059669", paddingBottom: "8px" }}>
        📗 React State Demo
      </h1>
      <p style={{ color: "#6b7280" }}>
        Click each section to expand. Each demonstrates a core state concept.
      </p>

      <Section id="counter" title="1. useState — Simple Counter">
        <SimpleCounter />
      </Section>

      <Section id="batching" title="2. Batching & Updater Functions">
        <BatchingDemo />
      </Section>

      <Section id="objects" title="3. State with Objects (Immutable Updates)">
        <UserForm />
      </Section>

      <Section id="todos" title="4. State with Arrays — Todo List">
        <TodoList />
      </Section>

      <Section id="reducer" title="5. useReducer — Shopping Cart">
        <ShoppingCartDemo />
      </Section>

      <Section id="stopwatch" title="6. useRef vs useState — Stopwatch">
        <StopwatchDemo />
      </Section>

      <Section id="lifting" title="7. Lifting State Up — Temp Converter">
        <TemperatureConverter />
      </Section>

      <Section id="keyreset" title="8. Reset State with key Prop">
        <KeyResetDemo />
      </Section>

      <Section id="search" title="9. useEffect + State — Live Search">
        <LiveSearch />
      </Section>
    </div>
  );
}

// =============================================================================
// SUMMARY — State Cheat Sheet
// =============================================================================
//
// 1. State = component's own memory that persists across renders
// 2. useState(initial) → [value, setter] — value is read-only within a render
// 3. Use updater functions (prev => prev + 1) when new state depends on old
// 4. State updates are ASYNCHRONOUS — new value available on next render
// 5. NEVER mutate objects/arrays — always spread/copy to create new references
// 6. Lazy init: useState(() => compute()) runs the function only on first render
// 7. useReducer centralizes complex state logic into a pure reducer function
// 8. useRef stores values that persist but DON'T trigger re-renders
// 9. Lift state up to the nearest common ancestor for sibling communication
// 10. Change `key` prop to force React to destroy and recreate a component
// 11. useEffect syncs state with the outside world (API calls, subscriptions)
// 12. Derived values should be COMPUTED from state, not stored as separate state
//
// STATE IN THE LIFECYCLE — Quick Reference:
//   Mount  → useState initializer runs, component renders with initial state
//   Update → setter called → re-render scheduled → function re-invoked →
//            useState returns new value → new JSX → DOM diff → update DOM
//   Unmount → state discarded, useEffect cleanup runs
//
// =============================================================================
