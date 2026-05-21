// ==========================================
// JAVASCRIPT WHILE LOOP
// ==========================================


// Syntax
// while(condition)


// ------------------------------------------
// Basic while loop
// ------------------------------------------

let i = 1;

while (i <= 5) {

    console.log(i);

    i++;
}

// Output:
// 1 2 3 4 5


// ------------------------------------------
// Reverse while loop
// ------------------------------------------

let number = 5;

while (number >= 1) {

    console.log(number);

    number--;
}

// Output:
// 5 4 3 2 1


// ------------------------------------------
// Sum of numbers
// ------------------------------------------

let count = 1;
let sum = 0;

while (count <= 5) {

    sum = sum + count;

    count++;
}

console.log(sum);

// Output:
// 15


// ------------------------------------------
// Infinite loop example
// ------------------------------------------

/*

let x = 1;

while(x <= 5){
    console.log(x);
}

No increment
Infinite loop

*/


// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

while loop
-----------
Used when number of iterations is unknown

Condition checked first

*/