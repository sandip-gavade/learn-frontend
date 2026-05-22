/**
 * ============================================================
 *  PROTOTYPE in JavaScript — The Foundation of Everything
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  Every JavaScript object has a hidden internal link called
 *  [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf()).
 *
 *  When you access a property on an object and it doesn't exist
 *  on the object itself, JS walks UP the prototype chain looking
 *  for it. This is called PROTOTYPE CHAIN LOOKUP.
 *
 *  Think of it like: "I don't know the answer, let me ask my parent."
 *
 *  KEY DISTINCTION:
 *  ───────────────
 *  • `__proto__`      → The actual link TO the prototype (exists on every object)
 *  • `.prototype`     → A property on FUNCTIONS used to set __proto__ of instances
 *
 *  These are DIFFERENT things. This confuses everyone initially.
 */

// ─── 1. EVERY OBJECT HAS A PROTOTYPE ───────────────────────────

const obj = { name: "Sandip" };

// obj's prototype is Object.prototype
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

// That's why you can call .toString(), .hasOwnProperty() etc.
// on ANY object — they live on Object.prototype
console.log(obj.toString());           // [object Object]
console.log(obj.hasOwnProperty("name")); // true

// The chain: obj → Object.prototype → null
console.log(Object.getPrototypeOf(Object.prototype)); // null (end of chain)

// ─── 2. HOW PROPERTY LOOKUP WORKS ──────────────────────────────

const parent = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  species: "Human",
};

const child = Object.create(parent); // child's __proto__ = parent
child.name = "Rahul";

// Step-by-step lookup for child.greet():
// 1. Does `child` own `greet`?       → No
// 2. Does `parent` (child's proto) own `greet`?  → YES → call it
console.log(child.greet()); // "Hello, I'm Rahul"

// Step-by-step lookup for child.species:
// 1. Does `child` own `species`?     → No
// 2. Does `parent` own `species`?    → YES → return "Human"
console.log(child.species); // "Human"

// Step-by-step lookup for child.name:
// 1. Does `child` own `name`?        → YES → return "Rahul" (no chain walk needed)
console.log(child.name); // "Rahul"

// WRITING always goes on the object itself, never up the chain
child.species = "Developer"; // Creates OWN property, doesn't modify parent
console.log(child.species);  // "Developer" (own)
console.log(parent.species); // "Human" (unchanged)

// ─── 3. FUNCTION.prototype vs __proto__ ─────────────────────────
/**
 *  This is THE most confusing part of JS prototypes.
 *
 *  When you write: function Foo() {}
 *
 *  JS creates:
 *  - The function Foo itself
 *  - An object Foo.prototype (used as the __proto__ of instances)
 *
 *  When you call: new Foo()
 *  - A new empty object is created
 *  - Its __proto__ is set to Foo.prototype
 *  - Foo() runs with `this` pointing to the new object
 *  - The new object is returned
 */

function Dog(name, breed) {
  this.name = name;
  this.breed = breed;
}

// Methods go on Dog.prototype — shared by ALL instances
Dog.prototype.bark = function () {
  return `${this.name} says: Woof!`;
};

Dog.prototype.describe = function () {
  return `${this.name} is a ${this.breed}`;
};

const dog1 = new Dog("Bruno", "Labrador");
const dog2 = new Dog("Rocky", "German Shepherd");

console.log(dog1.bark());    // "Bruno says: Woof!"
console.log(dog2.bark());    // "Rocky says: Woof!"

// BOTH instances share the SAME function object
console.log(dog1.bark === dog2.bark); // true — memory efficient!

// Visualize the relationships:
console.log(dog1.__proto__ === Dog.prototype);          // true
console.log(Dog.prototype.constructor === Dog);         // true
console.log(dog1.__proto__.__proto__ === Object.prototype); // true

// ─── 4. THE COMPLETE PROTOTYPE CHAIN ────────────────────────────

function printPrototypeChain(obj, label) {
  console.log(`\n--- Prototype chain of ${label} ---`);
  let current = obj;
  let depth = 0;
  while (current !== null) {
    const ownProps = Object.getOwnPropertyNames(current);
    const tag = depth === 0 ? "(instance)" : current.constructor?.name || "null";
    console.log(`  ${"  ".repeat(depth)}↓ ${tag}: [${ownProps.slice(0, 5).join(", ")}${ownProps.length > 5 ? "..." : ""}]`);
    current = Object.getPrototypeOf(current);
    depth++;
  }
  console.log(`  ${"  ".repeat(depth)}↓ null (end)`);
}

printPrototypeChain(dog1, "dog1");
// ↓ (instance): [name, breed]
// ↓   Dog: [constructor, bark, describe]
// ↓     Object: [constructor, __defineGetter__, ...]
// ↓       null (end)

// ─── 5. PROTOTYPE WITH class SYNTAX ─────────────────────────────
/**
 *  `class` is SYNTACTIC SUGAR. Under the hood, it's doing
 *  exactly what we did above with constructor functions.
 */

class Cat {
  constructor(name) {
    this.name = name;
  }
  meow() {
    return `${this.name}: Meow!`;
  }
}

const cat = new Cat("Whiskers");

// Proof that class is just sugar:
console.log(typeof Cat);                        // "function"
console.log(cat.__proto__ === Cat.prototype);    // true
console.log(Cat.prototype.constructor === Cat);  // true
console.log(cat.__proto__.__proto__ === Object.prototype); // true

// Methods defined in the class body go on Cat.prototype
console.log(Cat.prototype.hasOwnProperty("meow")); // true
console.log(cat.hasOwnProperty("meow"));            // false (it's on the prototype)
console.log(cat.hasOwnProperty("name"));            // true  (set in constructor)

// ─── 6. PROTOTYPE POLLUTION DANGER ──────────────────────────────
/**
 *  Since prototype is shared, modifying it affects ALL instances.
 *  This can be useful (polyfills) or dangerous (prototype pollution).
 */

// Adding a method to Array.prototype — ALL arrays get it
Array.prototype.last = function () {
  return this[this.length - 1];
};

console.log([1, 2, 3].last());        // 3
console.log(["a", "b", "c"].last());  // "c"

// ⚠️  NEVER modify Object.prototype in production code
// Object.prototype.hack = "gotcha"; // This would appear on EVERY object

// Cleanup
delete Array.prototype.last;

// ─── 7. PROPERTY SHADOWING ──────────────────────────────────────

const base = {
  value: 10,
  getValue() {
    return this.value;
  },
};

const derived = Object.create(base);
// derived doesn't own `value`, so it reads from base
console.log(derived.getValue()); // 10

// Now set it directly on derived — "shadows" the base property
derived.value = 99;
console.log(derived.getValue()); // 99 (own property)
console.log(base.getValue());    // 10 (unchanged)

// Delete the shadow — falls back to prototype
delete derived.value;
console.log(derived.getValue()); // 10 (back to base)

// ─── 8. PERFORMANCE: OWN vs PROTOTYPE ───────────────────────────

class Inefficient {
  constructor(name) {
    this.name = name;
    // ❌ Each instance gets its OWN copy of this function
    this.greet = function () {
      return `Hi, ${this.name}`;
    };
  }
}

class Efficient {
  constructor(name) {
    this.name = name;
  }
  // ✅ One shared function on the prototype
  greet() {
    return `Hi, ${this.name}`;
  }
}

const a = new Inefficient("A");
const b = new Inefficient("B");
console.log(a.greet === b.greet); // false — two separate function objects! 💸

const c = new Efficient("C");
const d = new Efficient("D");
console.log(c.greet === d.greet); // true — one shared function! ✅

// ─── KEY TAKEAWAYS ──────────────────────────────────────────────
/**
 *  1. __proto__ = the link TO the prototype (every object has one)
 *     .prototype = property on FUNCTIONS, used to set __proto__ of new instances
 *
 *  2. Property lookup walks the chain: obj → obj.__proto__ → ... → null
 *
 *  3. Writing ALWAYS creates an own property (shadowing, not modifying the proto)
 *
 *  4. `class` is sugar over prototype-based inheritance. Under the hood
 *     methods go on ClassName.prototype, constructor sets own properties.
 *
 *  5. Shared prototype methods = memory efficient (one copy for all instances)
 *     Own method per instance = wasteful (N copies for N instances)
 *
 *  6. The chain: instance → Class.prototype → Parent.prototype → Object.prototype → null
 */
