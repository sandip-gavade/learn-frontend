// ============================================================
//  05 — ARRAY METHODS (map & filter)
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// .map()    → transforms each element, returns a NEW array
// .filter() → keeps elements that pass a test, returns a NEW array
// Both are NON-MUTATING — they don't change the original array.
// These two are the most-used array methods in React.

// ─── .map() — TRANSFORM EVERY ITEM ─────────────────────────

// 1. Basic — double every number
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5] — original unchanged!

// 2. Extract one property from array of objects
const users = [
  { name: 'Anil', age: 25 },
  { name: 'Priya', age: 30 },
  { name: 'Ravi', age: 10 },
];
const names = users.map((user) => user.name);
console.log(names); // ["Anil", "Priya", "Ravi"]

// 3. Transform objects into different shape
const cards = users.map((user) => ({
  label: user.name.toUpperCase(),
  isAdult: user.age >= 18,
}));
console.log(cards);
// [{ label: "ANIL", isAdult: true }, ...]

// 4. map gives you index as second argument
const indexed = ['a', 'b', 'c'].map((item, index) => `${index}: ${item}`);
console.log(indexed); // ["0: a", "1: b", "2: c"]

// ─── .filter() — KEEP WHAT MATCHES ─────────────────────────

// 5. Basic — keep even numbers
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6]

// 6. Filter objects
const products = [
  { name: 'Phone', price: 15000, inStock: true },
  { name: 'Laptop', price: 60000, inStock: false },
  { name: 'Tablet', price: 25000, inStock: true },
  { name: 'Watch', price: 8000, inStock: true },
];

const available = products.filter((p) => p.inStock);
console.log(available.length); // 3

const expensive = products.filter((p) => p.price > 20000);
console.log(expensive); // [Laptop, Tablet]

// ─── CHAINING — THE REAL POWER ──────────────────────────────

// 7. filter → map chain (very common pattern)
const affordableNames = products
  .filter((p) => p.inStock) // keep in-stock
  .filter((p) => p.price < 20000) // keep affordable
  .map((p) => p.name); // extract names
console.log(affordableNames); // ["Phone", "Watch"]

// 8. You can also chain with other methods
const totalAffordable = products
  .filter((p) => p.price < 20000)
  .reduce((sum, p) => sum + p.price, 0);
console.log(totalAffordable); // 23000

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. .map() to render a list — THE #1 USE CASE
//
//    const TodoList = ({ todos }) => (
//      <ul>
//        {todos.map(todo => (
//          <li key={todo.id}>{todo.text}</li>
//        ))}
//      </ul>
//    );
//
//    ⚠️ IMPORTANT: Always provide a unique `key` prop!
//    Use todo.id, not the array index (index causes bugs on reorder).

// B. .map() to render cards, rows, options, etc.
//
//    const UserGrid = ({ users }) => (
//      <div className="grid">
//        {users.map(user => (
//          <UserCard key={user.id} name={user.name} email={user.email} />
//        ))}
//      </div>
//    );

// C. .filter() + .map() — filtered lists with UI toggle
//
//    const TaskBoard = ({ tasks }) => {
//      const [showDone, setShowDone] = useState(false);
//
//      const visibleTasks = tasks
//        .filter(task => showDone || !task.done)   // filter first
//        .map(task => (                            // then render
//          <div key={task.id} className="task-card">
//            <span>{task.title}</span>
//            {task.done && <span>✅</span>}
//          </div>
//        ));
//
//      return (
//        <div>
//          <label>
//            <input
//              type="checkbox"
//              checked={showDone}
//              onChange={() => setShowDone(!showDone)}
//            />
//            Show completed
//          </label>
//          {visibleTasks}
//        </div>
//      );
//    };

// D. Search/filter pattern
//
//    const UserSearch = ({ users }) => {
//      const [search, setSearch] = useState("");
//
//      const filtered = users.filter(user =>
//        user.name.toLowerCase().includes(search.toLowerCase())
//      );
//
//      return (
//        <div>
//          <input
//            placeholder="Search users..."
//            value={search}
//            onChange={e => setSearch(e.target.value)}
//          />
//          {filtered.map(user => (
//            <div key={user.id}>{user.name}</div>
//          ))}
//        </div>
//      );
//    };

// ─── PRACTICE EXERCISES ─────────────────────────────────────

const students = [
  { name: 'Asha', score: 82, passed: true },
  { name: 'Raj', score: 45, passed: false },
  { name: 'Meena', score: 91, passed: true },
  { name: 'Kiran', score: 67, passed: true },
  { name: 'Dev', score: 38, passed: false },
];

// 1. Get an array of just the names

// 2. Get only students who passed

// 3. Get names of students who scored above 80

// 4. Create a new array with objects like: { name: "ASHA", grade: "Pass" }
//    (name uppercase, grade is "Pass" if passed, "Fail" if not)

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const names = students.map(s => s.name);
// ["Asha", "Raj", "Meena", "Kiran", "Dev"]

// 2.
const passed = students.filter(s => s.passed);

// 3.
const topNames = students
  .filter(s => s.score > 80)
  .map(s => s.name);
// ["Asha", "Meena"]

// 4.
const gradeList = students.map(s => ({
  name: s.name.toUpperCase(),
  grade: s.passed ? "Pass" : "Fail",
}));

*/
