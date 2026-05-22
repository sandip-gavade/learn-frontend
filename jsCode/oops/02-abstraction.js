/**
 * ============================================================
 *  ABSTRACTION in JavaScript
 * ============================================================
 *
 *  WHAT IS IT?
 *  -----------
 *  Abstraction = "hide the complex HOW, expose the simple WHAT."
 *
 *  You use `fetch()` every day without knowing the TCP handshake,
 *  DNS resolution, or TLS negotiation happening underneath.
 *  That's abstraction.
 *
 *  Encapsulation hides DATA.
 *  Abstraction hides COMPLEXITY / IMPLEMENTATION DETAILS.
 *
 *  HOW JAVASCRIPT DOES IT:
 *  -----------------------
 *  JS has no `abstract` keyword like Java. We simulate it with:
 *  1. Throwing errors in base-class methods ("you must override this")
 *  2. Using closures to hide internals behind a simple API
 *  3. Symbols for truly hidden implementation methods
 */

// ─── 1. SIMULATING ABSTRACT CLASSES ─────────────────────────────

class PaymentProcessor {
  /**
   * This class is "abstract" — you're not supposed to instantiate
   * it directly. Children must implement processPayment().
   */
  constructor(merchantName) {
    if (new.target === PaymentProcessor) {
      throw new Error(
        "PaymentProcessor is abstract — use a subclass like StripeProcessor"
      );
    }
    this.merchantName = merchantName;
  }

  // "Abstract" method — forces subclasses to implement
  processPayment(amount, currency) {
    throw new Error(
      `${this.constructor.name} must implement processPayment()`
    );
  }

  // Concrete method — shared logic that all subclasses inherit
  generateReceipt(amount, currency, txnId) {
    return {
      merchant: this.merchantName,
      amount,
      currency,
      txnId,
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── Concrete implementation: Stripe ────────────────────────────

class StripeProcessor extends PaymentProcessor {
  #apiKey;

  constructor(merchantName, apiKey) {
    super(merchantName);
    this.#apiKey = apiKey;
  }

  processPayment(amount, currency = "INR") {
    // Complex Stripe-specific logic hidden behind a simple call
    console.log(`[Stripe] Charging ₹${amount} via API key ${this.#apiKey.slice(0, 8)}...`);
    const txnId = "txn_" + Math.random().toString(36).slice(2, 10);
    return this.generateReceipt(amount, currency, txnId);
  }
}

// ─── Concrete implementation: Razorpay ──────────────────────────

class RazorpayProcessor extends PaymentProcessor {
  #keyId;
  #keySecret;

  constructor(merchantName, keyId, keySecret) {
    super(merchantName);
    this.#keyId = keyId;
    this.#keySecret = keySecret;
  }

  processPayment(amount, currency = "INR") {
    console.log(`[Razorpay] Creating order for ₹${amount}...`);
    const txnId = "pay_" + Math.random().toString(36).slice(2, 10);
    return this.generateReceipt(amount, currency, txnId);
  }
}

// ─── Usage: The caller doesn't care HOW payment works ───────────

function checkout(processor, cartTotal) {
  // This function is fully abstracted from the payment provider.
  // Swap Stripe ↔ Razorpay and this code doesn't change.
  const receipt = processor.processPayment(cartTotal);
  console.log("Receipt:", receipt);
  return receipt;
}

const stripe = new StripeProcessor("SellCord", "sk_live_abc123xyz");
const razorpay = new RazorpayProcessor("SellCord", "rzp_key", "rzp_secret");

checkout(stripe, 4999);
checkout(razorpay, 4999);

// This will throw: "PaymentProcessor is abstract"
// const bad = new PaymentProcessor("Oops");

// ─── 2. CLOSURE-BASED ABSTRACTION ───────────────────────────────
/**
 *  Hide an entire complex subsystem behind a clean function API.
 *  The caller never sees retries, caching, or error normalization.
 */

function createHttpClient(baseURL, options = {}) {
  // --- INTERNAL COMPLEXITY (hidden) ---
  const defaultHeaders = { "Content-Type": "application/json", ...options.headers };
  const maxRetries = options.retries || 3;
  const cache = new Map();

  async function fetchWithRetry(url, config, attempt = 1) {
    try {
      const res = await fetch(url, config);
      if (!res.ok && attempt < maxRetries) {
        console.log(`Retry ${attempt}/${maxRetries} for ${url}`);
        return fetchWithRetry(url, config, attempt + 1);
      }
      return res.json();
    } catch (err) {
      if (attempt < maxRetries) return fetchWithRetry(url, config, attempt + 1);
      throw new Error(`Request failed after ${maxRetries} attempts: ${err.message}`);
    }
  }

  // --- PUBLIC API (simple) ---
  return {
    async get(path) {
      const url = `${baseURL}${path}`;
      if (cache.has(url)) return cache.get(url);
      const data = await fetchWithRetry(url, { headers: defaultHeaders });
      cache.set(url, data);
      return data;
    },
    async post(path, body) {
      const url = `${baseURL}${path}`;
      return fetchWithRetry(url, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(body),
      });
    },
    clearCache() {
      cache.clear();
    },
  };
}

// Consumer sees: get(), post(), clearCache(). That's it.
// Retries? Caching? Header merging? All abstracted away.
const api = createHttpClient("https://api.example.com", { retries: 5 });
// api.get("/users");
// api.post("/orders", { item: "widget", qty: 3 });

// ─── 3. SYMBOL-BASED HIDDEN METHODS ────────────────────────────

const _validate = Symbol("validate");
const _sanitize = Symbol("sanitize");

class FormHandler {
  constructor(schema) {
    this.schema = schema;
  }

  // These methods are "hidden" — not enumerable, not easily discoverable
  [_validate](data) {
    for (const [field, rules] of Object.entries(this.schema)) {
      if (rules.required && !(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    return true;
  }

  [_sanitize](data) {
    const clean = {};
    for (const key of Object.keys(this.schema)) {
      if (key in data) {
        clean[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      }
    }
    return clean;
  }

  // Public API — the consumer only calls submit()
  submit(rawData) {
    this[_validate](rawData);
    const cleanData = this[_sanitize](rawData);
    console.log("Submitting:", cleanData);
    return cleanData;
  }
}

const form = new FormHandler({
  name: { required: true },
  email: { required: true },
  phone: { required: false },
});

form.submit({ name: "  Sandip  ", email: "s@example.com", phone: "9876543210", hack: "ignored" });
// Output: Submitting: { name: 'Sandip', email: 's@example.com', phone: '9876543210' }

// form[_validate] is NOT visible in Object.keys() or for...in loops
console.log(Object.keys(form));             // ['schema']
console.log(Object.getOwnPropertyNames(form)); // ['schema']

// ─── KEY TAKEAWAYS ──────────────────────────────────────────────
/**
 *  1. Abstraction ≠ Encapsulation
 *     - Encapsulation hides DATA (#balance, closures)
 *     - Abstraction hides COMPLEXITY (processPayment() hides Stripe vs Razorpay internals)
 *
 *  2. JS has no `abstract` keyword — simulate with:
 *     - new.target check in constructor
 *     - throw Error in base methods
 *
 *  3. Closures are THE most powerful abstraction tool in JS.
 *     Factory functions returning a clean object API = abstraction done right.
 *
 *  4. Think of abstraction as building layers:
 *     Low-level: TCP sockets, HTTP parsing, JSON serialization
 *     Mid-level: fetchWithRetry, caching, header merging
 *     High-level: api.get("/users")  ← This is what the dev uses
 */
