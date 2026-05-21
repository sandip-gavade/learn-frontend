// ==========================================
// JAVASCRIPT SCOPE
// ==========================================

// Scope
// ------
// Scope decides where variables
// can be accessed in the program

// JavaScript has mainly 3 scopes

/*
1. Global Scope
2. Function Scope
3. Block Scope
*/

// ==========================================
// 1. GLOBAL SCOPE
// ==========================================

// Variable declared outside all functions
// and blocks is called global scope

let company = 'Google';

function showCompany() {
  console.log(company);
}

showCompany();

console.log(company);

// Output:
// Google
// Google

// Global variables can be accessed
// anywhere in the program

// ------------------------------------------
// Problem with global variables
// ------------------------------------------

/*

Too many global variables can:

1. Create conflicts
2. Override values accidentally
3. Make debugging difficult

*/

// ==========================================
// 2. FUNCTION SCOPE
// ==========================================

// Variables declared with var inside
// a function are function scoped

function testFunctionScope() {
  var message = 'Inside Function';

  console.log(message);
}

testFunctionScope();

// Output:
// Inside Function

//console.log(message);
// Error

// message cannot be accessed outside function

// ------------------------------------------
// Example
// ------------------------------------------

function calculateTotal() {
  let total = 500;

  console.log(total);
}

calculateTotal();

// console.log(total);
// Error

// ==========================================
// 3. BLOCK SCOPE
// ==========================================

// Variables declared using let and const
// are block scoped

{
  let city = 'Bangalore';

  console.log(city);
}

console.log(city);
// Error

// const is also block scoped

{
  const country = 'India';

  console.log(country);
}

// console.log(country);
// Error

// ------------------------------------------
// var is NOT block scoped
// ------------------------------------------

{
  var age = 12;
}

console.log(age);

// Output:
// 25

// Because var ignores block scope

// ==========================================
// INTERVIEW QUESTION
// var vs let vs const scope
// ==========================================

/*

var
----
Function scoped

let
----
Block scoped

const
------
Block scoped

*/

// ==========================================
// SHADOWING
// ==========================================

// Inner variable overrides outer variable

let username = 'Global User';

function testShadowing() {
  let username = 'Local User';

  console.log(username);
}

testShadowing();

console.log(username);

// Output:
// Local User
// Global User

// ==========================================
// LEXICAL SCOPE
// ==========================================

// Inner function can access
// parent function variables

function outerFunction() {
  let outerVariable = 'Outer';

  function innerFunction() {
    console.log(outerVariable);
  }

  innerFunction();
}

outerFunction();

// Output:
// Outer

// ==========================================
// SCOPE CHAIN
// ==========================================

// JavaScript searches variable
// from inner scope to outer scope

let appName = 'Netflix';

function first() {
  function second() {
    console.log(appName);
  }

  second();
}

first();

// Output:
// Netflix

// ==========================================
// BEST PRACTICE
// ==========================================

/*

1. Avoid too many global variables

2. Use let and const instead of var

3. Keep variable scope as small as possible

*/

// ==========================================
// QUICK SUMMARY
// ==========================================

/*

Global Scope
-------------
Accessible everywhere

Function Scope
---------------
Accessible only inside function

Block Scope
-------------
Accessible only inside block {}

*/
