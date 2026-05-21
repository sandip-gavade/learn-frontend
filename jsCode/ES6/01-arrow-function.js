// ============================================================
//  01 — ARROW FUNCTIONS
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Arrow functions are a shorter way to write functions.
// They also don't have their own `this`, which makes them
// perfect for callbacks and React components.

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// 1. Traditional function
function greet(name) {
  return 'Hello, ' + name;
}

// 2. Same thing as arrow function
const greetArrow = (name) => {
  return 'Hello, ' + name;
};

// 3. Single expression → implicit return (no braces, no return keyword)
const greetShort = (name) => 'Hello, ' + name;
console.log(greetShort('React'));

// 4. Single parameter → parentheses optional
const double = (n) => n * 2;

console.log(greet('Raj')); // Hello, Raj
console.log(greetArrow('Raj')); // Hello, Raj
console.log(greetShort('Raj')); // Hello, Raj
console.log(double(5)); // 10

// 5. No parameters → empty parentheses required
const sayHi = () => 'Hi!';
console.log(sayHi()); // Hi!

// 6. Returning an object → wrap in parentheses
//    Without () JS thinks { } is a code block, not an object
const makeUser = (name, age) => ({ name, age });
console.log(makeUser('Priya', 24)); // { name: "Priya", age: 24 }

// 7. Arrow functions in callbacks — cleaner than traditional
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Every React component is an arrow function:
//
//    const Greeting = ({ name }) => {
//      return <h2>Welcome, {name}!</h2>;
//    };
//
//    // Short form for simple components:
//    const Greeting = ({ name }) => <h2>Welcome, {name}!</h2>;

// B. Event handlers are arrow functions:
//
//    const Counter = () => {
//      const [count, setCount] = useState(0);
//
//      const increment = () => setCount(count + 1);
//      const decrement = () => setCount(count - 1);
//
//      return (
//        <div>
//          <button onClick={decrement}>-</button>
//          <span>{count}</span>
//          <button onClick={increment}>+</button>
//        </div>
//      );
//    };

// C. Inline callbacks in JSX:
//
//    <button onClick={() => alert("Clicked!")}>Click Me</button>
//    <input onChange={(e) => setName(e.target.value)} />

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Convert to arrow function
function add(a, b) {
  return a + b;
}

// 2. Convert to single-line arrow
function isEven(n) {
  return n % 2 === 0;
}

// 3. Convert — this one returns an object
function createProduct(name, price) {
  return { name: name, price: price };
}

// 4. Rewrite using arrow in .filter()
const ages = [12, 18, 25, 8, 30];
const adults = ages.filter(function (age) {
  return age >= 18;
});

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

const add = (a, b) => a + b;

const isEven = n => n % 2 === 0;

const createProduct = (name, price) => ({ name, price });

const adults = ages.filter(age => age >= 18);

*/
