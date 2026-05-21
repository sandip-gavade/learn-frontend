// ==========================================
// JAVASCRIPT OPERATORS
// ==========================================

// ==========================================
// 1. ARITHMETIC OPERATORS
// ==========================================

let a = 10;
let b = 5;

console.log(a + b); // Addition -> 15
console.log(a - b); // Subtraction -> 5
console.log(a * b); // Multiplication -> 50
console.log(a / b); // Division -> 2
console.log(a % b); // Modulus -> 0
console.log(a ** b); // Power -> 100000

// ==========================================
// 2. ASSIGNMENT OPERATORS
// ==========================================

let x = 10;

x += 5;
console.log(x); // 15

x -= 2;
console.log(x); // 13

x *= 2;
console.log(x); // 26

x /= 2;
console.log(x); // 13

// ==========================================
// 3. COMPARISON OPERATORS
// ==========================================

console.log(10 == '10');

// true
// Checks only value

console.log(10 === '10');

// false
// Checks value + datatype

console.log(5 != '5');

// false

console.log(5 !== '5');

// true

console.log(10 > 5); // true
console.log(10 < 5); // false
console.log(10 >= 10); // true
console.log(5 <= 10); // true

// ==========================================
// IMPORTANT INTERVIEW QUESTION
// == vs ===
// ==========================================

/*

==
---
Loose equality
Checks only value

===
---
Strict equality
Checks value and datatype

Best Practice:
Use === always

*/

// ==========================================
// 4. LOGICAL OPERATORS
// ==========================================

let isStudent = false;
let hasID = false;

console.log(isStudent && hasID);

// true
// Both conditions must be true

console.log(isStudent || false);

// true
// Any one condition must be true

console.log(!isStudent);

// false
// Opposite value

// ==========================================
// 5. INCREMENT / DECREMENT
// ==========================================

let count = 5;

count++;

console.log(count);

// 6

count--;

console.log(count);

// 5

// ==========================================
// PRE-INCREMENT vs POST-INCREMENT
// ==========================================

let num = 10;

console.log(++num);

// First increase
// Then print
// 11

let num2 = 10;

console.log(num2++);

// First print
// Then increase
// 10

console.log(num2);

// 11

// ==========================================
// 6. TERNARY OPERATOR
// ==========================================

let age = 20;
let result3 = null;
if (age >= 18) {
  result3 = 'Adult';
} else {
  result3 = 'Minor';
}
console.log(result3);

let result = age >= 18 ? 'Adult' : 'Minor';

console.log(result);

// Adult

// ==========================================
// 7. TYPE OPERATORS
// ==========================================

console.log(typeof 'Hello');

// string

let arr = [1, 2, 3];

console.log(arr instanceof Array);

// true

// ==========================================
// 8. STRING OPERATORS
// ==========================================

let firstName = 'Sandip';
let lastName = 'Patil';

let fullName = firstName + ' ' + lastName;

console.log(fullName);

let abcd = true + false;
console.log(abcd);

// Sandip Patil

// ==========================================
// OPERATOR PRECEDENCE
// ==========================================

let result2 = 10 + 5 * 2;

console.log(result2);

// 20
// Multiplication happens first

// ==========================================
// QUICK SUMMARY
// ==========================================

/*

1. Arithmetic
+ - * / % **

2. Assignment
= += -= *=

3. Comparison
== === != !== > <

4. Logical
&& || !

5. Increment
++ --

6. Ternary
condition ? true : false

7. Type
typeof instanceof

*/
