/**
 * ============================================================
 *  The Object Class: Hierarchy & Important Methods
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  Object is the ROOT of everything in JavaScript.
 *  Every object (arrays, functions, dates, regexes, your classes)
 *  ultimately inherits from Object.prototype.
 *
 *  HIERARCHY:
 *
 *  null
 *    ↑
 *  Object.prototype  ← toString(), hasOwnProperty(), valueOf(), etc.
 *    ↑
 *  Function.prototype ← call(), apply(), bind()
 *    ↑          ↑
 *  Array.prototype  Date.prototype  RegExp.prototype  YourClass.prototype
 *    ↑
 *  [your array instance]
 *
 *  Everything converges at Object.prototype → null
 */

// ─── PROOF: Everything inherits from Object.prototype ───────────

console.log("=== Everything is an Object ===");
console.log([] instanceof Object);           // true
console.log(function(){} instanceof Object); // true
console.log(new Date() instanceof Object);   // true
console.log(/regex/ instanceof Object);      // true
console.log({} instanceof Object);           // true

// Only primitives are NOT objects (but get auto-boxed when you call methods)
// typeof 42 === "number", typeof "hi" === "string"

// ═══════════════════════════════════════════════════════════════
//  SECTION 1: Object STATIC Methods (called on Object itself)
// ═══════════════════════════════════════════════════════════════

// ─── Object.keys() / Object.values() / Object.entries() ────────
const user = { name: "Sandip", role: "Developer", city: "Bengaluru" };

console.log("\n=== keys / values / entries ===");
console.log(Object.keys(user));    // ['name', 'role', 'city']
console.log(Object.values(user));  // ['Sandip', 'Developer', 'Bengaluru']
console.log(Object.entries(user)); // [['name','Sandip'], ['role','Developer'], ...]

// Practical: transform an object
const uppercased = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, v.toUpperCase()])
);
console.log(uppercased); // { name: 'SANDIP', role: 'DEVELOPER', city: 'BENGALURU' }

// ─── Object.assign() — Shallow copy / merge ────────────────────
console.log("\n=== Object.assign() ===");

const defaults = { theme: "dark", lang: "en", notifications: true };
const userPrefs = { theme: "light", lang: "hi" };
const merged = Object.assign({}, defaults, userPrefs);
console.log(merged); // { theme: 'light', lang: 'hi', notifications: true }

// ⚠️ SHALLOW copy — nested objects are still references
const original = { config: { port: 3000 } };
const copy = Object.assign({}, original);
copy.config.port = 8080;
console.log(original.config.port); // 8080 — mutated! Use structuredClone() for deep copy.

// ─── Object.freeze() / Object.seal() / Object.preventExtensions() ──
console.log("\n=== freeze / seal / preventExtensions ===");

// freeze: No add, no delete, no modify
const frozenObj = Object.freeze({ x: 1, y: 2 });
frozenObj.x = 99;     // Silently fails (strict mode: TypeError)
frozenObj.z = 3;      // Silently fails
delete frozenObj.x;   // Silently fails
console.log(frozenObj); // { x: 1, y: 2 } — unchanged

// seal: No add, no delete, BUT can modify existing
const sealedObj = Object.seal({ x: 1, y: 2 });
sealedObj.x = 99;     // ✅ Allowed
sealedObj.z = 3;      // ❌ Fails
delete sealedObj.x;   // ❌ Fails
console.log(sealedObj); // { x: 99, y: 2 }

// preventExtensions: No add, but delete and modify OK
const extObj = Object.preventExtensions({ x: 1, y: 2 });
extObj.x = 99;         // ✅ Allowed
delete extObj.y;       // ✅ Allowed
extObj.z = 3;          // ❌ Fails
console.log(extObj);   // { x: 99 }

// Check states
console.log(Object.isFrozen(frozenObj));       // true
console.log(Object.isSealed(sealedObj));       // true
console.log(Object.isExtensible(extObj));      // false

// ─── Object.create() — Create with specific prototype ──────────
console.log("\n=== Object.create() ===");

const logger = {
  log(msg) { console.log(`[LOG] ${msg}`); },
  warn(msg) { console.log(`[WARN] ${msg}`); },
};

// fileLogger inherits log/warn from logger
const fileLogger = Object.create(logger);
fileLogger.logToFile = function(msg) {
  this.log(msg); // Uses inherited log()
  console.log(`  → Also writing to file...`);
};

fileLogger.logToFile("Server started"); 
// [LOG] Server started
//   → Also writing to file...

// ─── Object.getOwnPropertyDescriptors() ────────────────────────
console.log("\n=== Property Descriptors ===");

const product = {};
Object.defineProperty(product, "id", {
  value: "PROD-001",
  writable: false,     // Can't change the value
  enumerable: false,   // Won't show in Object.keys() or for...in
  configurable: false, // Can't delete or reconfigure
});
Object.defineProperty(product, "name", {
  value: "Widget",
  writable: true,
  enumerable: true,
  configurable: true,
});

console.log(product.id);            // "PROD-001"
console.log(Object.keys(product));  // ['name'] — id is NOT enumerable
product.id = "HACKED";              // Silently fails
console.log(product.id);            // "PROD-001" — still safe

console.log(Object.getOwnPropertyDescriptors(product));
// { id: { value: 'PROD-001', writable: false, ... }, name: { ... } }

// ─── Object.getPrototypeOf() / Object.setPrototypeOf() ─────────
console.log("\n=== Prototype manipulation ===");

class Base { baseMethod() { return "base"; } }
class Child extends Base { childMethod() { return "child"; } }

const instance = new Child();
console.log(Object.getPrototypeOf(instance) === Child.prototype); // true
console.log(Object.getPrototypeOf(Child.prototype) === Base.prototype); // true

// ⚠️ setPrototypeOf works but is SLOW — avoid in hot paths
// Object.setPrototypeOf(instance, someOtherProto);

// ─── Object.is() — Strict equality with edge cases fixed ───────
console.log("\n=== Object.is() ===");

console.log(Object.is(NaN, NaN));   // true  (unlike NaN === NaN → false)
console.log(Object.is(0, -0));      // false (unlike 0 === -0 → true)
console.log(Object.is(1, 1));       // true  (same as ===)
console.log(Object.is(null, null)); // true

// ─── structuredClone() — Deep copy (newer, not on Object but related) ──
console.log("\n=== structuredClone() (deep copy) ===");

const complex = {
  name: "Sandip",
  address: { city: "Bengaluru", pin: 560102 },
  hobbies: ["coding", "investing"],
  createdAt: new Date(),
};

const deepCopy = structuredClone(complex);
deepCopy.address.city = "Kolhapur";
deepCopy.hobbies.push("reading");

console.log(complex.address.city);  // "Bengaluru" — NOT affected!
console.log(complex.hobbies);       // ["coding", "investing"] — NOT affected!

// ═══════════════════════════════════════════════════════════════
//  SECTION 2: Object.prototype Instance Methods
// ═══════════════════════════════════════════════════════════════

// ─── toString() — Override for meaningful string representation ──
console.log("\n=== toString() ===");

class Invoice {
  #id;
  #amount;
  #status;

  constructor(id, amount, status) {
    this.#id = id;
    this.#amount = amount;
    this.#status = status;
  }

  // Override — gives meaningful representation
  toString() {
    return `Invoice(${this.#id}: ₹${this.#amount} [${this.#status}])`;
  }

  // Override — controls JSON.stringify behavior
  toJSON() {
    return { id: this.#id, amount: this.#amount, status: this.#status };
  }

  // Override — controls type coercion
  valueOf() {
    return this.#amount;
  }
}

const inv = new Invoice("INV-001", 15000, "PAID");
console.log(`${inv}`);                  // Invoice(INV-001: ₹15000 [PAID])
console.log(JSON.stringify(inv));       // {"id":"INV-001","amount":15000,"status":"PAID"}
console.log(inv + 5000);               // 20000 (valueOf returns the amount)

// ─── hasOwnProperty() vs `in` operator ──────────────────────────
console.log("\n=== hasOwnProperty() vs in ===");

const child2 = Object.create({ inherited: true });
child2.own = true;

console.log(child2.hasOwnProperty("own"));       // true
console.log(child2.hasOwnProperty("inherited")); // false — it's on the prototype
console.log("inherited" in child2);               // true — `in` walks the chain

// Safer modern alternative: Object.hasOwn() (ES2022)
console.log(Object.hasOwn(child2, "own"));       // true
console.log(Object.hasOwn(child2, "inherited")); // false

// ─── isPrototypeOf() ───────────────────────────────────────────
console.log("\n=== isPrototypeOf() ===");

class Vehicle {}
class Car extends Vehicle {}
class Tesla extends Car {}

const myTesla = new Tesla();

console.log(Vehicle.prototype.isPrototypeOf(myTesla)); // true
console.log(Car.prototype.isPrototypeOf(myTesla));     // true
console.log(Tesla.prototype.isPrototypeOf(myTesla));   // true

// Compared to instanceof (does the same traversal)
console.log(myTesla instanceof Vehicle); // true

// ─── propertyIsEnumerable() ─────────────────────────────────────
console.log("\n=== propertyIsEnumerable() ===");

const conf = { visible: 1 };
Object.defineProperty(conf, "hidden", { value: 2, enumerable: false });

console.log(conf.propertyIsEnumerable("visible")); // true
console.log(conf.propertyIsEnumerable("hidden"));  // false

// ═══════════════════════════════════════════════════════════════
//  SECTION 3: Useful Patterns with Object Methods
// ═══════════════════════════════════════════════════════════════

// ─── Pattern: Immutable Config Object ───────────────────────────
const appConfig = Object.freeze({
  API_URL: "https://api.sellcord.co",
  VERSION: "2.1.0",
  FEATURES: Object.freeze({
    BILLING: true,
    SURVEYS: true,
    AI_ASSIST: false,
  }),
});

// ─── Pattern: Object as Enum ────────────────────────────────────
const HttpStatus = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  // Reverse lookup
  getName(code) {
    return Object.entries(this).find(([, v]) => v === code)?.[0];
  },
});

console.log(HttpStatus.NOT_FOUND);       // 404
console.log(HttpStatus.getName(401));    // "UNAUTHORIZED"

// ─── Pattern: Safe property access with optional chaining ───────
const response = { data: { user: { address: { city: "Bengaluru" } } } };
console.log(response?.data?.user?.address?.city); // "Bengaluru"
console.log(response?.data?.user?.phone?.code);   // undefined (no error)

// ═══════════════════════════════════════════════════════════════
//  QUICK REFERENCE: Most Used Object Methods
// ═══════════════════════════════════════════════════════════════
/**
 *  STATIC METHODS (Object.xxx):
 *  ─────────────────────────────────────────────────────────────
 *  Object.keys(obj)              → ['key1', 'key2'] (own enumerable)
 *  Object.values(obj)            → [val1, val2]
 *  Object.entries(obj)           → [['key1',val1], ...]
 *  Object.fromEntries(arr)       → { key1: val1, ... }
 *  Object.assign(target, ...src) → merged target (shallow)
 *  Object.create(proto)          → new object with given prototype
 *  Object.freeze(obj)            → immutable (shallow)
 *  Object.seal(obj)              → no add/delete, can modify
 *  Object.defineProperty(obj, k) → fine-grained property control
 *  Object.getPrototypeOf(obj)    → the prototype object
 *  Object.getOwnPropertyNames()  → all own props (incl non-enumerable)
 *  Object.is(a, b)               → strict equality + NaN/±0 fix
 *  Object.hasOwn(obj, prop)      → own property check (ES2022)
 *  structuredClone(obj)          → deep copy (not on Object, but essential)
 *
 *  INSTANCE METHODS (obj.xxx):
 *  ─────────────────────────────────────────────────────────────
 *  obj.toString()                → string representation
 *  obj.valueOf()                 → primitive value for coercion
 *  obj.toJSON()                  → controls JSON.stringify output
 *  obj.hasOwnProperty(key)       → own property check (legacy)
 *  obj.isPrototypeOf(other)      → check if obj is in other's chain
 *  obj.propertyIsEnumerable(key) → enumerable own property check
 */
