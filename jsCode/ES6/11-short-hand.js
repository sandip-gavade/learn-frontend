// ============================================================
//  11 — OBJECT LITERALS (Enhanced / Shorthand)
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Enhanced object literals give you three shortcuts:
//   1. Property shorthand — skip repeating key: value when they match
//   2. Method shorthand  — define methods without `function` keyword
//   3. Computed keys     — use variables/expressions as property names

// ─── 1. PROPERTY SHORTHAND ──────────────────────────────────

const name = 'Priya';
const age = 28;
const city = 'Mumbai';

// OLD way — repetitive
const userOld = { name: name, age: age, city: city };

// SHORTHAND — when key name === variable name, write it once
const user = { name, age, city };
console.log(user);
// { name: "Priya", age: 28, city: "Mumbai" }

// Mix shorthand with regular properties
const product = {
  name, // shorthand (variable)
  price: 499, // regular
  category: 'Books', // regular
};
console.log(product);

// ─── 2. METHOD SHORTHAND ────────────────────────────────────

// OLD way
const calcOld = {
  add: function (a, b) {
    return a + b;
  },
};

// NEW way — drop `: function`
const calc = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
};

console.log(calc.add(3, 2)); // 5
console.log(calc.multiply(4, 5)); // 20

// ─── 3. COMPUTED PROPERTY NAMES ─────────────────────────────

// Use [ ] to compute a property name from a variable or expression

const field = 'email';
const value = 'raj@test.com';

const formData = {
  [field]: value,
};
console.log(formData); // { email: "raj@test.com" }

// Expression in computed key
const prefix = 'user';
const userData = {
  [`${prefix}Name`]: 'Amit',
  [`${prefix}Age`]: 25,
};
console.log(userData); // { userName: "Amit", userAge: 25 }

// Dynamic key from function parameter
const createField = (key, val) => ({ [key]: val });
console.log(createField('phone', '9876543210'));
// { phone: "9876543210" }

// ─── ALL THREE TOGETHER ─────────────────────────────────────

const type = 'success';
const message = 'Saved!';
const timestamp = Date.now();

const notification = {
  type, // shorthand
  message, // shorthand
  timestamp, // shorthand
  [`${type}Count`]: 1, // computed key → { successCount: 1 }
  dismiss() {
    // method shorthand
    console.log('Dismissed');
  },
};

console.log(notification);

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Building state objects from variables (property shorthand)
//
//    const LoginForm = () => {
//      const [email, setEmail] = useState("");
//      const [password, setPassword] = useState("");
//
//      const handleSubmit = () => {
//        // Property shorthand in action!
//        const credentials = { email, password };
//        // Same as: { email: email, password: password }
//
//        fetch("/api/login", {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify(credentials),
//        });
//      };
//    };

// B. ONE handler for ALL form fields (computed keys) — VERY IMPORTANT
//
//    const SignupForm = () => {
//      const [form, setForm] = useState({
//        name: "",
//        email: "",
//        phone: "",
//      });
//
//      // One handler using computed property name!
//      const handleChange = (e) => {
//        const { name, value } = e.target;     // destructuring
//        setForm(prev => ({
//          ...prev,          // spread existing state
//          [name]: value,    // computed key — updates the right field
//        }));
//      };
//
//      return (
//        <form>
//          <input name="name"  value={form.name}  onChange={handleChange} />
//          <input name="email" value={form.email} onChange={handleChange} />
//          <input name="phone" value={form.phone} onChange={handleChange} />
//        </form>
//      );
//    };
//
//    // When you type in the email input:
//    // e.target.name = "email", e.target.value = "a@b.com"
//    // setForm({ ...prev, ["email"]: "a@b.com" })
//    // → { name: "", email: "a@b.com", phone: "" }
//
//    // This pattern saves you from writing 3 separate handlers!

// C. API response shaping
//
//    const fetchAndShape = async (userId) => {
//      const res = await fetch(`/api/users/${userId}`);
//      const { name, email, avatar } = await res.json();
//      return { name, email, avatar }; // shorthand — clean!
//    };

// D. Dynamic state keys in custom hooks
//
//    const useFormField = (fieldName, initialValue = "") => {
//      const [value, setValue] = useState(initialValue);
//      return {
//        [fieldName]: value,            // computed key
//        [`set${fieldName}`]: setValue,  // computed key
//      };
//    };
//
//    // Usage:
//    const { email, setEmail } = useFormField("email");

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Rewrite using property shorthand
const title = 'React Course';
const price = 499;
const rating = 4.5;
const course = { title: title, price: price, rating: rating };

// 2. Create a function updateField(fieldName, value) that returns
//    an object with that computed key.
//    updateField("email", "a@b.com")  → { email: "a@b.com" }
//    updateField("age", 25)           → { age: 25 }

// 3. You have these variables. Build a `config` object using
//    ALL the shorthand techniques:
const host = 'localhost';
const port = 3000;
const env = 'development';
// The object should have: host, port, env, isDev (computed: env === "development"),
// and a method `url()` that returns `http://${host}:${port}`

// 4. Write the handleChange function for a form with fields
//    [firstName, lastName, email] using ONE handler with computed keys

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const course = { title, price, rating };

// 2.
const updateField = (fieldName, value) => ({ [fieldName]: value });
console.log(updateField("email", "a@b.com")); // { email: "a@b.com" }

// 3.
const config = {
  host,                            // shorthand
  port,                            // shorthand
  env,                             // shorthand
  isDev: env === "development",    // regular (computed value)
  url() {                          // method shorthand
    return `http://${this.host}:${this.port}`;
  },
};
console.log(config.url()); // "http://localhost:3000"

// 4.
const handleChange = (e) => {
  const { name, value } = e.target;  // destructuring
  setForm(prev => ({
    ...prev,                          // spread
    [name]: value,                    // computed key
  }));
};

*/
