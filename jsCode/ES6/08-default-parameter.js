// ============================================================
//  08 — DEFAULT PARAMETERS
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Default parameters let you set fallback values for function
// arguments. If the caller doesn't pass a value (or passes
// undefined), the default kicks in.

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// 1. The problem
function greetOld(name) {
  return 'Hello, ' + name;
}
console.log(greetOld()); // "Hello, undefined" — oops!

// 2. With default parameter
const greet = (name = 'Guest') => `Hello, ${name}`;
console.log(greet('Priya')); // "Hello, Priya"
console.log(greet()); // "Hello, Guest"
console.log(greet(undefined)); // "Hello, Guest" (undefined triggers default)
console.log(greet(null)); // "Hello, null"  (null does NOT trigger default!)

// 3. Multiple defaults
const createUser = (name, role = 'viewer', active = true) => ({
  name,
  role,
  active,
});

console.log(createUser('Amit'));
// { name: "Amit", role: "viewer", active: true }

console.log(createUser('Amit', 'admin'));
// { name: "Amit", role: "admin", active: true }

console.log(createUser( 'admin', false));
// { name: "Amit", role: "admin", active: false }

// 4. Defaults can be expressions
const getTimestamp = (date = new Date()) => date.toISOString();
console.log(getTimestamp()); // current date-time

// 5. Defaults with destructured parameters — VERY common
const fetchData = ({ url, method = 'GET', timeout = 5000 } = {}) => {
  console.log(`${method} ${url} (timeout: ${timeout}ms)`);
};

fetchData({ url: '/api/users' });
// GET /api/users (timeout: 5000ms)

fetchData({ url: '/api/users', method: 'POST', timeout: 10000 });
// POST /api/users (timeout: 10000ms)

fetchData(); // GET undefined (timeout: 5000ms) — no crash because of = {}

// 6. Why the = {} at the end?
// Without it, calling fetchData() with no arguments would crash
// because you can't destructure undefined.
// The = {} means "if nothing is passed, use an empty object".

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Component props with defaults — cleanest pattern
//
//    const Button = ({
//      label = "Click",
//      variant = "primary",
//      size = "md",
//      disabled = false,
//    }) => (
//      <button
//        className={`btn btn-${variant} btn-${size}`}
//        disabled={disabled}
//      >
//        {label}
//      </button>
//    );
//
//    // All of these work:
//    <Button />                          → "Click", primary, md
//    <Button label="Save" />             → "Save", primary, md
//    <Button variant="danger" />          → "Click", danger, md
//    <Button label="Delete" variant="danger" size="sm" />

// B. Custom hooks with default config
//
//    const usePagination = ({ page = 1, pageSize = 10 } = {}) => {
//      const [currentPage, setCurrentPage] = useState(page);
//      const offset = (currentPage - 1) * pageSize;
//      return { currentPage, setCurrentPage, offset, pageSize };
//    };
//
//    // Usage:
//    const { currentPage, offset } = usePagination();           // defaults
//    const paging = usePagination({ pageSize: 25 });             // custom size

// C. Utility functions with sensible defaults
//
//    const formatCurrency = (amount, currency = "INR", locale = "en-IN") =>
//      new Intl.NumberFormat(locale, {
//        style: "currency",
//        currency,
//      }).format(amount);
//
//    formatCurrency(1500);           // "₹1,500.00"
//    formatCurrency(1500, "USD");    // "$1,500.00"

// D. API helper with defaults
//
//    const apiFetch = async (endpoint, options = {}) => {
//      const {
//        method = "GET",
//        headers = { "Content-Type": "application/json" },
//        body = null,
//      } = options;
//
//      const res = await fetch(`/api${endpoint}`, { method, headers, body });
//      return res.json();
//    };
//
//    apiFetch("/users");                                    // GET
//    apiFetch("/users", { method: "POST", body: "..." });   // POST

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Add defaults: currency = "INR", decimals = 2
const formatPrice = (amount, currency, decimals) =>
  `${currency} ${amount.toFixed(decimals)}`;

// Test: formatPrice(999.5) should return "INR 999.50"

// 2. Create a function makeBadge(text, color, pill)
//    Defaults: color = "gray", pill = false
//    Returns: { text, color, className: "badge-pill" or "badge" }

// 3. Create a function createConfig({ host, port, debug })
//    Defaults: host = "localhost", port = 3000, debug = false
//    Should also work when called with no arguments: createConfig()

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const formatPrice = (amount, currency = "INR", decimals = 2) =>
  `${currency} ${amount.toFixed(decimals)}`;
console.log(formatPrice(999.5)); // "INR 999.50"

// 2.
const makeBadge = (text, color = "gray", pill = false) => ({
  text,
  color,
  className: pill ? "badge-pill" : "badge",
});
console.log(makeBadge("New"));          // { text: "New", color: "gray", className: "badge" }
console.log(makeBadge("Sale", "red", true)); // { text: "Sale", color: "red", className: "badge-pill" }

// 3.
const createConfig = ({ host = "localhost", port = 3000, debug = false } = {}) => ({
  host,
  port,
  debug,
});
console.log(createConfig());              // { host: "localhost", port: 3000, debug: false }
console.log(createConfig({ port: 8080 })); // { host: "localhost", port: 8080, debug: false }

*/
