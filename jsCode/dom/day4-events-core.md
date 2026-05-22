# Day 4 — Events Core

## How Events Work

When something happens in the browser (click, keypress, scroll, etc.), the browser creates an **Event object** and dispatches it to the relevant element. You register listeners to react to these events.

---

## addEventListener / removeEventListener

### Basic usage

```js
const btn = document.querySelector('#myBtn');

// Add a listener
btn.addEventListener('click', function(event) {
  console.log('Button clicked!');
  console.log(event); // The Event object
});
```

### Named functions (needed for removal)

```js
function handleClick(event) {
  console.log('Clicked!');
}

// Add
btn.addEventListener('click', handleClick);

// Remove — must pass the SAME function reference
btn.removeEventListener('click', handleClick);

// THIS WON'T WORK — anonymous functions can't be removed
btn.addEventListener('click', function() { console.log('hi'); });
btn.removeEventListener('click', function() { console.log('hi'); }); // different reference!
```

### Multiple listeners on the same event

```js
btn.addEventListener('click', () => console.log('First'));
btn.addEventListener('click', () => console.log('Second'));
// Both fire on click, in order of registration
```

### Options object

```js
btn.addEventListener('click', handleClick, {
  once: true,      // auto-removes after first invocation
  capture: true,   // listen in capture phase (Day 5)
  passive: true,   // promises not to call preventDefault (perf optimization for scroll/touch)
});
```

---

## The Event Object

Every event handler receives an Event object. Here are the essential properties:

```js
element.addEventListener('click', function(event) {
  // WHAT happened
  console.log(event.type);          // "click"

  // WHERE — the element that was actually clicked
  console.log(event.target);        // the deepest element clicked

  // WHO — the element the listener is attached to
  console.log(event.currentTarget); // the element with addEventListener

  // WHEN
  console.log(event.timeStamp);     // ms since page load

  // Mouse position (for mouse events)
  console.log(event.clientX, event.clientY); // relative to viewport
  console.log(event.pageX, event.pageY);     // relative to document

  // Modifier keys held during the event
  console.log(event.ctrlKey);   // true/false
  console.log(event.shiftKey);
  console.log(event.altKey);
  console.log(event.metaKey);   // Cmd on Mac, Win key on Windows
});
```

### target vs currentTarget — CRITICAL distinction

```html
<div id="parent">
  <button id="child">Click Me</button>
</div>
```

```js
const parent = document.getElementById('parent');

parent.addEventListener('click', function(event) {
  console.log('target:', event.target.id);        // "child" (what was clicked)
  console.log('currentTarget:', event.currentTarget.id); // "parent" (where listener lives)
});
```

You'll use this heavily in event delegation (Day 5).

---

## preventDefault — stop the browser's default action

```js
// Prevent a link from navigating
const link = document.querySelector('a');
link.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('Link click intercepted, not navigating');
});

// Prevent form submission (page reload)
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('Form submitted via JS, no page reload');
  // Process form data here
});

// Prevent context menu
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
  console.log('Right-click blocked');
});
```

### stopPropagation — stop event from bubbling up

```js
const child = document.getElementById('child');

child.addEventListener('click', function(event) {
  event.stopPropagation();
  console.log('Only this handler runs, parent won\'t hear about it');
});
```

We'll cover propagation deeply on Day 5.

---

## Common Events Reference

### Mouse Events

```js
const box = document.getElementById('box');

box.addEventListener('click', () => console.log('click'));
box.addEventListener('dblclick', () => console.log('double click'));

// mouseenter/mouseleave — don't bubble, fire only for the target element
box.addEventListener('mouseenter', () => console.log('mouse entered box'));
box.addEventListener('mouseleave', () => console.log('mouse left box'));

// mouseover/mouseout — DO bubble, fire when entering/leaving child elements too
box.addEventListener('mouseover', () => console.log('mouse over (bubbles)'));
box.addEventListener('mouseout', () => console.log('mouse out (bubbles)'));

// mousemove — fires continuously as mouse moves
box.addEventListener('mousemove', (e) => {
  console.log(`Mouse at: ${e.clientX}, ${e.clientY}`);
});

// mousedown/mouseup — press and release
box.addEventListener('mousedown', () => console.log('mouse button pressed'));
box.addEventListener('mouseup', () => console.log('mouse button released'));
```

**mouseenter vs mouseover:**

```html
<div id="outer">
  Outer
  <div id="inner">Inner</div>
</div>
```

```js
// mouseover fires when you move from outer → inner (bubbles up from inner)
// mouseenter does NOT fire again when moving to inner (no bubbling)

// Use mouseenter/mouseleave for most UI hover effects
// Use mouseover/mouseout when you need bubble-based delegation
```

### Keyboard Events

```js
document.addEventListener('keydown', (e) => {
  console.log('Key:', e.key);     // "a", "Enter", "ArrowUp", "Shift"
  console.log('Code:', e.code);   // "KeyA", "Enter", "ArrowUp", "ShiftLeft"

  // key = what character was produced (affected by Shift, layout)
  // code = physical key on the keyboard (always the same)

  // Check for shortcuts
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault(); // prevent browser save dialog
    console.log('Ctrl+S pressed — custom save!');
  }
});

// keyup — fires when key is released
document.addEventListener('keyup', (e) => {
  console.log(`Released: ${e.key}`);
});

// Note: "keypress" is DEPRECATED — use keydown instead
```

### Input & Form Events

```html
<input type="text" id="search">
<select id="country">
  <option>India</option>
  <option>USA</option>
</select>
```

```js
const search = document.getElementById('search');

// input — fires on EVERY keystroke/change (real-time)
search.addEventListener('input', (e) => {
  console.log('Current value:', e.target.value);
});

// change — fires when field loses focus AND value has changed
search.addEventListener('change', (e) => {
  console.log('Final value:', e.target.value);
});

// For <select>, change fires immediately on selection
const country = document.getElementById('country');
country.addEventListener('change', (e) => {
  console.log('Selected:', e.target.value);
});
```

### Focus Events

```js
const input = document.getElementById('search');

// focus — element receives focus
input.addEventListener('focus', () => {
  console.log('Input focused');
  input.style.borderColor = 'blue';
});

// blur — element loses focus
input.addEventListener('blur', () => {
  console.log('Input blurred');
  input.style.borderColor = '';
});

// focusin/focusout — same but they BUBBLE (useful for delegation)
```

### Scroll & Resize Events

```js
// scroll — fires as user scrolls
window.addEventListener('scroll', () => {
  console.log('Scroll position:', window.scrollY);
});

// resize — fires when window size changes
window.addEventListener('resize', () => {
  console.log(`Window: ${window.innerWidth} x ${window.innerHeight}`);
});

// Both fire VERY frequently — you'll want to debounce/throttle (Day 6)
```

### Page Load Events

```js
// DOMContentLoaded — HTML parsed, DOM ready (stylesheets/images may still load)
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM is ready!');
  // Safe to querySelector and manipulate
});

// load — EVERYTHING loaded (images, stylesheets, iframes)
window.addEventListener('load', () => {
  console.log('Page fully loaded including images');
});

// beforeunload — user is leaving the page
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  // Browser shows "Leave site?" dialog
});
```

**When to use which:**
- `DOMContentLoaded` — for most JS initialization. Put your `<script>` tag at bottom of body OR listen for this event.
- `load` — when you need images/resources ready (e.g., canvas drawing, image dimensions).

---

## Practical Exercise — Interactive Event Logger

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 24px; }
    .playground {
      width: 300px; height: 200px; background: #e2e8f0;
      border-radius: 12px; display: flex; align-items: center;
      justify-content: center; font-size: 18px; cursor: pointer;
      user-select: none; transition: background 0.2s;
    }
    .playground:hover { background: #cbd5e1; }
    #log {
      margin-top: 16px; padding: 12px; background: #1a1a2e; color: #a5f3fc;
      font-family: monospace; font-size: 13px; border-radius: 8px;
      height: 250px; overflow-y: auto; white-space: pre;
    }
    input, button { padding: 8px 12px; margin: 4px; font-size: 14px; }
  </style>
</head>
<body>
  <h2>Event Playground</h2>

  <input type="text" id="textInput" placeholder="Type here...">
  <button id="clearBtn">Clear Log</button>

  <div class="playground" id="playground">Click, hover, or double-click me</div>
  <div id="log"></div>

  <script>
    const log = document.getElementById('log');
    const playground = document.getElementById('playground');
    const input = document.getElementById('textInput');
    const clearBtn = document.getElementById('clearBtn');

    let logCount = 0;

    function addLog(message) {
      logCount++;
      const line = `${logCount}. ${message}\n`;
      log.textContent += line;
      log.scrollTop = log.scrollHeight; // auto-scroll to bottom
    }

    // Mouse events on playground
    playground.addEventListener('click', (e) => {
      addLog(`CLICK at (${e.clientX}, ${e.clientY})`);
    });

    playground.addEventListener('dblclick', () => {
      addLog('DOUBLE CLICK');
    });

    playground.addEventListener('mouseenter', () => {
      addLog('MOUSE ENTER');
    });

    playground.addEventListener('mouseleave', () => {
      addLog('MOUSE LEAVE');
    });

    // Keyboard events on input
    input.addEventListener('keydown', (e) => {
      addLog(`KEYDOWN: key="${e.key}" code="${e.code}"` +
             (e.ctrlKey ? ' +Ctrl' : '') +
             (e.shiftKey ? ' +Shift' : ''));
    });

    input.addEventListener('input', (e) => {
      addLog(`INPUT: value="${e.target.value}"`);
    });

    input.addEventListener('focus', () => addLog('INPUT FOCUS'));
    input.addEventListener('blur', () => addLog('INPUT BLUR'));

    // Clear button
    clearBtn.addEventListener('click', () => {
      log.textContent = '';
      logCount = 0;
    });

    // Global keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        input.focus();
        addLog('Ctrl+K — focused input');
      }
    });

    addLog('Ready! Interact with elements above.');
    addLog('Try: Ctrl+K to focus input');
  </script>
</body>
</html>
```

---

## Key Takeaways

1. Always use `addEventListener` — not inline `onclick` attributes.
2. `event.target` = what was clicked; `event.currentTarget` = where the listener lives.
3. `preventDefault()` stops browser defaults (navigation, form submit). `stopPropagation()` stops bubbling.
4. Use `keydown` (not deprecated `keypress`). Use `e.key` for characters, `e.code` for physical keys.
5. `input` event fires in real-time; `change` fires on blur. Use `input` for live search/validation.
6. `DOMContentLoaded` is your go-to for initialization — don't wait for `load` unless you need images.
