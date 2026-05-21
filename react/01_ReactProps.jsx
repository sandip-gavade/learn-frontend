// =============================================================================
// 📘 REACT PROPS — A Complete Deep Dive
// =============================================================================
//
// WHAT ARE PROPS?
// ---------------
// "Props" is short for "properties". They are the mechanism React uses to pass
// data FROM a parent component DOWN TO a child component. Think of them like
// function arguments — just as you call greet("Sandip") and the function
// receives "Sandip" as a parameter, a parent component passes data to a child
// via props.
//
// KEY MENTAL MODEL:
//   Props are to components what arguments are to functions.
//   <UserCard name="Sandip" />  ←→  UserCard({ name: "Sandip" })
//
// WHY DO PROPS EXIST?
// -------------------
// React's architecture is built around "composition" — building complex UIs
// by combining smaller, reusable pieces. Props make this possible:
//   1. They let a single component render DIFFERENT content each time it's used.
//   2. They establish a clear, one-way data flow (parent → child).
//   3. They make components testable and predictable.
//
// PROPS IN THE COMPONENT LIFECYCLE:
// ---------------------------------
// Understanding when props come into play during a component's life:
//
//   1. MOUNTING PHASE (component appears on screen for the first time):
//      - Parent renders and includes <Child someData={value} />
//      - React calls the Child function with { someData: value } as the argument
//      - Child uses those props to produce its initial JSX output
//      - React commits that JSX to the real DOM
//
//   2. UPDATING PHASE (component re-renders due to changes):
//      - When the PARENT re-renders (because its own state changed, or IT
//        received new props from ITS parent), React re-calls the Child function
//        with the LATEST props.
//      - React compares the new JSX output with the previous output (diffing)
//        and updates only what changed in the real DOM.
//      - IMPORTANT: The child does NOT control when this happens. The parent
//        decides what props to pass. The child just receives and uses them.
//
//   3. UNMOUNTING PHASE (component is removed from screen):
//      - Props don't play a direct role here, but cleanup functions in
//        useEffect (which may depend on props) run during unmount.
//
//   KEY INSIGHT: A component re-renders when its props change. But more
//   precisely, a component re-renders when its PARENT re-renders — and if
//   the parent passes new prop values, the child sees those new values.
//
// =============================================================================

import React, { useState, useEffect, memo } from "react";

// =============================================================================
// CONCEPT 1: Basic Props — Receiving and Using Data
// =============================================================================
//
// A functional component receives ALL its props as a single object.
// You can destructure them in the function signature for cleaner code.

// WITHOUT destructuring (less common, but shows the raw mechanics):
function GreetingRaw(props) {
  // `props` is a plain JavaScript object: { name: "Sandip", greeting: "Hello" }
  // You access each prop with dot notation.
  return (
    <p>
      {props.greeting}, {props.name}!
    </p>
  );
}

// WITH destructuring (idiomatic React — always prefer this):
function Greeting({ name, greeting }) {
  // Destructuring extracts `name` and `greeting` directly from the props object.
  // Cleaner, self-documenting, and you immediately see what the component expects.
  return (
    <p>
      {greeting}, {name}!
    </p>
  );
}

// HOW THE PARENT PASSES THESE PROPS:
// <Greeting name="Sandip" greeting="Hello" />
//
// Under the hood, React converts this JSX into:
// React.createElement(Greeting, { name: "Sandip", greeting: "Hello" })
//
// So the second argument — that plain object — becomes the `props` parameter.

// =============================================================================
// CONCEPT 2: Props Are READ-ONLY (Immutability)
// =============================================================================
//
// This is a FUNDAMENTAL rule in React:
//
//   ❌ NEVER do this:  props.name = "something else"
//
// Why? Because React relies on a "unidirectional data flow". Data flows
// downward: parent → child. If a child could mutate its props, the parent's
// data would change without the parent knowing, leading to bugs that are
// nearly impossible to track.
//
// If a child needs to "change" something, the parent passes down a CALLBACK
// function as a prop (covered in Concept 6 below).
//
// ANALOGY: Props are like a printed letter you receive in the mail.
// You can READ it, but writing on it doesn't change what the sender wrote.
// If you want to reply, you send a NEW letter back (callback function).

function ReadOnlyDemo({ value }) {
  // ❌ This would cause a runtime error in strict mode / TypeScript:
  // value = "new value";

  // ✅ Correct: just read and render
  return <span>The value is: {value}</span>;
}

// =============================================================================
// CONCEPT 3: Default Props
// =============================================================================
//
// Sometimes a prop is optional. You can specify defaults using:
//   (a) JavaScript default parameters (modern, preferred)
//   (b) The defaultProps static property (legacy, avoid in new code)

// (a) Default parameters — clean and obvious
function Button({ label = "Click Me", variant = "primary", size = "md" }) {
  // If the parent does <Button />, label will be "Click Me", variant "primary".
  // If the parent does <Button label="Submit" />, label is "Submit", rest default.
  const styles = {
    padding: size === "sm" ? "4px 8px" : size === "lg" ? "12px 24px" : "8px 16px",
    backgroundColor: variant === "primary" ? "#2563eb" : "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return <button style={styles}>{label}</button>;
}

// (b) Legacy defaultProps — you'll see this in older codebases
// Button.defaultProps = { label: "Click Me", variant: "primary", size: "md" };
// React team has deprecated this for function components. Don't use it.

// =============================================================================
// CONCEPT 4: Different Data Types as Props
// =============================================================================
//
// Props can be ANY JavaScript value. Here's a component that demonstrates
// the full range of types you can pass:

function PropTypesShowcase({
  // String
  title,
  // Number
  count,
  // Boolean — note: <Component isActive /> passes `true` implicitly
  isActive,
  // Array
  items,
  // Object
  config,
  // Function (callback)
  onAction,
  // JSX / React elements (yes, you can pass components as props!)
  icon,
}) {
  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      {/* String prop */}
      <h3>{title}</h3>

      {/* Number prop */}
      <p>Count: {count}</p>

      {/* Boolean prop — used for conditional rendering */}
      <p>Status: {isActive ? "🟢 Active" : "🔴 Inactive"}</p>

      {/* Array prop — typically mapped to a list of elements */}
      <ul>
        {items.map((item, index) => (
          // KEY PROP: React needs `key` to efficiently track list items
          // during reconciliation. Use a stable unique ID, not index,
          // in production code. Index is acceptable ONLY for static lists.
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Object prop — access nested properties */}
      <p>
        Theme: {config.theme}, Language: {config.language}
      </p>

      {/* Function prop — called on user interaction */}
      <button onClick={onAction}>Perform Action</button>

      {/* JSX/Element prop — rendered inline */}
      <div>{icon}</div>
    </div>
  );
}

// Parent usage:
// <PropTypesShowcase
//   title="Dashboard"
//   count={42}
//   isActive={true}             // or just: isActive
//   items={["React", "Vue", "Angular"]}
//   config={{ theme: "dark", language: "en" }}
//   onAction={() => alert("Action!")}
//   icon={<span>⚡</span>}
// />

// =============================================================================
// CONCEPT 5: The Special `children` Prop
// =============================================================================
//
// When you nest content BETWEEN a component's opening and closing tags,
// React automatically passes that content as a prop called `children`.
//
// This is the foundation of the "composition" pattern — one of React's
// most powerful ideas.

function Card({ children, title }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {/* `children` renders whatever was placed between <Card> and </Card> */}
      {children}
    </div>
  );
}

// Usage:
// <Card title="User Info">
//   <p>Name: Sandip</p>          ← these two <p> tags become `children`
//   <p>Role: Developer</p>
// </Card>
//
// `children` can be:
//   - A single element: <Card><p>Hello</p></Card>
//   - Multiple elements: <Card><p>A</p><p>B</p></Card>
//   - A string: <Card>Just text</Card>
//   - A function (render props pattern): <Card>{(data) => <p>{data}</p>}</Card>
//   - null/undefined: <Card></Card> or <Card />

// =============================================================================
// CONCEPT 6: Callback Props — Child-to-Parent Communication
// =============================================================================
//
// DATA flows down (parent → child) via props.
// EVENTS flow up (child → parent) via callback functions passed as props.
//
// This is how a child "tells" the parent something happened, without
// violating the one-way data flow rule.

function SearchBox({ onSearch, placeholder = "Search..." }) {
  // This component doesn't own the search state — its parent does.
  // It just collects user input and NOTIFIES the parent via onSearch.
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    // Call the parent's function, passing the data upward
    onSearch(query);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button onClick={handleSubmit}>Search</button>
    </div>
  );
}

// In the parent:
// function App() {
//   const handleSearch = (query) => {
//     console.log("User searched for:", query);
//     // fetch results, update state, etc.
//   };
//   return <SearchBox onSearch={handleSearch} placeholder="Search users..." />;
// }
//
// FLOW:
//   1. Parent defines handleSearch and passes it as onSearch prop
//   2. User types in SearchBox and clicks "Search"
//   3. SearchBox calls onSearch(query) — the parent's handleSearch runs
//   4. Parent now has the data and can act on it (setState, fetch, etc.)

// =============================================================================
// CONCEPT 7: Prop Drilling — The Problem & Awareness
// =============================================================================
//
// "Prop drilling" happens when you pass props through multiple intermediate
// components that don't actually USE those props — they just forward them.
//
//   App → Layout → Sidebar → UserMenu → Avatar
//   (user prop drilled through Layout and Sidebar, which don't need it)
//
// This is NOT an error — it's valid React. But it creates:
//   - Maintenance burden (every middle component's signature grows)
//   - Tight coupling (refactoring one component forces changes in many)
//
// SOLUTIONS (just awareness — these are separate topics):
//   - React Context API (useContext)
//   - State management libraries (Redux, Zustand, Jotai)
//   - Component composition (restructuring to avoid deep nesting)
//
// For this tutorial, just be aware that passing props 2-3 levels is fine.
// Beyond that, consider alternatives.

// Example of mild prop drilling (acceptable):
function UserProfile({ user }) {
  return (
    <div>
      <UserAvatar imageUrl={user.avatar} name={user.name} />
      <UserBio bio={user.bio} />
    </div>
  );
}

function UserAvatar({ imageUrl, name }) {
  return <img src={imageUrl} alt={name} style={{ borderRadius: "50%", width: 48, height: 48 }} />;
}

function UserBio({ bio }) {
  return <p style={{ color: "#666" }}>{bio}</p>;
}

// =============================================================================
// CONCEPT 8: React.memo — Optimizing Re-renders Based on Props
// =============================================================================
//
// By default, when a parent re-renders, ALL its children re-render too,
// even if their props haven't changed. For most components this is fine
// (React's diffing is fast). But for expensive components, you can wrap
// them in React.memo() to skip re-renders when props are the same.
//
// HOW IT WORKS:
//   React.memo does a SHALLOW comparison of the previous and next props.
//   If all prop values are the same (by reference for objects/arrays),
//   React skips re-rendering the component and reuses the last output.
//
// LIFECYCLE CONNECTION:
//   This is React's equivalent of the old shouldComponentUpdate().
//   It sits between "parent re-renders" and "child function executes",
//   acting as a gate: "Did props actually change? No? Skip re-render."

const ExpensiveList = memo(function ExpensiveList({ items, title }) {
  // Imagine this component renders 10,000 rows.
  // Without memo, it re-renders every time the parent re-renders,
  // even if `items` and `title` haven't changed.
  console.log(`ExpensiveList rendered with title: ${title}`);

  return (
    <div>
      <h3>{title}</h3>
      {items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
  );
});

// CAVEAT: If the parent passes a NEW object/array/function reference each
// render (e.g., items={[1,2,3]} inline), memo won't help because the
// reference changes every time. Solutions:
//   - useMemo() for objects/arrays
//   - useCallback() for functions
// These are separate hooks, but they complement memo() for prop optimization.

// =============================================================================
// CONCEPT 9: Spreading Props & Forwarding
// =============================================================================
//
// The spread operator (...) lets you forward all props to a child element
// without listing each one. Common in wrapper/HOC patterns.

function CustomInput({ label, ...rest }) {
  // `label` is extracted; everything else (type, placeholder, onChange, etc.)
  // is collected into `rest` and spread onto the native <input>.
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>
        {label}
      </label>
      <input
        {...rest}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
      />
    </div>
  );
}

// Usage:
// <CustomInput
//   label="Email"
//   type="email"
//   placeholder="you@example.com"
//   onChange={(e) => setEmail(e.target.value)}
//   required
// />
//
// The `type`, `placeholder`, `onChange`, and `required` all pass through
// to the native <input> via {...rest}. The component only "consumes" label.

// =============================================================================
// CONCEPT 10: Props vs State — A Quick Comparison
// =============================================================================
//
// This table summarizes the difference (State is covered in detail in file 02):
//
// | Aspect           | Props                        | State                         |
// |------------------|------------------------------|-------------------------------|
// | Ownership        | Owned by PARENT              | Owned by the COMPONENT ITSELF |
// | Mutability       | Read-only in child           | Mutable via setState/setter   |
// | Direction        | Flows downward (parent→child)| Internal to the component     |
// | Trigger rerender | When parent passes new values| When setState/setter is called|
// | Analogy          | Function arguments           | Local variables that persist  |

// =============================================================================
// 🧪 LIVE DEMO: Putting It All Together
// =============================================================================
//
// This main component demonstrates all the above concepts working together.

function ProductCard({ product, onAddToCart, featured = false }) {
  // Props received:
  //   product: object { id, name, price, image, tags }
  //   onAddToCart: callback function (child → parent communication)
  //   featured: boolean with default value

  return (
    <Card title={product.name}>
      {/* children prop: everything between <Card> and </Card> */}
      {featured && (
        <span
          style={{
            backgroundColor: "#fbbf24",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          ⭐ Featured
        </span>
      )}
      <p style={{ fontSize: "24px", fontWeight: 700, color: "#059669" }}>
        ₹{product.price}
      </p>
      <p style={{ color: "#6b7280" }}>
        Tags: {product.tags.join(", ")} {/* Array prop rendered */}
      </p>
      {/* Callback prop — notifies parent when user clicks */}
      <button
        onClick={() => onAddToCart(product.id)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </Card>
  );
}

// =============================================================================
// MAIN EXPORT: Interactive Demo App
// =============================================================================

export default function PropsDemo() {
  const [cartItems, setCartItems] = useState([]);

  // Sample data — in a real app this comes from an API or parent component
  const products = [
    { id: 1, name: "React Handbook", price: 499, tags: ["book", "frontend"] },
    { id: 2, name: "Node.js Course", price: 1299, tags: ["course", "backend"] },
    { id: 3, name: "TypeScript Guide", price: 349, tags: ["book", "types"] },
  ];

  // This callback is PASSED DOWN as a prop to ProductCard.
  // When the child calls it, execution happens HERE in the parent.
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    setCartItems((prev) => [...prev, product.name]);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px", fontFamily: "system-ui" }}>
      <h1 style={{ borderBottom: "2px solid #2563eb", paddingBottom: "8px" }}>
        📘 React Props Demo
      </h1>

      {/* CONCEPT 1 & 3: Basic props with defaults */}
      <Greeting name="Sandip" greeting="Welcome" />

      {/* CONCEPT 4: Different data types */}
      <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      <h2>Product Catalog</h2>

      {/* CONCEPT 6: Callback props — handleAddToCart flows down,
          gets called by child, execution happens in parent */}
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}           // Object prop
          onAddToCart={handleAddToCart} // Function prop (callback)
          featured={index === 0}       // Boolean prop
        />
      ))}

      {/* Show cart to prove child→parent communication works */}
      <Card title="🛒 Cart">
        {cartItems.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>Cart is empty. Click "Add to Cart" above.</p>
        ) : (
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </Card>

      {/* CONCEPT 9: Spread props */}
      <Card title="Spread Props Demo">
        <CustomInput label="Your Name" type="text" placeholder="e.g. Sandip" />
        <CustomInput label="Email" type="email" placeholder="you@example.com" />
      </Card>
    </div>
  );
}

// =============================================================================
// SUMMARY — Props Cheat Sheet
// =============================================================================
//
// 1. Props = data passed from parent to child (like function arguments)
// 2. Props are READ-ONLY — never mutate them in the child
// 3. Default values: use JS default parameters in the function signature
// 4. Any JS value can be a prop: string, number, boolean, array, object,
//    function, JSX element, null, undefined
// 5. `children` is a special prop for content between opening/closing tags
// 6. Callbacks as props enable child → parent communication
// 7. Props changes trigger re-renders (technically, parent re-rendering does)
// 8. React.memo() can skip re-renders when props haven't changed
// 9. Spread operator (...rest) forwards props cleanly
// 10. Prop drilling is passing props through components that don't use them —
//     use Context or state managers for deep trees
//
// =============================================================================
