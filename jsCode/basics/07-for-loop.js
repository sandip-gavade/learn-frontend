// ==========================================
// JAVASCRIPT FOR LOOP
// ==========================================


// Syntax
// for(initialization; condition; increment)


// ------------------------------------------
// Basic for loop
// ------------------------------------------

for (let i = 1; i <= 5; i++) {
    console.log(i);
}

// Output:
// 1 2 3 4 5


// ------------------------------------------
// Reverse loop
// ------------------------------------------

for (let i = 5; i >= 1; i--) {
    console.log(i);
}

// Output:
// 5 4 3 2 1


// ------------------------------------------
// Print even numbers
// ------------------------------------------

for (let i = 1; i <= 10; i++) {

    if (i % 2 === 0) {
        console.log(i);
    }

}

// Output:
// 2 4 6 8 10


// ------------------------------------------
// Sum of numbers
// ------------------------------------------

let sum = 0;

for (let i = 1; i <= 5; i++) {
    sum = sum + i;
}

console.log(sum);

// Output:
// 15


// ------------------------------------------
// Loop through array
// ------------------------------------------

let fruits = ["Apple", "Mango", "Banana"];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

// Output:
// Apple
// Mango
// Banana


// ------------------------------------------
// break statement
// ------------------------------------------

for (let i = 1; i <= 10; i++) {

    if (i === 5) {
        break;
    }

    console.log(i);

}

// Output:
// 1 2 3 4


// ------------------------------------------
// continue statement
// ------------------------------------------

for (let i = 1; i <= 5; i++) {

    if (i === 3) {
        continue;
    }

    console.log(i);

}

// Output:
// 1 2 4 5


// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

for loop
---------
Used when number of iterations is known

break
------
Stops loop completely

continue
---------
Skips current iteration

*/