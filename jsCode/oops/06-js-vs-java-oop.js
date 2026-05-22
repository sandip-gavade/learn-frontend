/**
 * ============================================================
 *  JavaScript OOP vs Java OOP — Key Differences
 * ============================================================
 *
 *  You know Java inside out. Here's how JS differs, concept by concept,
 *  with code examples on the JS side and Java pseudocode for comparison.
 */

// ─── 1. CLASS-BASED vs PROTOTYPE-BASED ──────────────────────────
/**
 *  JAVA: Classes are blueprints. Objects are instances of classes.
 *        Classes exist as first-class entities in the type system.
 *
 *  JS:   "Classes" are just functions. Objects inherit from other OBJECTS
 *        via the prototype chain. `class` keyword is syntactic sugar.
 *
 *  // Java
 *  public class Animal {
 *      String name;
 *      Animal(String name) { this.name = name; }
 *  }
 *  Animal a = new Animal("Dog");
 */

// JS — the class keyword hides that this is just prototype wiring
class Animal {
  constructor(name) {
    this.name = name;
  }
}
const a = new Animal("Dog");
console.log(typeof Animal); // "function" — not a "class" type!

// You can even add methods after class definition (impossible in Java)
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};
console.log(a.speak()); // "Dog makes a sound" — works retroactively!

// ─── 2. STATIC TYPING vs DYNAMIC TYPING ────────────────────────
/**
 *  JAVA: Compile-time type checking. `Animal a = new Dog()` checked at compile time.
 *        Interfaces enforce contracts.
 *
 *  JS:   No compile-time types. Any variable can hold any type.
 *        Duck typing replaces interfaces.
 *
 *  // Java
 *  interface Flyable {
 *      void fly();
 *  }
 *  class Bird implements Flyable {
 *      public void fly() { ... }
 *  }
 *  // Compile error if fly() is missing
 */

// JS — no interface keyword, duck typing instead
class Bird {
  fly() {
    console.log("Flapping wings");
  }
}

class Airplane {
  fly() {
    console.log("Jet engines roaring");
  }
}

// This function works with ANYTHING that has a fly() method
function takeOff(flyable) {
  flyable.fly(); // No compile check — fails at RUNTIME if missing
}

takeOff(new Bird());     // Works
takeOff(new Airplane()); // Works
takeOff({ fly: () => console.log("Magic carpet") }); // Also works!
// takeOff({ swim: () => {} }); // Runtime error: flyable.fly is not a function

// ─── 3. ACCESS MODIFIERS ────────────────────────────────────────
/**
 *  JAVA: public, private, protected, package-private (default)
 *
 *  JS:   public (default), #private (ES2022).
 *        No protected. No package-private.
 *
 *  // Java
 *  public class Account {
 *      private double balance;
 *      protected String owner;
 *      public String accountType;
 *      double interestRate; // package-private
 *  }
 */

class Account {
  #balance;          // Private — only accessible inside this class
  // No protected — subclasses can't access #balance either!
  accountType;       // Public (default)

  constructor(balance) {
    this.#balance = balance;
    this.accountType = "Savings";
  }

  getBalance() {
    return this.#balance;
  }
}

class PremiumAccount extends Account {
  showBalance() {
    // return this.#balance; // ❌ SyntaxError! Even subclasses can't access
    return this.getBalance(); // Must use public method
  }
}

// ─── 4. METHOD OVERLOADING ──────────────────────────────────────
/**
 *  JAVA: Full support — same name, different parameter types/counts.
 *        Resolved at compile time.
 *
 *  // Java
 *  class MathUtils {
 *      int add(int a, int b) { return a + b; }
 *      double add(double a, double b) { return a + b; }
 *      int add(int a, int b, int c) { return a + b + c; }
 *  }
 *
 *  JS:   NO overloading. Last definition wins.
 *        Simulate with rest params, typeof checks, or argument count.
 */

class MathUtils {
  // This is the ONLY add() — must handle all cases
  static add(...args) {
    if (args.length === 1 && Array.isArray(args[0])) {
      return args[0].reduce((s, n) => s + n, 0);
    }
    return args.reduce((s, n) => s + n, 0);
  }
}

console.log(MathUtils.add(1, 2));       // 3
console.log(MathUtils.add(1, 2, 3));    // 6
console.log(MathUtils.add([1, 2, 3]));  // 6

// ─── 5. ABSTRACT CLASSES & INTERFACES ───────────────────────────
/**
 *  JAVA: abstract class, interface — compiler-enforced contracts.
 *
 *  // Java
 *  abstract class Shape {
 *      abstract double area();
 *      String describe() { return "I'm a shape"; } // concrete method OK
 *  }
 *
 *  interface Drawable {
 *      void draw();
 *      default void erase() { ... } // default methods since Java 8
 *  }
 *
 *  JS:   No abstract or interface keyword.
 *        Simulate with runtime errors.
 */

class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("Shape is abstract — instantiate a subclass");
    }
  }
  // "Abstract" method
  area() {
    throw new Error("Subclass must implement area()");
  }
  // Concrete method
  describe() {
    return `Shape with area ${this.area()}`;
  }
}

class Rect extends Shape {
  constructor(w, h) {
    super();
    this.w = w;
    this.h = h;
  }
  area() {
    return this.w * this.h;
  }
}

console.log(new Rect(5, 3).describe()); // "Shape with area 15"
// new Shape(); // Error: Shape is abstract

// ─── 6. MULTIPLE INHERITANCE ────────────────────────────────────
/**
 *  JAVA: Single class inheritance + multiple interface implementation.
 *
 *  // Java
 *  class Dog extends Animal implements Runnable, Serializable { ... }
 *
 *  JS:   Single prototype inheritance.
 *        Mixins simulate multiple inheritance.
 */

const Runnable = (Base) =>
  class extends Base {
    run() {
      console.log(`${this.name} is running`);
    }
  };

const Swimmable = (Base) =>
  class extends Base {
    swim() {
      console.log(`${this.name} is swimming`);
    }
  };

class Dog extends Swimmable(Runnable(Animal)) {}

const dog = new Dog("Bruno");
dog.run();   // Bruno is running
dog.swim();  // Bruno is swimming
dog.speak(); // Bruno makes a sound (from Animal prototype, added earlier)

// ─── 7. this KEYWORD ───────────────────────────────────────────
/**
 *  JAVA: `this` always refers to the current instance. Period.
 *
 *  JS:   `this` depends on HOW the function is called. Biggest
 *        source of bugs when coming from Java.
 */

class Timer {
  constructor(label) {
    this.label = label;
    this.seconds = 0;
  }

  start() {
    // ❌ Regular function — `this` will be undefined/global
    // setInterval(function() { this.seconds++; }, 1000);

    // ✅ Arrow function — captures `this` from enclosing scope
    setInterval(() => {
      this.seconds++;
      // console.log(`${this.label}: ${this.seconds}s`);
    }, 1000);
  }
}

// ─── 8. FINAL & CONST ──────────────────────────────────────────
/**
 *  JAVA: `final` prevents extension and reassignment.
 *        final class Immutable { }  // Can't extend
 *        final int X = 10;          // Can't reassign
 *
 *  JS:   `const` prevents reassignment but NOT mutation.
 *        No native way to prevent class extension.
 *        Object.freeze() for shallow immutability.
 */

const config = { host: "localhost", port: 3000 };
// config = {};     // ❌ TypeError: Assignment to constant
config.port = 8080; // ✅ Mutation allowed — const only prevents reassignment

// Freeze for shallow immutability
const frozen = Object.freeze({ host: "localhost", port: 3000 });
frozen.port = 8080; // Silently fails (or TypeError in strict mode)
console.log(frozen.port); // 3000 — unchanged

// Prevent class extension
class FinalClass {
  constructor() {
    if (new.target !== FinalClass) {
      throw new Error("FinalClass cannot be extended");
    }
  }
}

// ─── 9. ENUMS ──────────────────────────────────────────────────
/**
 *  JAVA: First-class enum type with methods, fields, constructors.
 *
 *  // Java
 *  enum Status { ACTIVE, INACTIVE, PENDING }
 *
 *  JS:   No enum keyword. Simulate with frozen objects or Symbols.
 */

// Simple approach
const Status = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
});

// Symbol approach (guaranteed uniqueness)
const Color = Object.freeze({
  RED: Symbol("RED"),
  GREEN: Symbol("GREEN"),
  BLUE: Symbol("BLUE"),
});

// ─── COMPARISON TABLE ───────────────────────────────────────────
/**
 *  | Feature              | Java                        | JavaScript                          |
 *  |----------------------|-----------------------------|-------------------------------------|
 *  | Inheritance model    | Class-based                 | Prototype-based (class is sugar)    |
 *  | Type system          | Static + strong              | Dynamic + weak                      |
 *  | Interfaces           | `interface` keyword          | Duck typing                         |
 *  | Abstract classes     | `abstract` keyword           | Runtime error simulation            |
 *  | Access modifiers     | public/private/protected     | public + #private only              |
 *  | Method overloading   | ✅ Compile-time              | ❌ Not supported natively           |
 *  | Multiple inheritance | Interfaces only              | Mixins                              |
 *  | `this` binding       | Always the instance          | Depends on call site                |
 *  | final/sealed class   | `final` keyword              | No native support                   |
 *  | Enums                | First-class type             | Frozen objects / Symbols            |
 *  | Generics             | ✅ Full support              | ❌ Not in language (use TS)         |
 *  | Reflection           | java.lang.reflect            | Object methods + typeof/instanceof  |
 *  | Memory               | Objects on heap, GC          | Same — V8 GC, but no manual tuning  |
 *  | Compilation          | Compiled to bytecode         | JIT compiled at runtime             |
 */
