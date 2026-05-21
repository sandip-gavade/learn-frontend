// ==========================================
// JAVASCRIPT ARRAY METHODS
// ==========================================

let fruits = ["Apple", "Mango", "Banana"];


// ==========================================
// 1. push()
// Add element at end
// ==========================================

fruits.push("Orange");

console.log(fruits);

// Output:
// [ 'Apple', 'Mango', 'Banana', 'Orange' ]


// ==========================================
// 2. pop()
// Remove last element
// ==========================================

fruits.pop();

console.log(fruits);

// Output:
// [ 'Apple', 'Mango', 'Banana' ]


// ==========================================
// 3. unshift()
// Add element at beginning
// ==========================================

fruits.unshift("Grapes");

console.log(fruits);


// ==========================================
// 4. shift()
// Remove first element
// ==========================================

fruits.shift();

console.log(fruits);


// ==========================================
// 5. includes()
// Check value exists or not
// ==========================================

console.log(
    fruits.includes("Apple")
);

// true


// ==========================================
// 6. indexOf()
// Find index
// ==========================================

console.log(
    fruits.indexOf("Mango")
);

// 1


// ==========================================
// 7. join()
// Convert array to string
// ==========================================

let result = fruits.join("-");

console.log(result);

// Apple-Mango-Banana


// ==========================================
// 8. reverse()
// Reverse array
// ==========================================

let nums = [1, 2, 3];

nums.reverse();

console.log(nums);

// [3, 2, 1]


// ==========================================
// 9. sort()
// Sort array
// ==========================================

let numbers = [4, 2, 8, 1];

numbers.sort();

console.log(numbers);

// Wrong for numbers
// [1, 2, 4, 8]


// Correct numeric sorting

numbers.sort((a, b) => a - b);

console.log(numbers);


// ==========================================
// 10. slice()
// Returns selected portion
// ==========================================

let items = ["A", "B", "C", "D"];

let newItems = items.slice(1, 3);

console.log(newItems);

// [ 'B', 'C' ]


// ==========================================
// 11. splice()
// Add/remove elements
// ==========================================

let cities = ["Delhi", "Mumbai", "Pune"];

cities.splice(1, 1);

console.log(cities);

// [ 'Delhi', 'Pune' ]


// ==========================================
// INTERVIEW NOTES
// ==========================================

/*

push()
-------
Add at end

pop()
------
Remove from end

shift()
--------
Remove from beginning

unshift()
----------
Add at beginning

slice()
--------
Does NOT modify original array

splice()
---------
Modifies original array

*/