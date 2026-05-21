// ==========================================
// JAVASCRIPT FUNCTIONS
// ==========================================

// Function
// ---------
// A function is a reusable block of code

// ==========================================
// 1. Function Declaration
// ==========================================

function greet() {
  console.log('Hello Students');
}

greet();
console.log(typeof greet);

// Output:
// Hello Students

// ==========================================
// 2. Function with Parameters
// ==========================================

function welcome(name) {
  console.log('Welcome ' + name);
}

welcome('Sandip');
welcome('Rahul');

// Output:
// Welcome Sandip
// Welcome Rahul

// ==========================================
// 3. Function with Return Value
// ==========================================

function add(a, b) {
  return a + b;
}

let result = add(10, 20);

console.log(result);

// Output:
// 30

// ==========================================
// 4. Function Expression
// ==========================================

const multiply = function (a, b) {
  return a * b;
};

console.log(multiply(5, 2));

// Output:
// 10

// ==========================================
// 5. Arrow Function
// ==========================================

const subtract = (a, b) => {
  return a - b;
};

console.log(typeof subtract);
console.log(subtract(20, 5));

// Output:
// 15

// Short arrow function

const square = (num) => num * num;

console.log(square(5));

// Output:
// 25

// ==========================================
// 6. Default Parameters
// ==========================================

function login(username = 'Guest') {
  console.log('Hello ' + username);
}

login();
login('Sandip');

// Output:
// Hello Guest
// Hello Sandip

// ==========================================
// 7. Function Calling Another Function
// ==========================================

function first() {
  console.log('First Function');
}

function second() {
  first();
  console.log('Second Function');
}

second();

// ==========================================
// 8. Anonymous Function
// ==========================================

setTimeout(function () {
  console.log('Executed after 2 seconds');
}, 2000);

// ==========================================
// 9. Callback Function
// ==========================================

function processUser(name, callback) {
  console.log('Processing ' + name);

  callback();
}

function completed() {
  console.log('Completed');
}

processUser(123, completed);

// ==========================================
// INTERVIEW QUESTIONS
// ==========================================

// ------------------------------------------
// Difference between parameters and arguments
// ------------------------------------------

/*

Parameters
-----------
Variables in function definition

Arguments
----------
Actual values passed to function

*/

// ------------------------------------------
// Why use functions?
// ------------------------------------------

/*

1. Reusability
2. Cleaner code
3. Easy maintenance
4. Avoid repetition

*/

// ------------------------------------------
// Function Types
// ------------------------------------------

/*

1. Function Declaration
2. Function Expression
3. Arrow Function
4. Anonymous Function
5. Callback Function

*/

// ==========================================
// BEST PRACTICE
// ==========================================

/*

Use meaningful function names

Bad:
function x(){}

Good:
function calculateTotal(){}

*/
