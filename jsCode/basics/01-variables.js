// ==========================================
// JAVASCRIPT VARIABLES
// var vs let vs const
// ==========================================

// ------------------------------------------
// 1. var
// ------------------------------------------

// var can be re-declared
var studentName = 'Sandip';
console.log(studentName);

var studentName = 'Rahul';
console.log(studentName);

// Output:
// Rahul

// var can be updated
var age = 25;
age = 30;

console.log(age);

// Output:
// 30

// var is function scoped
function testVar() {
  var city = 'Bangalore';
  console.log(city);
}

testVar();

console.log(city);
// Error because city is inside function

// var has hoisting behavior
console.log(company);

var company = 'Google';

// Output:
// undefined

// Variable declaration moves to top
// But value assignment does not

// ------------------------------------------
// 2. let
// ------------------------------------------

// let cannot be re-declared in same scope

let course = 'JavaScript';

// let course = "React";
// Error

// let can be updated
let marks = 80;

marks = 95;

console.log(marks);

// Output:
// 95

// let is block scoped
{
  let message = 'Hello';
  console.log(message);
}

// console.log(message);
// Error

// let has temporal dead zone
console.log(price);

var price = 500;

// Error before declaration

// ------------------------------------------
// 3. const
// ------------------------------------------

// const must be initialized immediately
const country = 'India';

console.log(country);

// const cannot be updated
 country = "USA";
// Error

// const is block scoped
{
  const appName = 'Netflix';
  console.log(appName);
}

// ------------------------------------------
// IMPORTANT INTERVIEW QUESTION
// const object values CAN change
// ------------------------------------------

const student = {
  name: 'Sandip',
  age: 28,
};

// Updating object property is allowed
student.age = 30;

console.log(student);

// Output:
// { name: 'Sandip', age: 30 }

// But reassigning entire object is not allowed
// student = {};
// Error

// ------------------------------------------
// QUICK COMPARISON
// ------------------------------------------

/*

var
----
1. Function scoped
2. Can redeclare
3. Can update
4. Hoisted with undefined

let
----
1. Block scoped
2. Cannot redeclare
3. Can update
4. Temporal Dead Zone

const
----
1. Block scoped
2. Cannot redeclare
3. Cannot update
4. Must initialize immediately

*/

// ------------------------------------------
// BEST PRACTICE
// ------------------------------------------

/*

Use const by default
Use let when value changes
Avoid var in modern JavaScript

*/
