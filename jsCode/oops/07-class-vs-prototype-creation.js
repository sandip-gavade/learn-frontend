/**
 * ============================================================
 *  Object Creation: class vs Prototype — Side by Side
 * ============================================================
 *
 *  CORE INSIGHT:
 *  `class` syntax and prototype-based patterns produce the
 *  SAME prototype chain under the hood. The difference is
 *  ergonomics and readability, not behavior.
 *
 *  This file shows the SAME object created both ways, then
 *  proves they produce identical structures.
 */

// ═══════════════════════════════════════════════════════════════
//  EXAMPLE 1: Simple Object
// ═══════════════════════════════════════════════════════════════

// --- PROTOTYPE WAY (ES5) ---
function PersonProto(name, age) {
  this.name = name;
  this.age = age;
}

PersonProto.prototype.greet = function () {
  return `Hi, I'm ${this.name}, age ${this.age}`;
};

PersonProto.prototype.isAdult = function () {
  return this.age >= 18;
};

const p1 = new PersonProto("Sandip", 30);

// --- CLASS WAY (ES6+) ---
class PersonClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hi, I'm ${this.name}, age ${this.age}`;
  }

  isAdult() {
    return this.age >= 18;
  }
}

const p2 = new PersonClass("Sandip", 30);

// --- PROOF: They're structurally identical ---
console.log("=== Simple Object Comparison ===");
console.log("Proto greet:", p1.greet());                       // Hi, I'm Sandip, age 30
console.log("Class greet:", p2.greet());                       // Hi, I'm Sandip, age 30
console.log("Same own props:", Object.keys(p1).join() === Object.keys(p2).join()); // true
console.log("Proto has greet on prototype:", !p1.hasOwnProperty("greet"));  // true
console.log("Class has greet on prototype:", !p2.hasOwnProperty("greet"));  // true

// ═══════════════════════════════════════════════════════════════
//  EXAMPLE 2: Inheritance
// ═══════════════════════════════════════════════════════════════

// --- PROTOTYPE WAY ---
function EmployeeProto(name, age, company) {
  PersonProto.call(this, name, age); // Super constructor call
  this.company = company;
}

// Wire up inheritance chain
EmployeeProto.prototype = Object.create(PersonProto.prototype);
EmployeeProto.prototype.constructor = EmployeeProto;

EmployeeProto.prototype.describe = function () {
  return `${this.greet()} — works at ${this.company}`;
};

const e1 = new EmployeeProto("Rahul", 25, "SellCord");

// --- CLASS WAY ---
class EmployeeClass extends PersonClass {
  constructor(name, age, company) {
    super(name, age); // Same as PersonProto.call(this, ...)
    this.company = company;
  }

  describe() {
    return `${this.greet()} — works at ${this.company}`;
  }
}

const e2 = new EmployeeClass("Rahul", 25, "SellCord");

// --- PROOF ---
console.log("\n=== Inheritance Comparison ===");
console.log("Proto:", e1.describe());  // Hi, I'm Rahul, age 25 — works at SellCord
console.log("Class:", e2.describe());  // Hi, I'm Rahul, age 25 — works at SellCord

console.log("Proto instanceof PersonProto:", e1 instanceof PersonProto);     // true
console.log("Class instanceof PersonClass:", e2 instanceof PersonClass);     // true

console.log("Proto chain depth same:", 
  countProtoDepth(e1) === countProtoDepth(e2)); // true

function countProtoDepth(obj) {
  let depth = 0;
  let current = obj;
  while (Object.getPrototypeOf(current) !== null) {
    depth++;
    current = Object.getPrototypeOf(current);
  }
  return depth;
}

// ═══════════════════════════════════════════════════════════════
//  EXAMPLE 3: Static Methods & Getters
// ═══════════════════════════════════════════════════════════════

// --- PROTOTYPE WAY ---
function ProductProto(name, price) {
  this.name = name;
  this.price = price;
}

// Static method — goes on the constructor, not on .prototype
ProductProto.fromJSON = function (json) {
  const { name, price } = JSON.parse(json);
  return new ProductProto(name, price);
};

// Getter — use Object.defineProperty
Object.defineProperty(ProductProto.prototype, "displayPrice", {
  get() {
    return `₹${this.price.toLocaleString("en-IN")}`;
  },
});

ProductProto.prototype.applyDiscount = function (pct) {
  return new ProductProto(this.name, this.price * (1 - pct / 100));
};

// --- CLASS WAY ---
class ProductClass {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  static fromJSON(json) {
    const { name, price } = JSON.parse(json);
    return new ProductClass(name, price);
  }

  get displayPrice() {
    return `₹${this.price.toLocaleString("en-IN")}`;
  }

  applyDiscount(pct) {
    return new ProductClass(this.name, this.price * (1 - pct / 100));
  }
}

// --- PROOF ---
console.log("\n=== Static & Getter Comparison ===");
const prod1 = ProductProto.fromJSON('{"name":"Widget","price":4999}');
const prod2 = ProductClass.fromJSON('{"name":"Widget","price":4999}');

console.log("Proto displayPrice:", prod1.displayPrice); // ₹4,999
console.log("Class displayPrice:", prod2.displayPrice); // ₹4,999

const discounted1 = prod1.applyDiscount(10);
const discounted2 = prod2.applyDiscount(10);
console.log("Proto discounted:", discounted1.displayPrice); // ₹4,499.1
console.log("Class discounted:", discounted2.displayPrice); // ₹4,499.1

// ═══════════════════════════════════════════════════════════════
//  EXAMPLE 4: Object.create() — Pure Prototypal (no constructor)
// ═══════════════════════════════════════════════════════════════

/**
 *  This is a THIRD way — no constructor function, no class.
 *  Just objects inheriting from objects.
 *  Closest to how JS originally envisioned things.
 */

const vehicleProto = {
  init(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    return this; // for chaining
  },
  describe() {
    return `${this.year} ${this.make} ${this.model}`;
  },
};

const carProto = Object.create(vehicleProto);
carProto.drive = function () {
  return `Driving ${this.describe()} 🚗`;
};

// Create instance
const myCar = Object.create(carProto).init("Maruti", "Swift", 2023);

console.log("\n=== Pure Prototypal ===");
console.log(myCar.describe()); // 2023 Maruti Swift
console.log(myCar.drive());   // Driving 2023 Maruti Swift 🚗

// Chain: myCar → carProto → vehicleProto → Object.prototype → null
console.log(Object.getPrototypeOf(myCar) === carProto);           // true
console.log(Object.getPrototypeOf(carProto) === vehicleProto);    // true

// ═══════════════════════════════════════════════════════════════
//  WHEN TO USE WHICH?
// ═══════════════════════════════════════════════════════════════

/**
 *  | Approach             | Use When                                           |
 *  |----------------------|---------------------------------------------------|
 *  | class syntax         | Default choice. Clean, readable, familiar to       |
 *  |                      | Java/Spring devs. Use for application code.        |
 *  |                      |                                                   |
 *  | Constructor + proto  | Maintaining legacy code. Understanding internals.  |
 *  |                      | Library code that needs fine-grained control.      |
 *  |                      |                                                   |
 *  | Object.create()      | When you want simple object delegation without    |
 *  |                      | constructor ceremony. Config objects, prototypal   |
 *  |                      | delegation patterns.                              |
 *  |                      |                                                   |
 *  | Factory functions    | When you need true encapsulation via closures,    |
 *  |                      | or want to avoid `new` and `this` entirely.       |
 *
 *  KEY INSIGHT:
 *  All roads lead to the same prototype chain. Choose based on
 *  readability and what your team/codebase already uses.
 *  For new projects: `class` syntax. It's what the ecosystem expects.
 */
