// ============================================================
//  04 — IMPORT / EXPORT
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// ES6 modules let you split code into separate files.
// `export` makes things available to other files.
// `import` brings them in.
// This is how EVERY React project is organized.

// NOTE: You can't run import/export in plain Node without
// "type": "module" in package.json or using .mjs extension.
// But in React (with Vite/CRA), it works out of the box.

// ─── NAMED EXPORTS & IMPORTS ────────────────────────────────

// ── file: utils.js ──
// You can export multiple things from one file.

export const PI = 3.14159;

export const add = (a, b) => a + b;

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// ── file: app.js ──
// Import specific items by name (must match exactly)

// import { PI, add, capitalize } from "./utils.js";
//
// console.log(PI);                   // 3.14159
// console.log(add(2, 3));            // 5
// console.log(capitalize("react"));  // "React"

// You can rename on import:
// import { add as sum } from "./utils.js";
// console.log(sum(2, 3)); // 5

// ─── DEFAULT EXPORT ─────────────────────────────────────────

// Each file can have ONE default export.
// The importer can name it whatever they want.

// ── file: logger.js ──

const Logger = {
  info: (msg) => console.log('[INFO]', msg),
  error: (msg) => console.error('[ERROR]', msg),
};
export default Logger;

// ── file: app.js ──
// import Logger from "./logger.js";       // works
// import MyLogger from "./logger.js";     // also works — same thing
// import Whatever from "./logger.js";     // still works!

// Logger.info("Server started");

// ─── NAMED vs DEFAULT — WHEN TO USE WHICH ───────────────────

// DEFAULT export: one main thing per file (a component, a class)
//   export default function Button() { ... }
//
// NAMED exports: utilities, constants, helper functions
//   export const API_URL = "...";
//   export const formatDate = (d) => { ... };

// You can have BOTH in one file:
//   export const helper = () => { ... };   // named
//   export default MainComponent;           // default

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Every component is in its own file with default export:
//
//    ── components/Button.jsx ──
//    const Button = ({ label, onClick }) => (
//      <button onClick={onClick}>{label}</button>
//    );
//    export default Button;
//
//    ── App.jsx ──
//    import Button from "./components/Button";

// B. Barrel files — re-export for clean imports:
//
//    ── components/index.js ──
//    export { default as Button } from "./Button";
//    export { default as Card } from "./Card";
//    export { default as Header } from "./Header";
//
//    ── App.jsx ──
//    import { Button, Card, Header } from "./components";
//    // Instead of three separate import lines!

// C. Importing React hooks and libraries:
//
//    import { useState, useEffect, useRef } from "react";
//    import axios from "axios";                    // default
//    import { motion } from "framer-motion";       // named

// D. Importing CSS, images, and assets:
//
//    import "./App.css";                           // side-effect import
//    import logo from "./assets/logo.png";         // default (file path)
//    import styles from "./App.module.css";        // CSS modules

// E. Custom hooks and utils:
//
//    import { useAuth } from "./hooks/useAuth";
//    import { formatDate, formatCurrency } from "./utils/formatters";

// F. Typical React project structure:
//
//    src/
//    ├── components/
//    │   ├── Button.jsx        → export default Button
//    │   ├── Card.jsx          → export default Card
//    │   └── index.js          → barrel file
//    ├── hooks/
//    │   └── useAuth.js        → export const useAuth = () => { ... }
//    ├── utils/
//    │   └── api.js            → export const fetchUser = () => { ... }
//    ├── pages/
//    │   └── Home.jsx          → export default Home
//    └── App.jsx               → imports everything

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Look at this messy single-file code.
//    Decide which file each piece should go to,
//    and whether it should be named or default export.
//
//    const API_URL = "https://api.example.com";
//    const fetchUsers = () => fetch(API_URL + "/users");
//    const UserCard = ({ user }) => <div>{user.name}</div>;
//    const UserList = () => { /* uses fetchUsers and UserCard */ };

// 2. Write the import statement for:
//    a. useState and useEffect from react
//    b. A default export called Navbar from "./components/Navbar"
//    c. Two named exports formatDate and formatCurrency from "./utils"

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
// ── config.js ──
export const API_URL = "https://api.example.com";           // named

// ── api/users.js ──
import { API_URL } from "../config";
export const fetchUsers = () => fetch(API_URL + "/users");   // named

// ── components/UserCard.jsx ──
const UserCard = ({ user }) => <div>{user.name}</div>;
export default UserCard;                                     // default

// ── pages/UserList.jsx ──
import { fetchUsers } from "../api/users";
import UserCard from "../components/UserCard";
const UserList = () => { ... };
export default UserList;                                     // default


// 2.
// a. import { useState, useEffect } from "react";
// b. import Navbar from "./components/Navbar";
// c. import { formatDate, formatCurrency } from "./utils";

*/
