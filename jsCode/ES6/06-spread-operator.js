// ============================================================
//  06 — SPREAD OPERATOR (...)
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// The spread operator (...) expands an array or object into
// individual elements. It's essential for:
//   - Copying arrays/objects (without mutating the original)
//   - Merging arrays/objects
//   - Immutable state updates in React (this is HUGE)

// ─── JAVASCRIPT BASICS — ARRAYS ─────────────────────────────

// 1. Copy an array
const fruits = ['apple', 'banana'];
const copy = [...fruits];
console.log(copy); // ["apple", "banana"]
console.log(copy === fruits); // false — it's a NEW array

// 2. Merge arrays
const veggies = ['carrot', 'pea'];
const food = [...fruits, ...veggies];
console.log(food); // ["apple", "banana", "carrot", "pea"]

// 3. Add items at any position
const withMango = ['mango', ...fruits, 'orange'];
console.log(withMango); // ["mango", "apple", "banana", "orange"]

// 4. Spread into function arguments
const scores1 = [85, 92, 78, 106, 11, 22, 33, 33];
for (let index = 1; index < scores1.length; index++) {
  const element = scores1[index];
  console.log(element);
}
console.log(Math.min(...scores1)); // 95
// Same as: Math.max(85, 92, 78, 95)

// ─── JAVASCRIPT BASICS — OBJECTS ────────────────────────────

// 5. Copy an object
const defaults = { theme: 'light', lang: 'en', fontSize: 14 };
const copy2 = { ...defaults };

// 6. Merge objects — LATER values WIN
const userPrefs = { theme: 'dark', fontSize: 18 };
const final = { ...defaults, ...userPrefs };
console.log(final);
// { theme: "dark", lang: "en", fontSize: 18 }
//   ↑ "dark" won because userPrefs came after defaults

// 7. Add or update a single property
const updated = { ...defaults, theme: 'dark' };
console.log(updated); // { theme: "dark", lang: "en", fontSize: 14 }

// 8. Rest pattern (the opposite — collect remaining)
const { theme, ...otherSettings } = defaults;
console.log(theme); // "light"
console.log(otherSettings); // { lang: "en", fontSize: 14 }

// ─── WHY NOT JUST ASSIGN? ───────────────────────────────────

// ⚠️ This does NOT copy — both point to the same object
const original = { a: 1, b: 2 };
const reference = original;
reference.a = 999;
console.log(original.a); // 999 — original got mutated!

// ✅ Spread creates a true copy
const original2 = { a: 1, b: 2 };
const safeCopy = { ...original2 };
safeCopy.a = 999;
console.log(original2.a); // 1 — original is safe

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. IMMUTABLE STATE UPDATES — the #1 use case
//    React only re-renders when it detects a NEW object/array.
//    Mutating the existing one does NOT trigger a re-render.
//
//    const TodoApp = () => {
//      const [todos, setTodos] = useState([
//        { id: 1, text: "Learn JS", done: false }
//      ]);
//
//      // ADD — spread old array + append new item
//      const addTodo = (text) => {
//        setTodos([...todos, { id: Date.now(), text, done: false }]);
//      };
//
//      // REMOVE — filter returns new array (no spread needed)
//      const removeTodo = (id) => {
//        setTodos(todos.filter(t => t.id !== id));
//      };
//
//      // UPDATE ONE ITEM — map + spread the matching object
//      const toggleTodo = (id) => {
//        setTodos(todos.map(t =>
//          t.id === id
//            ? { ...t, done: !t.done }   // new object with done flipped
//            : t                          // keep others as-is
//        ));
//      };
//    };

// B. Updating nested state
//
//    const [user, setUser] = useState({
//      name: "Raj",
//      address: { city: "Delhi", pin: "110001" },
//    });
//
//    // Update city without mutating
//    setUser({
//      ...user,
//      address: { ...user.address, city: "Mumbai" },
//    });

// C. Spreading props to child components
//
//    const Input = (props) => (
//      <input className="form-input" {...props} />
//    );
//    // Usage: <Input type="email" placeholder="Email" value={email} />
//    // All attributes get spread onto the <input>

// D. Separating own props from passed-through props
//
//    const Card = ({ children, className, ...rest }) => (
//      <div className={`card ${className}`} {...rest}>
//        {children}
//      </div>
//    );

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Merge these (settings should override base)
const base = { color: 'blue', size: 'md', rounded: false };
const settings = { size: 'lg', rounded: true };

// 2. Add "grape" to the end of fruits without mutating original
const fruitList = ['apple', 'banana', 'cherry'];

// 3. Update user's city to "Mumbai" without mutating
const user = { name: 'Raj', city: 'Delhi', age: 25 };

// 4. You have this state. Write the setUser call to update
//    ONLY the zip code to "560001".
//    const [user, setUser] = useState({
//      name: "Anil",
//      address: { city: "Bangalore", zip: "560100" },
//    });

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const merged = { ...base, ...settings };
// { color: "blue", size: "lg", rounded: true }

// 2.
const newFruits = [...fruitList, "grape"];

// 3.
const movedUser = { ...user, city: "Mumbai" };

// 4.
setUser(prev => ({
  ...prev,
  address: { ...prev.address, zip: "560001" },
}));

*/
