# Day 7 — Mini Project: Interactive Kanban Board + Revision

## Project Overview

Today you build a **Kanban board** that exercises everything from Days 1–6:

- **Day 1** — DOM selection & traversal (`querySelector`, `closest`, `children`)
- **Day 2** — DOM creation & manipulation (`createElement`, `append`, `remove`, `DocumentFragment`)
- **Day 3** — Attributes, classes & styles (`classList`, `dataset`, `style`, CSS variables)
- **Day 4** — Event handling (`addEventListener`, event object, `preventDefault`)
- **Day 5** — Event delegation & propagation (`closest`, single parent listener)
- **Day 6** — Forms, keyboard, debounce, IntersectionObserver

---

## The Complete Kanban Board

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kanban Board</title>
  <style>
    :root {
      --bg: #f1f5f9;
      --card-bg: #ffffff;
      --text: #1e293b;
      --muted: #64748b;
      --accent: #3b82f6;
      --danger: #ef4444;
      --success: #10b981;
      --warning: #f59e0b;
      --col-todo: #3b82f6;
      --col-progress: #f59e0b;
      --col-done: #10b981;
      --radius: 10px;
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 24px;
      min-height: 100vh;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header h1 { font-size: 24px; }
    .header-actions { display: flex; gap: 8px; }
    .theme-btn, .stats-btn {
      padding: 8px 14px;
      border: 1px solid #cbd5e1;
      border-radius: var(--radius);
      background: var(--card-bg);
      cursor: pointer;
      font-size: 13px;
    }

    /* Search */
    .search-bar {
      margin-bottom: 20px;
    }
    .search-bar input {
      width: 100%;
      max-width: 400px;
      padding: 10px 14px;
      border: 2px solid #e2e8f0;
      border-radius: var(--radius);
      font-size: 14px;
      background: var(--card-bg);
      color: var(--text);
    }
    .search-bar input:focus {
      border-color: var(--accent);
      outline: none;
    }
    .shortcut-hint {
      font-size: 12px;
      color: var(--muted);
      margin-top: 4px;
    }

    /* Board layout */
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      min-height: 500px;
    }

    /* Columns */
    .column {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 16px;
      box-shadow: var(--shadow);
    }
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 3px solid var(--col-todo);
    }
    .column[data-status="progress"] .column-header { border-bottom-color: var(--col-progress); }
    .column[data-status="done"] .column-header { border-bottom-color: var(--col-done); }
    .column-title {
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .column-count {
      background: #e2e8f0;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Add task form */
    .add-form { margin-bottom: 12px; }
    .add-form input {
      width: 100%;
      padding: 8px 10px;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
      background: transparent;
      color: var(--text);
    }
    .add-form input:focus {
      border-style: solid;
      border-color: var(--accent);
      outline: none;
    }

    /* Task cards */
    .task-list { min-height: 100px; }

    .task-card {
      background: var(--bg);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: grab;
      transition: transform 0.15s, box-shadow 0.15s, opacity 0.3s;
      position: relative;
    }
    .task-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .task-card.dragging {
      opacity: 0.4;
      transform: scale(0.95);
    }
    .task-card.highlight {
      animation: pulse 0.3s ease;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    .task-card.hidden { display: none; }

    .task-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      word-break: break-word;
    }
    .task-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .task-priority {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
    .priority-high { background: #fecaca; color: #dc2626; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-low { background: #d1fae5; color: #059669; }

    .task-actions { display: flex; gap: 4px; }
    .task-actions button {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 4px;
      opacity: 0.4;
      transition: opacity 0.2s;
    }
    .task-card:hover .task-actions button { opacity: 1; }
    .move-btn:hover { background: #dbeafe; }
    .delete-btn:hover { background: #fecaca; }

    /* Drag and drop */
    .column.drag-over .task-list {
      background: #e0f2fe;
      border-radius: 8px;
      transition: background 0.2s;
    }

    /* Stats bar */
    .stats-bar {
      margin-top: 20px;
      padding: 12px 16px;
      background: var(--card-bg);
      border-radius: var(--radius);
      display: none;
      font-size: 13px;
      color: var(--muted);
      box-shadow: var(--shadow);
    }
    .stats-bar.visible { display: flex; gap: 24px; }

    /* Dark mode */
    body.dark {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    body.dark .task-card { background: #334155; }
    body.dark .column-count { background: #334155; }

    /* Responsive */
    @media (max-width: 768px) {
      .board { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <h1>Kanban Board</h1>
    <div class="header-actions">
      <button class="stats-btn" id="toggleStats">Stats</button>
      <button class="theme-btn" id="toggleTheme">Dark Mode</button>
    </div>
  </div>

  <!-- SEARCH -->
  <div class="search-bar">
    <input type="text" id="searchInput" placeholder="Search tasks...">
    <div class="shortcut-hint">Ctrl+K to focus • Escape to clear</div>
  </div>

  <!-- BOARD -->
  <div class="board" id="board">
    <!-- Todo Column -->
    <div class="column" data-status="todo">
      <div class="column-header">
        <span class="column-title">To Do</span>
        <span class="column-count">0</span>
      </div>
      <div class="add-form">
        <input type="text" placeholder="+ Add task, press Enter" data-add-input="todo">
      </div>
      <div class="task-list" data-drop-zone="todo"></div>
    </div>

    <!-- In Progress Column -->
    <div class="column" data-status="progress">
      <div class="column-header">
        <span class="column-title">In Progress</span>
        <span class="column-count">0</span>
      </div>
      <div class="add-form">
        <input type="text" placeholder="+ Add task, press Enter" data-add-input="progress">
      </div>
      <div class="task-list" data-drop-zone="progress"></div>
    </div>

    <!-- Done Column -->
    <div class="column" data-status="done">
      <div class="column-header">
        <span class="column-title">Done</span>
        <span class="column-count">0</span>
      </div>
      <div class="add-form">
        <input type="text" placeholder="+ Add task, press Enter" data-add-input="done">
      </div>
      <div class="task-list" data-drop-zone="done"></div>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-bar" id="statsBar">
    <span>Total: <strong id="statTotal">0</strong></span>
    <span>To Do: <strong id="statTodo">0</strong></span>
    <span>In Progress: <strong id="statProgress">0</strong></span>
    <span>Done: <strong id="statDone">0</strong></span>
  </div>

  <script>
    // ================================================================
    // STATE
    // ================================================================
    let taskIdCounter = 0;
    const priorities = ['high', 'medium', 'low'];
    const board = document.getElementById('board');
    const searchInput = document.getElementById('searchInput');

    // ================================================================
    // TASK CREATION (Day 2: createElement, append, DocumentFragment)
    // ================================================================
    function createTaskCard(text, priority = 'medium', status = 'todo') {
      taskIdCounter++;
      const card = document.createElement('div');
      card.className = 'task-card';
      card.draggable = true;
      card.dataset.id = taskIdCounter;
      card.dataset.priority = priority;
      card.dataset.created = Date.now();

      // Build inner HTML with DOM methods only
      const title = document.createElement('div');
      title.className = 'task-title';
      title.textContent = text;

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      const priorityBadge = document.createElement('span');
      priorityBadge.className = `task-priority priority-${priority}`;
      priorityBadge.textContent = priority.toUpperCase();
      priorityBadge.dataset.action = 'priority';

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      // Move buttons
      const columns = ['todo', 'progress', 'done'];
      const arrows = { todo: '←', progress: '→', done: '→' };
      const currentIdx = columns.indexOf(status);

      if (currentIdx > 0) {
        const leftBtn = document.createElement('button');
        leftBtn.className = 'move-btn';
        leftBtn.textContent = '←';
        leftBtn.title = `Move to ${columns[currentIdx - 1]}`;
        leftBtn.dataset.action = 'move';
        leftBtn.dataset.direction = 'left';
        actions.appendChild(leftBtn);
      }
      if (currentIdx < columns.length - 1) {
        const rightBtn = document.createElement('button');
        rightBtn.className = 'move-btn';
        rightBtn.textContent = '→';
        rightBtn.title = `Move to ${columns[currentIdx + 1]}`;
        rightBtn.dataset.action = 'move';
        rightBtn.dataset.direction = 'right';
        actions.appendChild(rightBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.dataset.action = 'delete';
      actions.appendChild(deleteBtn);

      meta.append(priorityBadge, actions);
      card.append(title, meta);

      return card;
    }

    function addTaskToColumn(text, status = 'todo', priority = 'medium') {
      const column = board.querySelector(`[data-status="${status}"]`);
      const dropZone = column.querySelector('.task-list');
      const card = createTaskCard(text, priority, status);
      dropZone.appendChild(card);
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 300);
      updateAllCounts();
    }

    // ================================================================
    // EVENT DELEGATION (Day 5: one listener on the board)
    // ================================================================
    board.addEventListener('click', (e) => {
      const card = e.target.closest('.task-card');
      if (!card) return;

      const action = e.target.dataset.action;
      if (!action) return;

      // DELETE
      if (action === 'delete') {
        card.style.transform = 'translateX(100%) scale(0.8)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          updateAllCounts();
        }, 200);
        return;
      }

      // CYCLE PRIORITY (Day 3: classList, dataset)
      if (action === 'priority') {
        const current = card.dataset.priority;
        const nextIdx = (priorities.indexOf(current) + 1) % priorities.length;
        const next = priorities[nextIdx];
        card.dataset.priority = next;
        e.target.className = `task-priority priority-${next}`;
        e.target.textContent = next.toUpperCase();
        return;
      }

      // MOVE LEFT/RIGHT
      if (action === 'move') {
        const columns = ['todo', 'progress', 'done'];
        const currentColumn = card.closest('.column');
        const currentStatus = currentColumn.dataset.status;
        const currentIdx = columns.indexOf(currentStatus);
        const direction = e.target.dataset.direction;
        const newIdx = direction === 'left' ? currentIdx - 1 : currentIdx + 1;

        if (newIdx >= 0 && newIdx < columns.length) {
          moveCardToColumn(card, columns[newIdx]);
        }
      }
    });

    function moveCardToColumn(card, newStatus) {
      const targetColumn = board.querySelector(`[data-status="${newStatus}"]`);
      const dropZone = targetColumn.querySelector('.task-list');

      // Rebuild move buttons for new position
      const newCard = createTaskCard(
        card.querySelector('.task-title').textContent,
        card.dataset.priority,
        newStatus
      );
      newCard.dataset.id = card.dataset.id;
      newCard.dataset.created = card.dataset.created;

      card.remove();
      dropZone.appendChild(newCard);
      newCard.classList.add('highlight');
      setTimeout(() => newCard.classList.remove('highlight'), 300);
      updateAllCounts();
    }

    // ================================================================
    // ADD TASK — form input with Enter key (Day 4 & 6: keydown, forms)
    // ================================================================
    board.addEventListener('keydown', (e) => {
      const input = e.target.closest('[data-add-input]');
      if (!input) return;

      if (e.key === 'Enter') {
        const text = input.value.trim();
        if (!text) return;
        const status = input.dataset.addInput;
        addTaskToColumn(text, status);
        input.value = '';
      }
    });

    // ================================================================
    // DRAG AND DROP (Day 4: events, Day 5: propagation)
    // ================================================================
    let draggedCard = null;

    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.task-card');
      if (!card) return;
      draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    board.addEventListener('dragend', (e) => {
      if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard = null;
      }
      // Remove all drag-over states
      board.querySelectorAll('.drag-over').forEach(col => col.classList.remove('drag-over'));
    });

    board.addEventListener('dragover', (e) => {
      e.preventDefault(); // required to allow drop
      const column = e.target.closest('.column');
      if (column) column.classList.add('drag-over');
    });

    board.addEventListener('dragleave', (e) => {
      const column = e.target.closest('.column');
      if (column && !column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    board.addEventListener('drop', (e) => {
      e.preventDefault();
      const column = e.target.closest('.column');
      if (!column || !draggedCard) return;

      column.classList.remove('drag-over');
      const newStatus = column.dataset.status;
      moveCardToColumn(draggedCard, newStatus);
      draggedCard = null;
    });

    // ================================================================
    // SEARCH WITH DEBOUNCE (Day 6: debounce, input event)
    // ================================================================
    function debounce(fn, delay) {
      let timer;
      return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
    }

    const filterTasks = debounce((query) => {
      const lowerQuery = query.toLowerCase();
      board.querySelectorAll('.task-card').forEach(card => {
        const title = card.querySelector('.task-title').textContent.toLowerCase();
        const priority = card.dataset.priority;
        const matches = title.includes(lowerQuery) || priority.includes(lowerQuery);
        card.classList.toggle('hidden', !matches);
      });
    }, 200);

    searchInput.addEventListener('input', (e) => filterTasks(e.target.value));

    // ================================================================
    // KEYBOARD SHORTCUTS (Day 6: keyboard events)
    // ================================================================
    document.addEventListener('keydown', (e) => {
      // Ctrl+K → focus search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
        return;
      }

      // Escape → clear search and blur
      if (e.key === 'Escape') {
        searchInput.value = '';
        filterTasks('');
        searchInput.blur();
        return;
      }
    });

    // ================================================================
    // THEME TOGGLE (Day 3: classList, CSS variables)
    // ================================================================
    const themeBtn = document.getElementById('toggleTheme');
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });

    // ================================================================
    // STATS (Day 1: querySelector, traversal)
    // ================================================================
    const statsBar = document.getElementById('statsBar');
    const toggleStatsBtn = document.getElementById('toggleStats');

    toggleStatsBtn.addEventListener('click', () => {
      statsBar.classList.toggle('visible');
      updateAllCounts();
    });

    function updateAllCounts() {
      const columns = board.querySelectorAll('.column');
      let total = 0;

      columns.forEach(col => {
        const count = col.querySelector('.task-list').children.length;
        col.querySelector('.column-count').textContent = count;
        total += count;

        const status = col.dataset.status;
        const statEl = document.getElementById(
          `stat${status.charAt(0).toUpperCase() + status.slice(1)}`
        );
        if (statEl) statEl.textContent = count;
      });

      document.getElementById('statTotal').textContent = total;
    }

    // ================================================================
    // MUTATION OBSERVER — auto-update counts (Day 6: MutationObserver)
    // ================================================================
    const mutationObserver = new MutationObserver(() => updateAllCounts());
    board.querySelectorAll('.task-list').forEach(zone => {
      mutationObserver.observe(zone, { childList: true });
    });

    // ================================================================
    // SEED DATA
    // ================================================================
    addTaskToColumn('Set up Spring Boot project', 'todo', 'high');
    addTaskToColumn('Design database schema', 'todo', 'high');
    addTaskToColumn('Configure Stripe integration', 'todo', 'medium');
    addTaskToColumn('Build REST endpoints', 'progress', 'high');
    addTaskToColumn('Write unit tests', 'progress', 'medium');
    addTaskToColumn('Set up CI/CD pipeline', 'done', 'low');
    addTaskToColumn('Create project README', 'done', 'low');
  </script>
</body>
</html>
```

---

## Revision Checklist

Go through each concept and make sure you can answer/implement:

### Day 1 — DOM Fundamentals
- [ ] What's the difference between `querySelector` and `getElementById`?
- [ ] What's a NodeList vs HTMLCollection? Which is live?
- [ ] Navigate from a button to its grandparent without using `getElementById`

### Day 2 — DOM Manipulation
- [ ] Create a card component using only `createElement` (no innerHTML)
- [ ] What's a DocumentFragment and when do you use it?
- [ ] Three ways to clear all children of an element

### Day 3 — Attributes, Classes & Styles
- [ ] Difference between `getAttribute('value')` and `input.value`
- [ ] Toggle a class conditionally using `classList.toggle` with force
- [ ] Read a CSS variable's value from JavaScript

### Day 4 — Events Core
- [ ] `event.target` vs `event.currentTarget` — explain with an example
- [ ] What does `preventDefault` stop vs `stopPropagation`?
- [ ] `DOMContentLoaded` vs `load` — when to use each?

### Day 5 — Propagation & Delegation
- [ ] Draw the capture → target → bubble flow for a nested click
- [ ] Implement a delegated click handler for a dynamic list
- [ ] When would you use `stopImmediatePropagation` over `stopPropagation`?

### Day 6 — Advanced Patterns
- [ ] Write a debounce function from scratch
- [ ] Use `FormData` to extract all form values as an object
- [ ] Set up an IntersectionObserver for lazy loading images

---

## What's Next?

Once you're comfortable with raw DOM APIs, you'll appreciate what React abstracts:

| Raw DOM                     | React Equivalent              |
|-----------------------------|-------------------------------|
| `createElement` + `append`  | JSX rendering                 |
| `classList.toggle`          | Conditional `className`       |
| `addEventListener`          | `onClick`, `onChange` props   |
| Event delegation            | React's synthetic event system|
| `MutationObserver`          | `useEffect` with deps        |
| Manual DOM diffing          | Virtual DOM reconciliation    |
| `debounce` + `input` event  | `useDeferredValue` / custom hook |

Understanding the raw layer makes you a better React developer — you know exactly what's happening under the abstraction.
