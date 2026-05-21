// ==========================================
// JAVASCRIPT ARRAYS
// ==========================================


// Array
// ------
// Collection of multiple values


// ==========================================
// 1. Creating Array
// ==========================================

let fruits = ["Apple", "Mango", "Banana"];

console.log(fruits);

// Output:
// [ 'Apple', 'Mango', 'Banana' ]


// ==========================================
// 2. Access Array Elements
// ==========================================

console.log(fruits[0]);
console.log(fruits[1]);

// Output:
// Apple
// Mango


// ==========================================
// 3. Update Array Element
// ==========================================

fruits[1] = "Orange";

console.log(fruits);

// Output:
// [ 'Apple', 'Orange', 'Banana' ]


// ==========================================
// 4. Array Length
// ==========================================

console.log(fruits.length);

// Output:
// 3


// ==========================================
// 5. Array with Different Datatypes
// ==========================================

let data = [
    "Sandip",
    28,
    true,
    null
];

console.log(data);


// ==========================================
// 6. Loop Through Array
// ==========================================

let numbers = [10, 20, 30];

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}


// ==========================================
// 7. Nested Array
// ==========================================

let matrix = [
    [1, 2],
    [3, 4]
];

console.log(matrix[0][1]);

// Output:
// 2


// ==========================================
// 8. Array Destructuring
// ==========================================

let colors = ["Red", "Blue", "Green"];

let [first, second] = colors;

console.log(first);
console.log(second);

// Output:
// Red
// Blue


// ==========================================
// 9. Spread Operator
// ==========================================

let arr1 = [1, 2];
let arr2 = [...arr1, 3, 4];

console.log(arr2);

// Output:
// [1, 2, 3, 4]


// ==========================================
// INTERVIEW NOTES
// ==========================================

/*

Array
------
Ordered collection

Index starts from 0

Arrays are objects in JavaScript

typeof []
----------
object

*/