/**
 * ============================================================
 *  POLYMORPHISM in JavaScript
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  "poly" = many, "morph" = forms.
 *  Same method name, different behavior depending on the object.
 *
 *  In Java, you have:
 *  - Compile-time polymorphism (method overloading)
 *  - Runtime polymorphism (method overriding)
 *
 *  In JS, you have:
 *  - Runtime polymorphism (method overriding) — primary form
 *  - Duck typing ("if it quacks like a duck...")
 *  - NO real method overloading (JS ignores extra params / has no signatures)
 */

// ─── 1. METHOD OVERRIDING (Runtime Polymorphism) ────────────────

class Notification {
  constructor(recipient, message) {
    this.recipient = recipient;
    this.message = message;
    this.createdAt = new Date();
  }

  send() {
    throw new Error(`${this.constructor.name} must implement send()`);
  }

  // toString override — polymorphism on a built-in method
  toString() {
    return `[${this.constructor.name}] To: ${this.recipient}`;
  }
}

class EmailNotification extends Notification {
  constructor(recipient, message, subject) {
    super(recipient, message);
    this.subject = subject;
  }

  send() {
    console.log(`📧 Sending EMAIL to ${this.recipient}`);
    console.log(`   Subject: ${this.subject}`);
    console.log(`   Body: ${this.message}`);
    return { channel: "email", status: "sent" };
  }
}

class SMSNotification extends Notification {
  send() {
    console.log(`📱 Sending SMS to ${this.recipient}`);
    console.log(`   Message: ${this.message.slice(0, 160)}`);
    return { channel: "sms", status: "sent" };
  }
}

class SlackNotification extends Notification {
  constructor(recipient, message, channel) {
    super(recipient, message);
    this.channel = channel;
  }

  send() {
    console.log(`💬 Posting to Slack #${this.channel}`);
    console.log(`   @${this.recipient}: ${this.message}`);
    return { channel: "slack", status: "sent" };
  }
}

// ─── THE POWER: Same interface, different behavior ──────────────

function notifyAll(notifications) {
  // This function doesn't know or care which subclass each item is.
  // It just calls send() — polymorphism handles the rest.
  const results = [];
  for (const notif of notifications) {
    console.log(`\nProcessing: ${notif}`); // calls toString() — also polymorphic!
    results.push(notif.send());
  }
  return results;
}

const queue = [
  new EmailNotification("sandip@sellcord.co", "Invoice ready", "Your January Invoice"),
  new SMSNotification("+919876543210", "Your OTP is 482901"),
  new SlackNotification("priya", "Build passed ✅", "engineering"),
  new EmailNotification("client@example.com", "Payment received", "Payment Confirmation"),
];

const results = notifyAll(queue);
console.log("\nResults:", results);

// ─── 2. DUCK TYPING (Structural Polymorphism) ───────────────────
/**
 *  JS doesn't check types at compile time. If an object has the
 *  method you're calling, it works — regardless of its class.
 *
 *  "If it walks like a duck and quacks like a duck, it's a duck."
 */

// These are completely unrelated classes — no shared parent
class FileLogger {
  log(msg) {
    console.log(`[FILE] ${new Date().toISOString()} | ${msg}`);
  }
}

class ConsoleLogger {
  log(msg) {
    console.log(`[CONSOLE] ${msg}`);
  }
}

class RemoteLogger {
  log(msg) {
    console.log(`[REMOTE] Sending to log server: ${msg}`);
  }
}

// This function works with ANY object that has a .log() method
function processOrder(orderId, logger) {
  logger.log(`Processing order ${orderId}`);
  // ... business logic ...
  logger.log(`Order ${orderId} completed`);
}

processOrder("ORD-101", new FileLogger());
processOrder("ORD-102", new ConsoleLogger());
processOrder("ORD-103", new RemoteLogger());

// Even a plain object works! No class needed.
processOrder("ORD-104", {
  log(msg) {
    console.log(`[INLINE] ${msg}`);
  },
});

// ─── 3. SIMULATING METHOD OVERLOADING ───────────────────────────
/**
 *  JS doesn't support overloading like Java (same name, different params).
 *  But you can simulate it by checking arguments.
 */

class Calculator {
  // Java would have: add(int, int), add(int, int, int), add(int[])
  // JS does it all in one method:
  add(...args) {
    if (args.length === 0) return 0;

    // If first arg is an array, sum the array
    if (Array.isArray(args[0])) {
      return args[0].reduce((sum, n) => sum + n, 0);
    }

    // If args are strings, concatenate
    if (typeof args[0] === "string") {
      return args.join(" ");
    }

    // Default: sum all numbers
    return args.reduce((sum, n) => sum + n, 0);
  }
}

const calc = new Calculator();
console.log(calc.add(1, 2));              // 3
console.log(calc.add(1, 2, 3, 4));        // 10
console.log(calc.add([10, 20, 30]));      // 60
console.log(calc.add("Hello", "World"));  // "Hello World"

// ─── 4. POLYMORPHISM WITH Symbol.iterator ───────────────────────
/**
 *  Built-in polymorphism: implement Symbol.iterator and your
 *  object works with for...of, spread, destructuring, etc.
 */

class Playlist {
  #songs;

  constructor(name) {
    this.name = name;
    this.#songs = [];
  }

  add(song) {
    this.#songs.push(song);
    return this; // for chaining
  }

  // Make Playlist iterable — polymorphic with arrays, sets, maps, etc.
  [Symbol.iterator]() {
    let index = 0;
    const songs = this.#songs;
    return {
      next() {
        if (index < songs.length) {
          return { value: songs[index++], done: false };
        }
        return { done: true };
      },
    };
  }

  // Polymorphic with string coercion
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return `Playlist: ${this.name} (${this.#songs.length} songs)`;
    if (hint === "number") return this.#songs.length;
    return this.name;
  }
}

const playlist = new Playlist("Road Trip")
  .add("Blinding Lights")
  .add("Bohemian Rhapsody")
  .add("Stairway to Heaven");

// for...of works because we implemented Symbol.iterator
for (const song of playlist) {
  console.log(`🎵 ${song}`);
}

// Spread works too!
const songArray = [...playlist];
console.log(songArray); // ['Blinding Lights', 'Bohemian Rhapsody', 'Stairway to Heaven']

// Destructuring works too!
const [first, ...rest] = playlist;
console.log(`First: ${first}, Rest: ${rest}`);

// Symbol.toPrimitive in action
console.log(`${playlist}`);  // "Playlist: Road Trip (3 songs)"
console.log(+playlist);      // 3

// ─── KEY TAKEAWAYS ──────────────────────────────────────────────
/**
 *  1. Runtime polymorphism (method overriding) is the primary form in JS.
 *  2. Duck typing = structural polymorphism. No interface keyword needed.
 *     If the object has the method, it works.
 *  3. No real method overloading — simulate with rest params + type checks.
 *  4. Built-in polymorphism via Symbols:
 *     - Symbol.iterator   → for...of, spread, destructuring
 *     - Symbol.toPrimitive → type coercion
 *     - Symbol.hasInstance → instanceof behavior
 *  5. Polymorphism is WHY you code to interfaces (shapes), not implementations.
 */
