# Day 2 — DOM Manipulation

## Creating Elements

The browser gives you factory methods to build new nodes from scratch.

### createElement + createTextNode

```js
// Create an element node
const div = document.createElement('div');
// At this point, it exists in memory but is NOT in the page

// Create a text node
const text = document.createTextNode('Hello World');

// Combine them
div.appendChild(text);

// Now div looks like: <div>Hello World</div>
// But still not on the page — you need to insert it into the DOM
```

### Setting content before inserting

```js
const card = document.createElement('div');
card.className = 'card';              // set class
card.id = 'user-card';                // set id
card.textContent = 'Sandip';          // set text (safe, no HTML parsing)

// vs innerHTML (parses HTML — use cautiously)
card.innerHTML = '<strong>Sandip</strong> <span>Developer</span>';
```

**textContent vs innerHTML:**

```js
const el = document.createElement('div');

// textContent — treats everything as plain text (SAFE)
el.textContent = '<script>alert("xss")</script>';
// Renders literally as: <script>alert("xss")</script>

// innerHTML — parses as HTML (XSS risk with user input)
el.innerHTML = '<strong>Bold</strong>';
// Renders as: Bold (with actual bold formatting)
```

**Rule of thumb:** Use `textContent` for user-generated content. Use `innerHTML` only with trusted/hardcoded markup.

---

## Inserting Elements

### appendChild — adds to the END of parent's children

```html
<ul id="list">
  <li>Item 1</li>
</ul>
```

```js
const list = document.getElementById('list');
const newItem = document.createElement('li');
newItem.textContent = 'Item 2';

list.appendChild(newItem);
// Result: <ul><li>Item 1</li><li>Item 2</li></ul>
```

### insertBefore — insert before a specific child

```js
const list = document.getElementById('list');
const newItem = document.createElement('li');
newItem.textContent = 'Item 0';

const firstItem = list.firstElementChild;
list.insertBefore(newItem, firstItem);
// Result: <ul><li>Item 0</li><li>Item 1</li><li>Item 2</li></ul>
```

### Modern methods: append, prepend, before, after

These are newer, cleaner, and accept multiple arguments including strings.

```js
const list = document.getElementById('list');

// prepend — add to the BEGINNING (inside the parent)
const first = document.createElement('li');
first.textContent = 'First!';
list.prepend(first);

// append — add to the END (like appendChild but more flexible)
list.append('plain text works too'); // appends a text node

// before — insert BEFORE the element (as a sibling)
const heading = document.createElement('h3');
heading.textContent = 'My List';
list.before(heading);
// heading appears right before <ul> in the DOM

// after — insert AFTER the element (as a sibling)
const footer = document.createElement('p');
footer.textContent = 'End of list';
list.after(footer);
// footer appears right after </ul> in the DOM
```

**Difference summary:**

| Method         | Where it inserts          | Inside or outside? |
|----------------|---------------------------|--------------------|
| `appendChild`  | End of children           | Inside             |
| `prepend`      | Start of children         | Inside             |
| `append`       | End of children           | Inside             |
| `insertBefore` | Before a reference child  | Inside             |
| `before`       | Before the element itself | Outside (sibling)  |
| `after`        | After the element itself  | Outside (sibling)  |

---

## Removing Elements

### remove() — modern, self-removal

```js
const item = document.querySelector('.item');
item.remove();
// Gone from the DOM. The variable still holds a reference to the detached node.
```

### removeChild — older, called on parent

```js
const list = document.getElementById('list');
const firstItem = list.firstElementChild;
list.removeChild(firstItem);
```

### Clearing all children

```js
const list = document.getElementById('list');

// Method 1: Simple and fast
list.innerHTML = '';

// Method 2: Loop removal (if you need to do cleanup per child)
while (list.firstChild) {
  list.removeChild(list.firstChild);
}

// Method 3: Modern
list.replaceChildren(); // removes all children
```

---

## Replacing Elements

### replaceChild — old way

```js
const list = document.getElementById('list');
const oldItem = list.firstElementChild;

const newItem = document.createElement('li');
newItem.textContent = 'Replaced!';

list.replaceChild(newItem, oldItem);
```

### replaceWith — modern, cleaner

```js
const oldItem = document.querySelector('.item');
const newItem = document.createElement('li');
newItem.textContent = 'Replaced!';

oldItem.replaceWith(newItem);
```

---

## Cloning Elements

### cloneNode

```html
<div id="template" class="card">
  <h3>Title</h3>
  <p>Description</p>
</div>
```

```js
const template = document.getElementById('template');

// Shallow clone — only the element itself, no children
const shallow = template.cloneNode(false);
console.log(shallow.innerHTML); // "" (empty)

// Deep clone — element + all descendants
const deep = template.cloneNode(true);
console.log(deep.innerHTML); // "<h3>Title</h3><p>Description</p>"

// Modify the clone (it's independent of the original)
deep.id = 'card-1';
deep.querySelector('h3').textContent = 'New Card';

document.body.appendChild(deep);
```

---

## DocumentFragment — batch DOM updates

When you need to insert many elements, each `appendChild` triggers a potential reflow. Use a `DocumentFragment` as a lightweight container.

```js
const list = document.getElementById('list');
const fragment = document.createDocumentFragment();

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

fruits.forEach(fruit => {
  const li = document.createElement('li');
  li.textContent = fruit;
  fragment.appendChild(li);  // No reflow, fragment is in memory
});

list.appendChild(fragment);  // Single DOM update — all 5 items inserted at once
// The fragment itself disappears; only its children are inserted
```

---

## Practical Exercise — Build a Card List Without innerHTML

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .card { border: 1px solid #ccc; padding: 16px; margin: 8px; border-radius: 8px; }
    .card h3 { margin: 0 0 8px; }
    .card .price { color: green; font-weight: bold; }
    .card .delete-btn { margin-top: 8px; cursor: pointer; color: red; }
  </style>
</head>
<body>
  <div id="app"></div>

  <script>
    const products = [
      { name: 'Phone', price: 299 },
      { name: 'Laptop', price: 999 },
      { name: 'Tablet', price: 199 },
      { name: 'Watch', price: 149 },
    ];

    const app = document.getElementById('app');

    // Create heading
    const heading = document.createElement('h1');
    heading.textContent = 'Product Catalog';
    app.appendChild(heading);

    // Build all cards using a fragment
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
      // Create card container
      const card = document.createElement('div');
      card.className = 'card';

      // Title
      const title = document.createElement('h3');
      title.textContent = product.name;

      // Price
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = `₹${product.price}`;

      // Delete button
      const btn = document.createElement('button');
      btn.className = 'delete-btn';
      btn.textContent = 'Remove';
      btn.addEventListener('click', () => card.remove());

      // Assemble
      card.append(title, price, btn);
      fragment.appendChild(card);
    });

    app.appendChild(fragment);
  </script>
</body>
</html>
```

---

## Key Takeaways

1. `createElement` + `textContent` is the safest way to build DOM nodes.
2. Prefer modern insertion methods (`append`, `prepend`, `before`, `after`) — they're cleaner and accept strings.
3. `remove()` is self-removal; no need to go through the parent.
4. `cloneNode(true)` deep-clones an element — useful for template patterns.
5. Use `DocumentFragment` when inserting many elements to minimize reflows.
6. **Never use `innerHTML` with user input** — it's an XSS vector.
