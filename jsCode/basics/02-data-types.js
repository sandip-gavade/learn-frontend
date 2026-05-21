// ==========================================
// JAVASCRIPT DATA TYPES
// ==========================================

// JavaScript has 2 categories:
// 1. Primitive
// 2. Non-Primitive

// ==========================================
// PRIMITIVE DATA TYPES
// ==========================================

// ------------------------------------------
// 1. String
// ------------------------------------------

let name = 'Sandip';

console.log(name);
console.log(typeof name);

// Output:
// Sandip
// string

// ------------------------------------------
// 2. Number
// ------------------------------------------

let age = 28;
let salary = 50000.75;

console.log(typeof age);
console.log(typeof salary);

// Output:
// number
// number

// ------------------------------------------
// 3. Boolean
// ------------------------------------------

let isLoggedIn = true;

console.log(typeof isLoggedIn);

// Output:
// boolean

// ------------------------------------------
// 4. Undefined
// ------------------------------------------

let city;

console.log(city);
console.log(typeof city);

// Output:
// undefined
// undefined

// ------------------------------------------
// 5. Null
// ------------------------------------------

let phone = null;

console.log(phone);
console.log(typeof phone);

// Output:
// null
// object (JavaScript bug)

// ------------------------------------------
// 6. BigInt
// ------------------------------------------

let bigNumber = 12345678901234567890n;

console.log(typeof bigNumber);

// Output:
// bigint

// ------------------------------------------
// 7. Symbol
// ------------------------------------------

let id = Symbol('javascript');
console.log(id);
console.log(typeof id);

// Output:
// symbol

// ==========================================
// NON-PRIMITIVE DATA TYPES
// ==========================================

// ------------------------------------------
// 1. Object
// ------------------------------------------

let student = {
  name: 'Sandip',
  age: 28,
};

console.log(student);
console.log(typeof student);

// Output:
// object

// ------------------------------------------
// 2. Array
// ------------------------------------------

let fruits = ['Apple', 'Mango', 'Banana'];

let animals = ['tiger', 'bufello', 10];
console.log(animals);
console.log(typeof animals);

// Output:
// object

// ------------------------------------------
// 3. Function
// ------------------------------------------

function greet() {
  console.log('Hello');
}

console.log(typeof greet);

// Output:
// function

// ==========================================
// INTERVIEW QUESTIONS
// ==========================================

// ------------------------------------------
// Difference between null and undefined
// ------------------------------------------

/*

undefined
-----------
Variable declared but no value assigned

null
------
Intentional empty value

*/

// ------------------------------------------
// Primitive vs Non-Primitive
// ------------------------------------------

/*

Primitive
-----------
Stored by value

Examples:
string
number
boolean

Non-Primitive
--------------
Stored by reference

Examples:
object
array
function

*/

// ==========================================
// typeof examples
// ==========================================

console.log(typeof 'Hello'); // string
console.log(typeof 100); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined
console.log(typeof null); // object
console.log(typeof {}); // object
console.log(typeof []); // object
console.log(typeof function () {}); // function
