# Day 5 — Event Propagation & Delegation

## The Three Phases of Event Propagation

When you click a button nested inside divs, the event doesn't just fire on the button. It travels through the entire DOM tree in **three phases**:

```
Phase 1: CAPTURING  (top → down)
  document → html → body → div.container → div.card → button

Phase 2: TARGET
  button (the element you actually clicked)

Phase 3: BUBBLING   (bottom → up)
  button → div.card → div.container → body → html → document
```

By default, `addEventListener` listens during the **bubbling** phase.

### Seeing it in action

```html
<div id="outer" style="padding: 40px; background: #fee;">
  OUTER
  <div id="middle" style="padding: 40px; background: #efe;">
    MIDDLE
    <div id="inner" style="padding: 40px; background: #eef;">
      INNER
    </div>
  </div>
</div>

<script>
  const outer = document.getElementById('outer');
  const middle = document.getElementById('middle');
  const inner = document.getElementById('inner');

  // BUBBLING (default) — inner fires first, then up
  outer.addEventListener('click', () => console.log('OUTER - bubble'));
  middle.addEventListener('click', () => console.log('MIDDLE - bubble'));
  inner.addEventListener('click', () => console.log('INNER - bubble'));

  // Click on INNER div:
  // Output:
  //   INNER - bubble
  //   MIDDLE - bubble
  //   OUTER - bubble
</script>
```

### Capturing phase

```js
// Pass { capture: true } or just `true` as the third argument
outer.addEventListener('click', () => console.log('OUTER - capture'), true);
middle.addEventListener('click', () => console.log('MIDDLE - capture'), true);
inner.addEventListener('click', () => console.log('INNER - capture'), true);

// Click on INNER div:
// Output:
//   OUTER - capture     ← capture goes top-down
//   MIDDLE - capture
//   INNER - capture
//   INNER - bubble      ← then bubble goes bottom-up
//   MIDDLE - bubble
//   OUTER - bubble
```

### When do you use capturing?

Rarely. The main use case is intercepting events before they reach the target — e.g., a global click handler that prevents interaction during a loading state.

```js
document.addEventListener('click', (e) => {
  if (appIsLoading) {
    e.stopPropagation();
    console.log('Blocked click during loading');
  }
}, true); // capture phase — runs BEFORE any target/bubble handlers
```

---

## stopPropagation vs stopImmediatePropagation

### stopPropagation — prevents the event from continuing to the next element

```js
inner.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('INNER clicked');
});
middle.addEventListener('click', () => console.log('MIDDLE')); // WON'T fire
outer.addEventListener('click', () => console.log('OUTER'));   // WON'T fire
```

### stopImmediatePropagation — also prevents OTHER listeners on the SAME element

```js
inner.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('First handler');
});

// This second handler on the SAME element also won't fire
inner.addEventListener('click', () => {
  console.log('Second handler'); // NEVER runs
});
```

**Summary:**

| Method                     | Same element's other listeners | Parent elements |
|----------------------------|-------------------------------|-----------------|
| `stopPropagation()`        | Still fire                    | Blocked         |
| `stopImmediatePropagation()` | Also blocked               | Blocked         |

---

## Event Delegation

This is one of the most important DOM patterns. Instead of attaching a listener to every child, attach **one listener to the parent** and use `event.target` to figure out which child was clicked.

### The problem — without delegation

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```js
// BAD: listener on every <li>
const items = document.querySelectorAll('#list li');
items.forEach(item => {
  item.addEventListener('click', () => {
    console.log(item.textContent);
  });
});

// Problems:
// 1. If you add a new <li> dynamically, it has NO listener
// 2. 1000 items = 1000 listeners = memory waste
```

### The solution — delegation

```js
// GOOD: one listener on the parent <ul>
const list = document.getElementById('list');

list.addEventListener('click', (e) => {
  // Check what was actually clicked
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent);
  }
});

// Now dynamically added items work automatically!
const newItem = document.createElement('li');
newItem.textContent = 'Item 4 (dynamic)';
list.appendChild(newItem);
// Clicking "Item 4" works — the parent's listener catches it
```

### Handling nested elements inside the delegate target

Real-world elements have child nodes inside them:

```html
<ul id="task-list">
  <li class="task">
    <span class="task-name">Build API</span>
    <span class="task-status">In Progress</span>
    <button class="delete-btn">×</button>
  </li>
  <li class="task">
    <span class="task-name">Write Tests</span>
    <span class="task-status">Todo</span>
    <button class="delete-btn">×</button>
  </li>
</ul>
```

```js
const taskList = document.getElementById('task-list');

taskList.addEventListener('click', (e) => {
  // e.target might be the <span> inside the <li>, not the <li> itself

  // Method 1: closest() — walk up to find the delegate target
  const task = e.target.closest('.task');
  if (!task) return; // clicked outside any task

  // Method 2: Check for specific child elements
  if (e.target.classList.contains('delete-btn')) {
    task.remove();
    console.log('Deleted task');
    return;
  }

  // Clicked somewhere on the task (not delete button)
  console.log('Selected:', task.querySelector('.task-name').textContent);
});
```

**`closest()` is the key to robust delegation.** It walks up the DOM tree and returns the nearest ancestor (or self) matching the selector.

### matches() — check if an element fits a selector

```js
taskList.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    // Direct match on target
    e.target.closest('.task').remove();
  } else if (e.target.matches('.task-status')) {
    // Clicked the status badge
    console.log('Status:', e.target.textContent);
  }
});
```

---

## addEventListener Options Deep Dive

### once — auto-removes after first call

```js
const btn = document.getElementById('submit');

btn.addEventListener('click', () => {
  console.log('Form submitted');
  // This handler will only fire ONCE
  // No need for manual removeEventListener
}, { once: true });
```

Use case: one-time actions like form submission, modal dismiss, tutorial step acknowledgment.

### passive — performance optimization

```js
// For scroll and touch events, the browser waits to see if you call
// preventDefault() before scrolling. This causes jank.

// passive: true tells the browser "I promise not to call preventDefault()"
// So it can scroll immediately without waiting.

window.addEventListener('scroll', handleScroll, { passive: true });

// Touch events on mobile — big performance win
document.addEventListener('touchstart', handleTouch, { passive: true });

// Note: If you DO call preventDefault() in a passive listener,
// the browser ignores it and logs a warning.
```

### Combining options

```js
element.addEventListener('click', handler, {
  capture: true,
  once: true,
  passive: false,  // default for click
});
```

---

## Practical Exercise — Delegated Task Manager

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 24px; max-width: 500px; margin: 0 auto; }
    h2 { margin-bottom: 16px; }
    .input-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .input-row input { flex: 1; padding: 10px; font-size: 15px; border: 2px solid #e2e8f0; border-radius: 8px; }
    .input-row button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; }
    .task-list { list-style: none; padding: 0; }
    .task {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; margin: 6px 0;
      background: #f8fafc; border-radius: 8px;
      border-left: 4px solid #3b82f6;
      transition: all 0.2s;
    }
    .task:hover { background: #f1f5f9; }
    .task.done { border-left-color: #10b981; opacity: 0.6; }
    .task.done .task-name { text-decoration: line-through; }
    .task-name { flex: 1; cursor: pointer; }
    .task-priority {
      font-size: 12px; padding: 2px 8px; border-radius: 12px;
      cursor: pointer; font-weight: 600;
    }
    .priority-high { background: #fecaca; color: #dc2626; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-low { background: #d1fae5; color: #059669; }
    .delete-btn { cursor: pointer; color: #94a3b8; font-size: 18px; background: none; border: none; }
    .delete-btn:hover { color: #ef4444; }
    .counter { color: #64748b; font-size: 14px; margin-top: 12px; }
  </style>
</head>
<body>
  <h2>Task Manager</h2>

  <div class="input-row">
    <input type="text" id="taskInput" placeholder="Add a task...">
    <button id="addBtn">Add</button>
  </div>

  <ul class="task-list" id="taskList"></ul>
  <div class="counter" id="counter"></div>

  <script>
    const taskList = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const counter = document.getElementById('counter');

    let taskId = 0;
    const priorities = ['high', 'medium', 'low'];

    function createTask(text) {
      taskId++;
      const li = document.createElement('li');
      li.className = 'task';
      li.dataset.id = taskId;
      li.innerHTML = `
        <span class="task-name">${text}</span>
        <span class="task-priority priority-medium" data-priority="medium">MEDIUM</span>
        <button class="delete-btn" title="Delete">×</button>
      `;
      taskList.appendChild(li);
      updateCounter();
    }

    function updateCounter() {
      const total = taskList.children.length;
      const done = taskList.querySelectorAll('.task.done').length;
      counter.textContent = `${done}/${total} completed`;
    }

    // Add task
    addBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text) {
        createTask(text);
        taskInput.value = '';
        taskInput.focus();
      }
    });

    // Enter key to add
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn.click();
    });

    // ALL interactions via ONE delegated listener
    taskList.addEventListener('click', (e) => {
      const task = e.target.closest('.task');
      if (!task) return;

      // DELETE button
      if (e.target.matches('.delete-btn')) {
        task.style.transform = 'translateX(100%)';
        task.style.opacity = '0';
        setTimeout(() => {
          task.remove();
          updateCounter();
        }, 200);
        return;
      }

      // PRIORITY badge — cycle through priorities
      if (e.target.matches('.task-priority')) {
        const current = e.target.dataset.priority;
        const nextIndex = (priorities.indexOf(current) + 1) % priorities.length;
        const next = priorities[nextIndex];

        e.target.dataset.priority = next;
        e.target.className = `task-priority priority-${next}`;
        e.target.textContent = next.toUpperCase();
        return;
      }

      // TASK NAME — toggle done
      if (e.target.matches('.task-name')) {
        task.classList.toggle('done');
        updateCounter();
      }
    });

    // Seed some tasks
    createTask('Set up Spring Boot project');
    createTask('Design database schema');
    createTask('Implement REST endpoints');
  </script>
</body>
</html>
```

This entire UI — delete, toggle done, cycle priority — uses **one single event listener** on the parent `<ul>`.

---

## Key Takeaways

1. Events propagate in three phases: **capture → target → bubble**. Default listeners fire on bubble.
2. `stopPropagation` stops parent handlers; `stopImmediatePropagation` also stops sibling handlers on the same element.
3. **Event delegation** = one listener on parent + `event.target`/`closest()` to identify the child. This is the production pattern.
4. `closest()` is essential for delegation with nested elements — it walks up to find the matching ancestor.
5. `{ once: true }` for one-shot handlers, `{ passive: true }` for scroll/touch performance.
6. Delegation automatically handles dynamically added elements — no re-attaching needed.
