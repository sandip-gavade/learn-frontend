# Day 3 — Attributes, Classes & Styles

## HTML Attributes vs DOM Properties

This is a concept that trips up many developers. When the browser parses HTML, it creates DOM objects. HTML attributes and DOM properties are **related but not the same thing**.

```html
<input type="text" value="Hello" id="name">
```

```js
const input = document.getElementById('name');

// ATTRIBUTE: what's written in the HTML (initial/default value)
console.log(input.getAttribute('value')); // "Hello"

// PROPERTY: the current live state on the DOM object
console.log(input.value); // "Hello" (initially same)

// Now the user types "World" in the input field...
console.log(input.value);                 // "World" (property = current state)
console.log(input.getAttribute('value')); // "Hello" (attribute = original HTML)
```

**Key insight:** Attributes reflect the HTML source. Properties reflect the current DOM state. For most cases, use properties. Use `getAttribute`/`setAttribute` when you need the actual HTML attribute (e.g., custom attributes, or the initial value).

---

## Working with Attributes

### getAttribute / setAttribute / removeAttribute / hasAttribute

```html
<a id="link" href="/about" target="_blank" data-tracking="nav-about">About</a>
```

```js
const link = document.getElementById('link');

// Read
console.log(link.getAttribute('href'));     // "/about"
console.log(link.getAttribute('target'));   // "_blank"

// Set (creates if doesn't exist)
link.setAttribute('title', 'About Page');
link.setAttribute('rel', 'noopener');

// Check existence
console.log(link.hasAttribute('target'));   // true
console.log(link.hasAttribute('class'));    // false

// Remove
link.removeAttribute('target');
console.log(link.hasAttribute('target'));   // false
```

### data-* Attributes and the dataset API

Custom attributes prefixed with `data-` are accessible via the `dataset` property.

```html
<div id="user" 
     data-user-id="42" 
     data-role="admin" 
     data-last-login="2025-01-15">
  Sandip
</div>
```

```js
const user = document.getElementById('user');

// Reading: data-user-id → dataset.userId (camelCase conversion)
console.log(user.dataset.userId);    // "42"
console.log(user.dataset.role);      // "admin"
console.log(user.dataset.lastLogin); // "2025-01-15"

// Setting
user.dataset.status = 'active';
// HTML now has: data-status="active"

// Deleting
delete user.dataset.role;
// data-role attribute is removed

// All dataset entries
console.log(user.dataset);
// DOMStringMap { userId: "42", lastLogin: "2025-01-15", status: "active" }
```

**Naming rule:** `data-foo-bar` in HTML becomes `dataset.fooBar` in JS (hyphen → camelCase).

---

## Class Manipulation with classList

This is what you'll use most often for dynamic UI. `classList` is a `DOMTokenList` with handy methods.

```html
<div id="box" class="card">Content</div>
```

```js
const box = document.getElementById('box');

// ADD one or more classes
box.classList.add('active');
box.classList.add('shadow', 'rounded');  // multiple at once
// class="card active shadow rounded"

// REMOVE
box.classList.remove('shadow');
// class="card active rounded"

// TOGGLE — add if absent, remove if present
box.classList.toggle('active');
// class="card rounded" (active was removed)

box.classList.toggle('active');
// class="card rounded active" (active added back)

// TOGGLE with force parameter
box.classList.toggle('active', true);   // always ADD
box.classList.toggle('active', false);  // always REMOVE
// This is useful when you have a boolean condition:
const isLoggedIn = true;
box.classList.toggle('authenticated', isLoggedIn);

// CONTAINS — check if class exists
console.log(box.classList.contains('card'));   // true
console.log(box.classList.contains('hidden')); // false

// REPLACE
box.classList.replace('card', 'card-lg');
// class="card-lg rounded active"

// Iterate
box.classList.forEach(cls => console.log(cls));

// Length
console.log(box.classList.length); // 3
```

### Why not className?

```js
// className gives you the raw string — harder to work with
box.className = 'card active'; // REPLACES everything
box.className += ' rounded';   // Appending is fragile (watch the space)

// classList is surgical — add/remove without affecting other classes
box.classList.add('rounded');   // doesn't touch existing classes
```

---

## Inline Styles

### element.style — read/write inline styles

```js
const box = document.getElementById('box');

// Set styles (property names are camelCase)
box.style.backgroundColor = '#f0f0f0';
box.style.padding = '16px';
box.style.borderRadius = '8px';
box.style.fontSize = '18px';

// Read — only returns INLINE styles
console.log(box.style.backgroundColor); // "rgb(240, 240, 240)"
console.log(box.style.color);           // "" (not set inline)
```

**Important:** `element.style` only reads/writes **inline** styles. It won't show styles from CSS classes or stylesheets.

### Setting multiple styles at once

```js
// Using cssText — replaces ALL inline styles
box.style.cssText = 'background: red; padding: 20px; color: white;';

// Using Object.assign
Object.assign(box.style, {
  background: 'blue',
  color: 'white',
  padding: '20px',
  borderRadius: '8px',
});
```

### Removing an inline style

```js
box.style.backgroundColor = '';  // Remove by setting empty string
box.style.removeProperty('background-color'); // Or use CSS property name
```

---

## getComputedStyle — read the ACTUAL rendered styles

This is how you get the final computed value, regardless of where the style came from.

```html
<style>
  .card { color: navy; font-size: 16px; padding: 12px; }
</style>
<div id="box" class="card" style="padding: 20px;">Hello</div>
```

```js
const box = document.getElementById('box');
const computed = getComputedStyle(box);

// Gets the FINAL value (inline overrides class)
console.log(computed.padding);   // "20px" (inline wins)
console.log(computed.color);     // "rgb(0, 0, 128)" (from CSS class)
console.log(computed.fontSize);  // "16px" (from CSS class)
console.log(computed.display);   // "block" (browser default for div)

// All values are resolved — no "auto" or "inherit"
console.log(computed.width);     // actual pixel value like "584px"
```

**Note:** `getComputedStyle` is read-only. You can't set values through it.

---

## CSS Custom Properties (CSS Variables) from JS

```html
<style>
  :root {
    --primary: #3b82f6;
    --spacing: 16px;
  }
  .card {
    background: var(--primary);
    padding: var(--spacing);
  }
</style>
```

```js
// Read a CSS variable
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary');
console.log(primaryColor.trim()); // "#3b82f6"

// Set/change a CSS variable (affects all elements using it)
root.style.setProperty('--primary', '#ef4444');
// All elements using var(--primary) now update to red

// Set on a specific element (scoped)
const card = document.querySelector('.card');
card.style.setProperty('--primary', '#10b981');
// Only this card changes
```

---

## Practical Exercise — Theme Switcher

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --bg: #ffffff;
      --text: #1a1a1a;
      --card-bg: #f5f5f5;
      --accent: #3b82f6;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui;
      padding: 24px;
      transition: background 0.3s, color 0.3s;
    }

    .card {
      background: var(--card-bg);
      padding: 20px;
      border-radius: 12px;
      margin: 12px 0;
    }

    .tag {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      margin: 4px;
    }

    button {
      padding: 10px 20px;
      border: 2px solid var(--accent);
      background: var(--accent);
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 15px;
    }

    .active { background: var(--accent); color: white; }
    .inactive { background: transparent; border: 1px solid var(--text); }
  </style>
</head>
<body>
  <h1>Theme Switcher Demo</h1>
  <button id="toggle-theme">Switch to Dark Mode</button>

  <div class="card" id="profile-card" data-user-id="42" data-role="developer">
    <h3>Developer Profile</h3>
    <p>Click tags to toggle them:</p>
    <span class="tag active" data-skill="java">Java</span>
    <span class="tag active" data-skill="python">Python</span>
    <span class="tag inactive" data-skill="rust">Rust</span>
    <span class="tag inactive" data-skill="go">Go</span>
  </div>

  <script>
    const root = document.documentElement;
    const btn = document.getElementById('toggle-theme');
    let isDark = false;

    // Theme toggle using CSS variables
    btn.addEventListener('click', () => {
      isDark = !isDark;

      if (isDark) {
        root.style.setProperty('--bg', '#1a1a2e');
        root.style.setProperty('--text', '#e0e0e0');
        root.style.setProperty('--card-bg', '#16213e');
        root.style.setProperty('--accent', '#60a5fa');
        btn.textContent = 'Switch to Light Mode';
      } else {
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--text', '#1a1a1a');
        root.style.setProperty('--card-bg', '#f5f5f5');
        root.style.setProperty('--accent', '#3b82f6');
        btn.textContent = 'Switch to Dark Mode';
      }

      // Toggle a class on body
      document.body.classList.toggle('dark-mode', isDark);
    });

    // Tag toggling using classList and dataset
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const isActive = tag.classList.contains('active');
        tag.classList.toggle('active', !isActive);
        tag.classList.toggle('inactive', isActive);

        console.log(`Skill "${tag.dataset.skill}" is now ${!isActive ? 'active' : 'inactive'}`);
      });

      // Style cursor
      tag.style.cursor = 'pointer';
    });

    // Read data attributes
    const card = document.getElementById('profile-card');
    console.log('User ID:', card.dataset.userId);  // "42"
    console.log('Role:', card.dataset.role);        // "developer"
  </script>
</body>
</html>
```

---

## Key Takeaways

1. **Attributes** = HTML source values. **Properties** = current DOM state. They can diverge (especially for `value`, `checked`, `selected`).
2. `dataset` is the clean way to work with `data-*` attributes — no `getAttribute` needed.
3. `classList` is your primary tool for dynamic class changes — use `toggle` with a force boolean for conditional classes.
4. `element.style` only deals with inline styles; use `getComputedStyle` to read the actual rendered value.
5. CSS variables + `setProperty` is a powerful pattern for theming — one change propagates everywhere.
