# Day 1 — DOM Fundamentals

## What is the DOM?

The DOM (Document Object Model) is a tree-like representation of your HTML that the browser creates after parsing. Every HTML tag becomes a **node** in this tree. JavaScript doesn't interact with your HTML file directly — it interacts with this in-memory tree.

```
document
 └── html
      ├── head
      │    └── title
      │         └── "My Page" (text node)
      └── body
           ├── h1
           │    └── "Hello" (text node)
           └── p
                └── "World" (text node)
```

### Node Types

Every node has a `nodeType` property:

| nodeType | Constant               | Example               |
|----------|------------------------|-----------------------|
| 1        | `ELEMENT_NODE`         | `<div>`, `<p>`, `<a>` |
| 3        | `TEXT_NODE`            | `"Hello World"`       |
| 8        | `COMMENT_NODE`         | `<!-- comment -->`    |
| 9        | `DOCUMENT_NODE`        | `document`            |

```js
const el = document.querySelector('p');
console.log(el.nodeType);  // 1 (ELEMENT_NODE)
console.log(el.nodeName);  // "P"

const text = el.firstChild;
console.log(text.nodeType); // 3 (TEXT_NODE)
console.log(text.nodeValue); // the text content
```

---

## Selecting Elements

### getElementById — fastest, selects by `id`

```html
<div id="app">Hello</div>
```

```js
const app = document.getElementById('app');
console.log(app.textContent); // "Hello"
```

- Returns a **single element** (or `null`).
- IDs should be unique in a page.

### querySelector — CSS selector, returns first match

```html
<ul>
  <li class="item">Apple</li>
  <li class="item active">Banana</li>
  <li class="item">Cherry</li>
</ul>
```

```js
// First element matching the selector
const active = document.querySelector('.item.active');
console.log(active.textContent); // "Banana"

// You can use any valid CSS selector
const firstLi = document.querySelector('ul > li:first-child');
console.log(firstLi.textContent); // "Apple"
```

### querySelectorAll — returns ALL matches as a NodeList

```js
const items = document.querySelectorAll('.item');
console.log(items.length); // 3

// NodeList is NOT an array, but is iterable
items.forEach(item => console.log(item.textContent));

// Convert to array if you need array methods
const arr = Array.from(items);
const texts = arr.map(el => el.textContent);
```

### getElementsByClassName / getElementsByTagName — live collections

```js
const items = document.getElementsByClassName('item');
console.log(items.length); // 3

// KEY DIFFERENCE: this is a LIVE HTMLCollection
// If you add/remove elements with class "item", this updates automatically

const allDivs = document.getElementsByTagName('div');
// Also live — reflects current DOM state
```

**Live vs Static:**

```js
const liveList = document.getElementsByClassName('item');   // LIVE
const staticList = document.querySelectorAll('.item');       // STATIC (snapshot)

// If you remove an element with class "item" from the DOM:
// liveList.length decreases immediately
// staticList.length stays the same (it was a snapshot)
```

---

## Traversing the DOM

Once you have a reference to a node, you can walk up, down, or sideways.

### All-node traversal (includes text & comment nodes)

```html
<div id="parent">
  <span>First</span>
  <span>Second</span>
</div>
```

```js
const parent = document.getElementById('parent');

// Includes text nodes (whitespace between tags!)
console.log(parent.childNodes.length);  // 5 (text, span, text, span, text)
console.log(parent.firstChild);         // #text (whitespace)
console.log(parent.lastChild);          // #text (whitespace)
```

### Element-only traversal (what you usually want)

```js
const parent = document.getElementById('parent');

console.log(parent.children.length);        // 2 (only the <span> elements)
console.log(parent.firstElementChild);       // <span>First</span>
console.log(parent.lastElementChild);        // <span>Second</span>

const first = parent.firstElementChild;
console.log(first.nextElementSibling);       // <span>Second</span>
console.log(first.nextElementSibling.previousElementSibling); // <span>First</span>

// Going up
console.log(first.parentElement);            // <div id="parent">
```

### Quick reference

| Need              | All Nodes             | Elements Only              |
|-------------------|-----------------------|----------------------------|
| Children          | `childNodes`          | `children`                 |
| First child       | `firstChild`          | `firstElementChild`        |
| Last child        | `lastChild`           | `lastElementChild`         |
| Next sibling      | `nextSibling`         | `nextElementSibling`       |
| Previous sibling  | `previousSibling`     | `previousElementSibling`   |
| Parent            | `parentNode`          | `parentElement`            |

### closest() — find nearest ancestor matching a selector

```html
<div class="card">
  <div class="card-body">
    <button class="btn">Click</button>
  </div>
</div>
```

```js
const btn = document.querySelector('.btn');

// Walk UP the tree to find the nearest .card ancestor
const card = btn.closest('.card');
console.log(card); // <div class="card">

// Returns null if no match
const form = btn.closest('form');
console.log(form); // null
```

---

## Practical Exercise

Build this in your browser console or a simple HTML file:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="container">
    <h2>Products</h2>
    <ul id="product-list">
      <li class="product" data-price="299">Phone</li>
      <li class="product" data-price="999">Laptop</li>
      <li class="product" data-price="199">Tablet</li>
    </ul>
  </div>

  <script>
    // 1. Select by ID
    const list = document.getElementById('product-list');

    // 2. Select all products
    const products = list.querySelectorAll('.product');

    // 3. Loop and read data
    products.forEach(p => {
      console.log(`${p.textContent}: ₹${p.dataset.price}`);
    });

    // 4. Traverse: get the heading sibling
    const heading = list.previousElementSibling;
    console.log(heading.textContent); // "Products"

    // 5. Go up to container
    const container = list.parentElement;
    console.log(container.id); // "container"

    // 6. Find the expensive product
    const expensive = document.querySelector('.product[data-price="999"]');
    console.log(expensive.textContent); // "Laptop"
  </script>
</body>
</html>
```

---

## Key Takeaways

1. The DOM is a **tree of nodes** — not your HTML file.
2. Use `querySelector` / `querySelectorAll` for most selections — they accept any CSS selector.
3. Prefer **element-only** traversal (`children`, `firstElementChild`, etc.) to avoid whitespace text nodes.
4. `querySelectorAll` returns a **static** NodeList; `getElementsBy*` returns a **live** HTMLCollection.
5. `closest()` is incredibly useful for walking up the tree — you'll use it heavily with event delegation (Day 5).
