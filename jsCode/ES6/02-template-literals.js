// ============================================================
//  02 — TEMPLATE LITERALS
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Template literals use backticks (`) instead of quotes.
// They let you embed expressions with ${...} and write
// multi-line strings — no more messy concatenation.

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// 1. String interpolation — embedding variables
const name = 'Priya';
const age = 24;

// Old way — hard to read
const old = 'Hi, I am ' + name + ' and I am ' + age + ' years old.';

// Template literal — clean
const modern = `Hi, I am ${name} and I am ${age} years old.`;
console.log(modern); // Hi, I am Priya and I am 24 years old.

// 2. Any expression works inside ${}
const price = 500;
const tax = 0.18;

console.log(`Total: ₹${price + price * tax}`); // Total: ₹590
console.log(`Half: ₹${price / 2}`); // Half: ₹250
console.log(`Adult? ${age >= 18 ? 'Yes' : 'No'}`); // Adult? Yes

// 3. Multi-line strings — no \n needed
const card = `
  Name: ${name}
  Age:  ${age}
  City: Mumbai
`;
console.log(card);

// 4. Tagged template (advanced, just know it exists)
//    Libraries like styled-components use this pattern:
//    const Button = styled.button`
//      background: blue;
//      color: white;
//    `;

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Dynamic class names — extremely common
//
//    const Button = ({ variant, size }) => {
//      const className = `btn btn-${variant} btn-${size}`;
//      return <button className={className}>Click</button>;
//    };
//    // <Button variant="primary" size="lg" />
//    // renders: <button class="btn btn-primary btn-lg">

// B. Dynamic inline styles
//
//    const Avatar = ({ size }) => (
//      <div style={{
//        width: `${size}px`,
//        height: `${size}px`,
//        borderRadius: "50%",
//      }} />
//    );

// C. API URLs with dynamic segments
//
//    const fetchUser = async (id) => {
//      const res = await fetch(`/api/users/${id}`);
//      return res.json();
//    };
//
//    const fetchProducts = async (category, page) => {
//      const url = `/api/products?category=${category}&page=${page}`;
//      const res = await fetch(url);
//      return res.json();
//    };

// D. Conditional classes (before you learn classnames library)
//
//    const Card = ({ isActive, isHighlighted }) => (
//      <div className={`card ${isActive ? "active" : ""} ${isHighlighted ? "highlight" : ""}`}>
//        ...
//      </div>
//    );

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Rewrite using template literal
const item = 'Laptop';
const cost = 75000;
const msg =
  'The ' + item + ' costs Rs.' + cost + ' (incl. Rs.' + cost * 0.18 + ' GST)';

// 2. Create a function that builds an API URL
//    buildUrl("users", 5)  →  "/api/users/5"
//    buildUrl("posts", 12) →  "/api/posts/12"

// 3. Create a function that returns a greeting card HTML string
//    using template literals (takes name and message as params)

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const msg = `The ${item} costs Rs.${cost} (incl. Rs.${cost * 0.18} GST)`;

// 2.
const buildUrl = (resource, id) => `/api/${resource}/${id}`;

// 3.
const greetingCard = (name, message) => `
  <div class="card">
    <h2>Dear ${name},</h2>
    <p>${message}</p>
  </div>
`;

*/
