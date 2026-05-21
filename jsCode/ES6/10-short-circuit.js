// ============================================================
//  10 — SHORT CIRCUIT (&&)
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// The && operator returns the first FALSY value it finds,
// or the LAST value if everything is truthy.
// In React, it's the standard way to say:
//   "if this condition is true, render this element"

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// First, remember what's FALSY in JavaScript:
//   false, 0, -0, "", null, undefined, NaN
// Everything else is TRUTHY.

// 1. How && actually evaluates (left to right)
console.log(true && 'hello'); // "hello"  — true is truthy, so return next
console.log(false && 'hello'); // false    — false is falsy, stop here
console.log('hi' && 'bye'); // "bye"    — both truthy, return last
console.log('' && 'hello'); // ""       — "" is falsy, stop
console.log(null && 'hello'); // null     — null is falsy, stop
console.log(1 && 2 && 3); // 3        — all truthy, return last
console.log(1 && 0 && 3); // 0        — 0 is falsy, stop

// 2. Practical use: conditional execution
const user = { name: 'Raj', isAdmin: true };

user.isAdmin && console.log('Show admin panel');
// Logs "Show admin panel" because isAdmin is true

user.isSuperAdmin && console.log('Show super panel');
// Nothing happens because isSuperAdmin is undefined (falsy)

// 3. vs ternary
// Use && when you only have the TRUE case (no else)
// Use ternary when you have both TRUE and FALSE cases

// && → if true, show this (otherwise nothing)
// ternary → if true show A, else show B

// ─── ⚠️ COMMON GOTCHA: THE "0" BUG ────────────────────────

// This is the #1 mistake freshers make with && in React!

const count = 0;

// What you expect: show nothing when count is 0
// What actually happens: React renders the number 0 on screen!
//
// BAD:  {count && <span>{count} items</span>}
//       → renders "0" because 0 is falsy, && returns 0,
//         and React renders numbers!
//
// GOOD: {count > 0 && <span>{count} items</span>}
//       → count > 0 is false (a boolean), React doesn't render false
//
// ALSO GOOD: {count ? <span>{count} items</span> : null}

// Same issue with empty string:
const name = '';
// BAD:  {name && <p>{name}</p>}  → renders "" (empty string)
// GOOD: {name.length > 0 && <p>{name}</p>}

// Rule: always make sure the left side of && is a BOOLEAN
//       when used in JSX, not a number or string.

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Show/hide elements based on a condition
//
//    const Navbar = ({ user, notifications }) => (
//      <nav>
//        <h1>MyApp</h1>
//
//        {/* Show only if logged in */}
//        {user && <span>Hi, {user.name}</span>}
//
//        {/* Show badge only if there are notifications */}
//        {notifications.length > 0 && (
//          <span className="badge">{notifications.length}</span>
//        )}
//      </nav>
//    );

// B. Show error messages
//
//    const Form = ({ error }) => (
//      <form>
//        <input ... />
//        {error && <p className="error">{error}</p>}
//      </form>
//    );

// C. Feature flags / role-based UI
//
//    const Dashboard = ({ user }) => (
//      <div>
//        <h1>Dashboard</h1>
//
//        {user.isAdmin && (
//          <section>
//            <h2>Admin Controls</h2>
//            <button>Manage Users</button>
//          </section>
//        )}
//
//        {user.isPremium && <PremiumBanner />}
//      </div>
//    );

// D. Combining multiple conditions
//
//    const ProductCard = ({ product }) => (
//      <div className="card">
//        <h3>{product.name}</h3>
//        <p>₹{product.price}</p>
//
//        {product.onSale && (
//          <span className="sale-badge">SALE!</span>
//        )}
//
//        {product.reviews?.length > 0 && (
//          <div className="rating">
//            ⭐ {product.rating} ({product.reviews.length} reviews)
//          </div>
//        )}
//
//        {/* Multiple conditions with && */}
//        {product.stock < 5 && product.stock > 0 && (
//          <p className="warning">Only {product.stock} left!</p>
//        )}
//      </div>
//    );

// ─── && vs TERNARY — WHEN TO USE WHICH ─────────────────────

// && → when you only show something or nothing
//    {isLoggedIn && <LogoutButton />}

// Ternary → when you show one thing OR another
//    {isLoggedIn ? <LogoutButton /> : <LoginButton />}

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. What does each return?
console.log('React' && 'Vue');
console.log('' && 'Vue');
console.log(5 && 0 && 'hello');
console.log(null && undefined);

// 2. Write JSX: show <img src={user.avatar} /> ONLY if user.avatar exists
//    (user.avatar could be undefined)

// 3. Write JSX: show a <p>No items found</p> ONLY if items.length === 0

// 4. Is this safe? If not, fix it:
//    {items.length && <ItemList items={items} />}

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
// "Vue"       — both truthy, return last
// ""          — "" is falsy, stop
// 0           — 5 truthy, 0 is falsy, stop
// null        — null is falsy, stop

// 2.
// {user.avatar && <img src={user.avatar} />}

// 3.
// {items.length === 0 && <p>No items found</p>}

// 4.
// ⚠️ NOT safe! If items.length is 0, React will render "0" on screen.
// Fix:
// {items.length > 0 && <ItemList items={items} />}

*/
