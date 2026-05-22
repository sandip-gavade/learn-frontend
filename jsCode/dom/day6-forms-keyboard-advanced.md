# Day 6 — Forms, Keyboard & Advanced Patterns

## Form Handling

### Reading form values

```html
<form id="signup">
  <input type="text" name="username" id="username">
  <input type="email" name="email" id="email">
  <input type="password" name="password" id="password">
  <select name="role" id="role">
    <option value="dev">Developer</option>
    <option value="pm">Product Manager</option>
    <option value="design">Designer</option>
  </select>
  <label>
    <input type="checkbox" name="terms" id="terms"> Accept Terms
  </label>
  <button type="submit">Sign Up</button>
</form>
```

```js
const form = document.getElementById('signup');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // ALWAYS prevent default for JS-handled forms

  // Method 1: Direct property access
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const isTermsAccepted = document.getElementById('terms').checked;
  const role = document.getElementById('role').value;

  console.log({ username, email, isTermsAccepted, role });
});
```

### FormData API — the modern way

```js
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  // Get individual values
  console.log(formData.get('username'));  // "sandip"
  console.log(formData.get('email'));     // "sandip@example.com"
  console.log(formData.get('role'));      // "dev"

  // Convert to plain object
  const data = Object.fromEntries(formData);
  console.log(data);
  // { username: "sandip", email: "sandip@example.com", password: "...", role: "dev" }
  // Note: unchecked checkboxes are ABSENT from FormData

  // Check if checkbox was checked
  console.log(formData.has('terms')); // true if checked, false if not

  // Iterate all entries
  for (const [key, value] of formData) {
    console.log(`${key}: ${value}`);
  }

  // Send as JSON to an API
  fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
});
```

### Form validation — built-in Constraint Validation API

```html
<form id="profile">
  <input type="text" id="name" required minlength="2" maxlength="50">
  <input type="email" id="email" required>
  <input type="url" id="website" pattern="https?://.+">
  <input type="number" id="age" min="18" max="120">
  <button type="submit">Save</button>
</form>
```

```js
const profileForm = document.getElementById('profile');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

// Check validity programmatically
console.log(nameInput.validity.valid);          // true/false
console.log(nameInput.validity.valueMissing);   // true if required & empty
console.log(nameInput.validity.tooShort);       // true if < minlength
console.log(emailInput.validity.typeMismatch);  // true if not valid email format

// checkValidity() — returns boolean, fires 'invalid' event if false
nameInput.addEventListener('invalid', (e) => {
  e.preventDefault(); // prevent browser's default tooltip
  console.log('Name is invalid:', nameInput.validationMessage);
});

// reportValidity() — same as checkValidity but shows browser UI
nameInput.reportValidity();

// Custom validation messages
nameInput.setCustomValidity('Please use your full name');
// Reset it (required to re-enable submission):
nameInput.setCustomValidity('');

// Full form validation
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!profileForm.checkValidity()) {
    // Highlight all invalid fields
    profileForm.querySelectorAll(':invalid').forEach(field => {
      field.style.borderColor = 'red';
    });
    return;
  }

  console.log('Form is valid, submitting...');
});
```

### Real-time validation on input

```js
emailInput.addEventListener('input', () => {
  if (emailInput.validity.valid) {
    emailInput.style.borderColor = 'green';
  } else {
    emailInput.style.borderColor = 'red';
  }
});
```

---

## Keyboard Events — Advanced

### key vs code

```js
document.addEventListener('keydown', (e) => {
  // e.key = the character/function produced
  // e.code = the physical key location

  // Why this matters:
  // On QWERTY: pressing 'Z' → key: "z", code: "KeyZ"
  // On AZERTY: pressing 'Z' → key: "w", code: "KeyW"
  // On QWERTY: pressing 'Z' with Shift → key: "Z", code: "KeyZ"
});
```

**Rule of thumb:**
- Use `e.key` for text input and shortcuts (`Ctrl+S`, `Ctrl+K`)
- Use `e.code` for game controls (WASD) where physical position matters

### Building keyboard shortcuts

```js
// Global shortcut handler
document.addEventListener('keydown', (e) => {
  // Ctrl+K → focus search
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault();
    document.getElementById('search').focus();
    return;
  }

  // Escape → close modal
  if (e.key === 'Escape') {
    const modal = document.querySelector('.modal.open');
    if (modal) modal.classList.remove('open');
    return;
  }

  // Ctrl+Shift+P → command palette
  if (e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault();
    toggleCommandPalette();
    return;
  }

  // Arrow key navigation
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    navigateList(e.key === 'ArrowDown' ? 1 : -1);
  }
});
```

### Detecting modifier combinations

```js
function getModifiers(e) {
  const mods = [];
  if (e.ctrlKey || e.metaKey) mods.push('Ctrl');  // metaKey for Mac Cmd
  if (e.shiftKey) mods.push('Shift');
  if (e.altKey) mods.push('Alt');
  return mods;
}

document.addEventListener('keydown', (e) => {
  const mods = getModifiers(e);
  if (mods.length > 0) {
    console.log(`${mods.join('+')}+${e.key}`);
    // Output: "Ctrl+Shift+s"
  }
});
```

---

## Debouncing & Throttling

Events like `scroll`, `resize`, `input`, and `mousemove` fire very frequently. Without control, your handlers run hundreds of times per second.

### Debounce — wait until the user STOPS doing something

Only run the function after N ms of silence. If the event fires again before N ms, reset the timer.

```js
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// USE CASE: Search-as-you-type
const searchInput = document.getElementById('search');

const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // fetch(`/api/search?q=${query}`)
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
// User types "spring boot" rapidly
// Without debounce: 11 API calls (one per keystroke)
// With debounce(300): 1 API call (300ms after last keystroke)
```

### Throttle — run at most once every N ms

Guarantees the function runs at a regular interval, no matter how often the event fires.

```js
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// USE CASE: Scroll position tracking
const handleScroll = throttle(() => {
  console.log('Scroll Y:', window.scrollY);
  // Update progress bar, lazy load images, etc.
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });
// Scroll fires ~60 times/sec → throttle limits to ~10 times/sec
```

### When to use which

| Pattern    | Use when                                    | Example                          |
|------------|---------------------------------------------|----------------------------------|
| Debounce   | You want the FINAL value after activity stops | Search input, window resize save |
| Throttle   | You want regular updates DURING activity      | Scroll tracking, drag position   |

---

## Touch Events

```js
const box = document.getElementById('swipeable');

let startX, startY;

box.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

box.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    console.log(diffX > 0 ? 'Swipe RIGHT' : 'Swipe LEFT');
  } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
    console.log(diffY > 0 ? 'Swipe DOWN' : 'Swipe UP');
  }
});

// touchmove — fires continuously during drag
box.addEventListener('touchmove', (e) => {
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  console.log(`Dragging at ${x}, ${y}`);
}, { passive: true }); // passive for scroll performance
```

---

## MutationObserver — watch DOM changes

React to DOM modifications without polling.

```js
const container = document.getElementById('dynamic-content');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Children changed:');
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) console.log('  Added:', node.tagName);
      });
      mutation.removedNodes.forEach(node => {
        if (node.nodeType === 1) console.log('  Removed:', node.tagName);
      });
    }

    if (mutation.type === 'attributes') {
      console.log(`Attribute "${mutation.attributeName}" changed on`, mutation.target);
    }
  });
});

// Start observing
observer.observe(container, {
  childList: true,     // watch for added/removed children
  attributes: true,    // watch for attribute changes
  subtree: true,       // watch all descendants, not just direct children
  attributeFilter: ['class', 'data-status'], // optional: only these attributes
});

// Stop observing
// observer.disconnect();
```

Use case: watching for third-party script changes, debugging unexpected DOM modifications, syncing UI state.

---

## IntersectionObserver — viewport visibility detection

Detect when elements enter or leave the viewport. No scroll event + getBoundingClientRect needed.

```js
// Lazy loading images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;           // Load the real image
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);        // Stop watching once loaded
    }
  });
}, {
  rootMargin: '200px',  // Start loading 200px before visible
  threshold: 0,         // Trigger as soon as 1px is visible
});

images.forEach(img => imageObserver.observe(img));
```

### Scroll-based animations

```js
const sections = document.querySelectorAll('.animate-on-scroll');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.2,  // 20% of element must be visible
});

sections.forEach(section => animObserver.observe(section));
```

### Infinite scroll

```js
const sentinel = document.getElementById('scroll-sentinel');
// Place an empty div at the bottom of your list

const scrollObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadMoreItems();  // Fetch next page
  }
});

scrollObserver.observe(sentinel);
```

---

## Practical Exercise — Validated Contact Form

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 24px; max-width: 480px; margin: 0 auto; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-weight: 600; margin-bottom: 4px; font-size: 14px; }
    input, textarea, select {
      width: 100%; padding: 10px; border: 2px solid #e2e8f0;
      border-radius: 8px; font-size: 15px; box-sizing: border-box;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus { border-color: #3b82f6; outline: none; }
    .valid { border-color: #10b981 !important; }
    .invalid { border-color: #ef4444 !important; }
    .error-msg { color: #ef4444; font-size: 12px; margin-top: 4px; display: none; }
    .error-msg.show { display: block; }
    button { padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .char-count { text-align: right; font-size: 12px; color: #94a3b8; }
    #results { margin-top: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px; display: none; }
  </style>
</head>
<body>
  <h2>Contact Form</h2>

  <form id="contactForm" novalidate>
    <div class="form-group">
      <label for="name">Name *</label>
      <input type="text" id="name" name="name" required minlength="2" placeholder="Your name">
      <div class="error-msg" id="name-error"></div>
    </div>

    <div class="form-group">
      <label for="email">Email *</label>
      <input type="email" id="email" name="email" required placeholder="you@example.com">
      <div class="error-msg" id="email-error"></div>
    </div>

    <div class="form-group">
      <label for="subject">Subject</label>
      <select id="subject" name="subject">
        <option value="">Choose...</option>
        <option value="bug">Bug Report</option>
        <option value="feature">Feature Request</option>
        <option value="general">General Inquiry</option>
      </select>
    </div>

    <div class="form-group">
      <label for="message">Message *</label>
      <textarea id="message" name="message" required minlength="10" maxlength="500" rows="4" placeholder="Your message..."></textarea>
      <div class="char-count"><span id="charCount">0</span>/500</div>
      <div class="error-msg" id="message-error"></div>
    </div>

    <button type="submit" id="submitBtn">Send Message</button>
  </form>

  <div id="results"></div>

  <script>
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // Real-time validation with debounce
    function debounce(fn, delay) {
      let timer;
      return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    }

    function validateField(input) {
      const errorEl = document.getElementById(`${input.id}-error`);
      if (!errorEl) return;

      if (input.validity.valid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorEl.classList.remove('show');
      } else {
        input.classList.remove('valid');
        input.classList.add('invalid');

        // Custom messages
        if (input.validity.valueMissing) {
          errorEl.textContent = `${input.previousElementSibling.textContent.replace(' *', '')} is required`;
        } else if (input.validity.tooShort) {
          errorEl.textContent = `Minimum ${input.minLength} characters`;
        } else if (input.validity.typeMismatch) {
          errorEl.textContent = 'Please enter a valid email address';
        }
        errorEl.classList.add('show');
      }
    }

    // Attach debounced validation to all required fields
    const debouncedValidate = debounce(validateField, 300);

    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => debouncedValidate(field));
      field.addEventListener('blur', () => validateField(field)); // immediate on blur
    });

    // Character counter (throttled)
    const message = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    message.addEventListener('input', () => {
      charCount.textContent = message.value.length;
    });

    // Keyboard shortcut: Ctrl+Enter to submit
    form.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        form.requestSubmit(); // triggers submit event with validation
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      let firstInvalid = null;
      form.querySelectorAll('input, textarea').forEach(field => {
        validateField(field);
        if (!field.validity.valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // All valid — collect with FormData
      const data = Object.fromEntries(new FormData(form));
      const results = document.getElementById('results');
      results.style.display = 'block';
      results.innerHTML = `<strong>Submitted:</strong><pre>${JSON.stringify(data, null, 2)}</pre>`;

      form.reset();
      form.querySelectorAll('.valid').forEach(f => f.classList.remove('valid'));
      charCount.textContent = '0';
    });
  </script>
</body>
</html>
```

---

## Key Takeaways

1. Use `FormData` + `Object.fromEntries` for clean form data extraction.
2. The Constraint Validation API (`validity`, `checkValidity`, `setCustomValidity`) gives you native validation without libraries.
3. **Debounce** for final-value scenarios (search, resize), **Throttle** for during-activity tracking (scroll, drag).
4. `MutationObserver` watches DOM changes; `IntersectionObserver` watches viewport visibility — both replace expensive polling/scroll patterns.
5. `{ passive: true }` on scroll/touch events is a free performance win.
6. `e.key` for character-based shortcuts, `e.code` for physical-key controls.
