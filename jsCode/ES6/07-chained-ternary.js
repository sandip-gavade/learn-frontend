// ============================================================
//  07 — TERNARY OPERATOR
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// The ternary is a one-line if-else that RETURNS a value:
//   condition ? valueIfTrue : valueIfFalse
//
// Key difference from if-else:
//   if-else is a STATEMENT (can't use inside JSX)
//   ternary is an EXPRESSION (returns a value, can use anywhere)

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// 1. Basic comparison
const age = 20;

// if-else (statement)
let status;
if (age >= 18) {
  status = 'Adult';
} else {
  status = 'Minor';
}

// Ternary (expression) — same result, one line
const status2 = age >= 18 ? 'Adult' : 'Minor';
console.log(status2); // "Adult"

// 2. Use inside template literals
console.log(`You are ${age >= 18 ? 'eligible' : 'not eligible'} to vote`);

// 3. Use in variable assignments
const price = 1000;
const discount = price > 500 ? 0.1 : 0;
const finalPrice = price - price * discount;
console.log(finalPrice); // 900

// 4. Use in function returns
const getLabel = (count) => (count === 0 ? 'Empty' : `${count} items`);
console.log(getLabel(0)); // "Empty"
console.log(getLabel(5)); // "5 items"

// 5. Chained ternary (use sparingly — can get unreadable)
const score = 75;
const grade =
  score >= 90
    ? 'A'
    : score >= 80
      ? 'B'
      : score >= 70
        ? 'C'
        : score >= 60
          ? 'D'
          : 'F';
console.log(grade); // "C"

// TIP: For 3+ conditions, a function with early returns is cleaner:
const getGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// ─── HOW IT'S USED IN REACT ─────────────────────────────────
//
// JSX only allows EXPRESSIONS inside { }.
// You can't write if-else inside JSX, so ternary is the way.

// A. Conditional rendering — show different content
//
//    const Greeting = ({ isLoggedIn, name }) => (
//      <div>
//        {isLoggedIn
//          ? <h2>Welcome back, {name}!</h2>
//          : <h2>Please sign in</h2>
//        }
//      </div>
//    );

// B. Conditional CSS classes
//
//    const Alert = ({ type, message }) => (
//      <div className={type === "error" ? "alert-red" : "alert-green"}>
//        {message}
//      </div>
//    );

// C. Conditional attributes
//
//    const SubmitButton = ({ isLoading }) => (
//      <button disabled={isLoading}>
//        {isLoading ? "Saving..." : "Save"}
//      </button>
//    );

// D. Loading → Error → Data pattern (very common)
//
//    const UserProfile = ({ loading, error, user }) => (
//      <div>
//        {loading
//          ? <p>Loading...</p>
//          : error
//            ? <p className="error">Error: {error}</p>
//            : <div>
//                <h2>{user.name}</h2>
//                <p>{user.email}</p>
//              </div>
//        }
//      </div>
//    );

// E. Inline style toggle
//
//    const Card = ({ isExpanded }) => (
//      <div style={{
//        height: isExpanded ? "auto" : "100px",
//        overflow: isExpanded ? "visible" : "hidden",
//      }}>
//        ...
//      </div>
//    );

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Use ternary to set the label
const cartCount = 3;
// If count > 0 → "View Cart (3)"
// Else         → "Cart Empty"

// 2. Use ternary for a greeting
const hour = 14;
// If hour < 12 → "Good morning"
// Else          → "Good afternoon"

// 3. Write a function that returns a shipping message:
//    amount >= 500 → "Free shipping!"
//    amount > 0    → "Shipping: ₹50"
//    else          → "Cart is empty"

// 4. JSX exercise: write a ternary that shows
//    <span className="badge active"> if count > 0
//    <span className="badge hidden"> if count === 0
//    with the count number inside

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const buttonLabel = cartCount > 0 ? `View Cart (${cartCount})` : "Cart Empty";

// 2.
const greeting = hour < 12 ? "Good morning" : "Good afternoon";

// 3.
const getShippingMsg = (amount) =>
  amount >= 500 ? "Free shipping!" :
  amount > 0    ? "Shipping: ₹50" :
                  "Cart is empty";

// 4.
// <span className={count > 0 ? "badge active" : "badge hidden"}>
//   {count > 0 ? count : ""}
// </span>

*/
