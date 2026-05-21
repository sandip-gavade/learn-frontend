// ==========================================
// JAVASCRIPT TERNARY OPERATOR
// ==========================================


// Syntax
// condition ? trueValue : falseValue


// ------------------------------------------
// Basic Example
// ------------------------------------------

let age = 20;

let result = age >= 18 ? "Adult" : "Minor";

console.log(result);

// Output:
// Adult


// ------------------------------------------
// if else vs ternary
// ------------------------------------------

// Normal if else

let marks = 70;

if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}


// Same using ternary

let output = marks >= 40 ? "Pass" : "Fail";

console.log(output);


// ------------------------------------------
// Store value in variable
// ------------------------------------------

let isLoggedIn = true;

let message = isLoggedIn
    ? "Welcome User"
    : "Please Login";

console.log(message);

// Output:
// Welcome User


// ------------------------------------------
// Ternary inside console.log
// ------------------------------------------

let number = 5;

console.log(
    number % 2 === 0
        ? "Even"
        : "Odd"
);

// Output:
// Odd


// ------------------------------------------
// Multiple ternary operators
// ------------------------------------------

let score = 90;

let grade =
    score >= 90 ? "A" :
    score >= 75 ? "B" :
    score >= 50 ? "C" :
    "Fail";

console.log(grade);

// Output:
// A


// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

Ternary Operator
----------------
Short form of if else

Syntax
------
condition ? trueValue : falseValue

Advantages
-----------
1. Short code
2. Cleaner syntax
3. Easy for simple conditions

Disadvantages
--------------
Avoid deeply nested ternary operators

*/