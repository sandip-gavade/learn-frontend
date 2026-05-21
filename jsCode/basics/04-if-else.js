// ==========================================
// JAVASCRIPT IF ELSE
// ==========================================


// ------------------------------------------
// Basic if condition
// ------------------------------------------

let age = 20;

if (age >= 18) {
    console.log("You can vote");
}

// Output:
// You can vote


// ------------------------------------------
// if else
// ------------------------------------------

let marks = 35;

if (marks >= 40) {
    console.log("Pass");
} else {
    console.log("Fail");
}

// Output:
// Fail


// ------------------------------------------
// if else if else
// ------------------------------------------

let score = 85;

if (score >= 90) {
    console.log("Grade A");
} else if (score >= 75) {
    console.log("Grade B");
} else if (score >= 50) {
    console.log("Grade C");
} else {
    console.log("Fail");
}

// Output:
// Grade B


// ------------------------------------------
// Multiple conditions using AND
// ------------------------------------------

let hasID = true;
let hasTicket = true;

if (hasID && hasTicket) {
    console.log("Entry Allowed");
} else {
    console.log("Entry Denied");
}

// Output:
// Entry Allowed


// ------------------------------------------
// Multiple conditions using OR
// ------------------------------------------

let isAdmin = false;
let isManager = true;

if (isAdmin || isManager) {
    console.log("Access Granted");
}

// Output:
// Access Granted


// ------------------------------------------
// Nested if
// ------------------------------------------

let userAge = 25;
let citizenship = "Indian";

if (userAge >= 18) {

    if (citizenship === "Indian") {
        console.log("Eligible to vote");
    }

}

// Output:
// Eligible to vote


// ------------------------------------------
// Truthy and Falsy values
// ------------------------------------------

let username = "";

if (username) {
    console.log("Username exists");
} else {
    console.log("Username is empty");
}

// Output:
// Username is empty


// ------------------------------------------
// Falsy values in JavaScript
// ------------------------------------------

/*

false
0
""
null
undefined
NaN

Everything else is truthy

*/


// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

if
---
Runs block if condition is true

else
-----
Runs when condition is false

else if
--------
Checks multiple conditions

Best Practice
--------------
Use === instead of ==

*/