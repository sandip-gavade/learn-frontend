/**
 * ============================================================
 *  ENCAPSULATION in JavaScript
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  Encapsulation means bundling data (properties) and the methods
 *  that operate on that data into a single unit (object/class),
 *  AND restricting direct access to some of that data.
 *
 *  Think of it as a capsule — the internals are hidden, and
 *  the outside world interacts only through a controlled interface.
 *
 *  WHY?
 *  ----
 *  • Prevents accidental corruption of internal state
 *  • Lets you change internals without breaking external code
 *  • Makes the API surface explicit and intentional
 *
 *  HOW JAVASCRIPT DOES IT:
 *  -----------------------
 *  1. Closures           (ES5 era — still works)
 *  2. Naming convention  ( _underscore — a gentleman's agreement )
 *  3. Private fields     ( #field — real enforcement, ES2022+ )
 *  4. WeakMap trick      (niche, but sometimes seen in libraries)
 */

// ─── 1. CLOSURE-BASED ENCAPSULATION (ES5 pattern) ───────────────

function BankAccountClosure(ownerName, initialBalance) {
  // These variables live in the closure — truly private
  let balance = initialBalance;
  const owner = ownerName;

  // The returned object is the public API
  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      console.log(`Deposited ₹${amount}. New balance: ₹${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      console.log(`Withdrew ₹${amount}. New balance: ₹${balance}`);
    },
    getBalance() {
      return balance;
    },
    getOwner() {
      return owner;
    },
  };
}

const acc1 = BankAccountClosure("Sandip", 10000);
acc1.deposit(5000);   // Deposited ₹5000. New balance: ₹15000
acc1.withdraw(2000);  // Withdrew ₹2000. New balance: ₹13000
console.log(acc1.getBalance()); // 13000
// console.log(acc1.balance);   // undefined — truly hidden!

// ─── 2. UNDERSCORE CONVENTION (soft private) ────────────────────

class UserProfile {
  constructor(name, email) {
    this.name = name;        // public
    this._email = email;     // "private" by convention — nothing stops access
  }

  getEmail() {
    return this._email;
  }

  setEmail(newEmail) {
    if (!newEmail.includes("@")) throw new Error("Invalid email");
    this._email = newEmail;
  }
}

const user = new UserProfile("Rahul", "rahul@mail.com");
console.log(user._email);  // Still accessible! It's just a convention.

// ─── 3. TRUE PRIVATE FIELDS WITH # (ES2022+) ───────────────────

class BankAccount {
  // # makes these genuinely private — engine enforced
  #balance;
  #owner;
  #transactionLog = [];

  constructor(owner, initialBalance) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
    this.#log("DEPOSIT", amount);
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.#log("WITHDRAW", amount);
  }

  // Private method — also uses #
  #log(type, amount) {
    this.#transactionLog.push({
      type,
      amount,
      date: new Date().toISOString(),
      balanceAfter: this.#balance,
    });
  }

  // Public getter — controlled access
  get balance() {
    return this.#balance;
  }

  get owner() {
    return this.#owner;
  }

  get statement() {
    return [...this.#transactionLog]; // return a copy, not the reference
  }
}

const myAccount = new BankAccount("Sandip", 50000);
myAccount.deposit(10000);
myAccount.withdraw(5000);

console.log(myAccount.balance);    // 55000 — via getter
console.log(myAccount.owner);      // "Sandip"
console.log(myAccount.statement);  // [{type:'DEPOSIT',...}, {type:'WITHDRAW',...}]

// These WILL throw SyntaxError if uncommented:
// console.log(myAccount.#balance);         // SyntaxError
// console.log(myAccount.#transactionLog);  // SyntaxError
// myAccount.#log("HACK", 999999);          // SyntaxError

// ─── 4. WeakMap-BASED ENCAPSULATION (library pattern) ───────────

const _state = new WeakMap();

class Counter {
  constructor(initial = 0) {
    // Store private data in an external WeakMap keyed by `this`
    _state.set(this, { count: initial });
  }

  increment() {
    const state = _state.get(this);
    state.count++;
  }

  get value() {
    return _state.get(this).count;
  }
}

const c = new Counter(10);
c.increment();
c.increment();
console.log(c.value); // 12
// No way to reach `count` from outside without the WeakMap reference

// ─── KEY TAKEAWAYS ──────────────────────────────────────────────
/**
 *  | Technique       | Truly Private? | Works in older engines? |
 *  |-----------------|:--------------:|:-----------------------:|
 *  | Closures        |     ✅ Yes     |        ✅ Yes           |
 *  | _underscore     |     ❌ No      |        ✅ Yes           |
 *  | # private fields|     ✅ Yes     |    ES2022+ / Node 12+   |
 *  | WeakMap         |     ✅ Yes     |        ✅ Yes           |
 *
 *  In modern code, prefer #private fields — they're clean,
 *  engine-enforced, and well-supported now.
 */
