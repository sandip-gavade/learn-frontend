/**
 * ============================================================
 *  INHERITANCE in JavaScript
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  A mechanism where a child class/object acquires the properties
 *  and methods of a parent class/object, promoting code reuse.
 *
 *  JS inheritance is PROTOTYPE-BASED under the hood — even when
 *  you write `class extends`. The `class` syntax is sugar over
 *  the prototype chain.
 *
 *  TYPES COVERED:
 *  1. Classical (class extends) — Modern, recommended
 *  2. Prototypal (Object.create) — How JS actually works
 *  3. Constructor function + prototype — ES5 era
 *  4. Mixin pattern — Composition-style, very practical
 */

// ─── 1. CLASSICAL INHERITANCE (class extends) ───────────────────

class Employee {
  constructor(name, department, salary) {
    this.name = name;
    this.department = department;
    this.salary = salary;
  }

  getDetails() {
    return `${this.name} | ${this.department} | ₹${this.salary}`;
  }

  getAnnualCTC() {
    return this.salary * 12;
  }
}

class Manager extends Employee {
  #reports;

  constructor(name, department, salary, reports = []) {
    // super() MUST be called before using `this`
    super(name, department, salary);
    this.#reports = reports;
  }

  addReport(employeeName) {
    this.#reports.push(employeeName);
  }

  // Override parent method
  getDetails() {
    return `${super.getDetails()} | Reports: ${this.#reports.length}`;
  }

  // Additional method
  getTeam() {
    return [...this.#reports];
  }
}

class Director extends Manager {
  #budget;

  constructor(name, department, salary, reports, budget) {
    super(name, department, salary, reports);
    this.#budget = budget;
  }

  getDetails() {
    return `${super.getDetails()} | Budget: ₹${this.#budget}`;
  }

  // Override with bonus calculation
  getAnnualCTC() {
    return super.getAnnualCTC() + this.#budget * 0.01; // 1% bonus on budget
  }
}

// --- Usage ---
const emp = new Employee("Rahul", "Engineering", 80000);
const mgr = new Manager("Priya", "Engineering", 150000, ["Rahul", "Amit"]);
const dir = new Director("Suresh", "Engineering", 300000, ["Priya"], 50000000);

console.log(emp.getDetails()); // Rahul | Engineering | ₹80000
console.log(mgr.getDetails()); // Priya | Engineering | ₹150000 | Reports: 2
console.log(dir.getDetails()); // Suresh | Engineering | ₹300000 | Reports: 1 | Budget: ₹50000000

// instanceof traverses the whole chain
console.log(dir instanceof Director); // true
console.log(dir instanceof Manager);  // true
console.log(dir instanceof Employee); // true

// ─── 2. PROTOTYPAL INHERITANCE (Object.create) ─────────────────
/**
 *  This is the raw mechanism. No classes, no constructors.
 *  One object directly inherits from another object.
 */

const vehicleProto = {
  start() {
    console.log(`${this.make} ${this.model} — Engine started`);
  },
  describe() {
    return `${this.year} ${this.make} ${this.model}`;
  },
};

// Create a car that inherits from vehicleProto
const myCar = Object.create(vehicleProto);
myCar.make = "Maruti";
myCar.model = "Swift";
myCar.year = 2023;

myCar.start();    // Maruti Swift — Engine started
console.log(myCar.describe()); // 2023 Maruti Swift

// myCar doesn't OWN start() — it finds it up the prototype chain
console.log(myCar.hasOwnProperty("start"));    // false
console.log(myCar.hasOwnProperty("make"));     // true

// Create an electric car inheriting from vehicleProto + extra
const electricCarProto = Object.create(vehicleProto);
electricCarProto.charge = function () {
  console.log(`${this.make} ${this.model} — Charging at ${this.batteryKW}kW`);
};

const myEV = Object.create(electricCarProto);
myEV.make = "Tata";
myEV.model = "Nexon EV";
myEV.year = 2024;
myEV.batteryKW = 40;

myEV.start();   // Tata Nexon EV — Engine started (inherited from vehicleProto)
myEV.charge();  // Tata Nexon EV — Charging at 40kW

// ─── 3. CONSTRUCTOR FUNCTION + PROTOTYPE (ES5 pattern) ──────────
/**
 *  Before `class`, this was THE way to do inheritance.
 *  You'll see this in legacy codebases, jQuery plugins, etc.
 */

function Shape(color) {
  this.color = color;
}

Shape.prototype.describe = function () {
  return `A ${this.color} shape`;
};

function Circle(color, radius) {
  Shape.call(this, color); // Super call — borrow Shape's constructor
  this.radius = radius;
}

// Set up the prototype chain: Circle → Shape
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle; // Fix the constructor reference

Circle.prototype.area = function () {
  return Math.PI * this.radius ** 2;
};

// Override parent method
Circle.prototype.describe = function () {
  return `A ${this.color} circle with radius ${this.radius}`;
};

const c = new Circle("red", 5);
console.log(c.describe());   // A red circle with radius 5
console.log(c.area());       // 78.539...
console.log(c instanceof Circle); // true
console.log(c instanceof Shape);  // true

// ─── 4. MIXIN PATTERN (Composition over Inheritance) ────────────
/**
 *  JS only supports SINGLE inheritance with `extends`.
 *  Mixins let you compose behaviors from multiple sources.
 *  This is often preferred over deep inheritance hierarchies.
 */

const Serializable = (Base) =>
  class extends Base {
    toJSON() {
      return JSON.stringify(this);
    }
    static fromJSON(json) {
      return Object.assign(new this(), JSON.parse(json));
    }
  };

const Loggable = (Base) =>
  class extends Base {
    log(message) {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };

const Timestamped = (Base) =>
  class extends Base {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date().toISOString();
      this.updatedAt = this.createdAt;
    }
    touch() {
      this.updatedAt = new Date().toISOString();
    }
  };

// Compose: Order gets Serializable + Loggable + Timestamped behavior
class Order extends Timestamped(Loggable(Serializable(Object))) {
  constructor(orderId, items) {
    super();
    this.orderId = orderId;
    this.items = items;
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

const order = new Order("ORD-001", [
  { name: "Widget", price: 299, qty: 2 },
  { name: "Gadget", price: 999, qty: 1 },
]);

order.log(`Total: ₹${order.total}`);   // [Order] Total: ₹1597
console.log(order.createdAt);            // ISO timestamp
console.log(order.toJSON());             // Full JSON string

// ─── PROTOTYPE CHAIN VISUALIZATION ──────────────────────────────

console.log("\n--- Prototype chain of `dir` (Director) ---");
let obj = dir;
while (obj) {
  console.log(obj.constructor?.name || "Object.prototype (null next)");
  obj = Object.getPrototypeOf(obj);
}
// Output:
//   Director
//   Manager
//   Employee
//   Object (Object.prototype)
//   undefined (null — end of chain)

// ─── KEY TAKEAWAYS ──────────────────────────────────────────────
/**
 *  1. `class extends` is syntactic sugar — underneath it's still prototypes.
 *  2. super() is mandatory in child constructors before using `this`.
 *  3. JS only has single inheritance — use Mixins for multi-behavior.
 *  4. Favor composition (mixins) over deep hierarchies (> 2-3 levels).
 *  5. `instanceof` traverses the entire prototype chain.
 *  6. The prototype chain ends at Object.prototype → null.
 */
