// ==========================================
// JAVASCRIPT DO WHILE LOOP
// ==========================================

// Syntax
/*
do {

}
while(condition);
*/

// ------------------------------------------
// Basic do while
// ------------------------------------------

let i = 1;

do {
  console.log(i);

  i++;
} while (i <= 5);

// Output:
// 1 2 3 4 5

// ------------------------------------------
// Difference between while and do while
// ------------------------------------------

let number = 10;

do {
  console.log(number);

  number++;
} while (number <= 5);

// Output:
// 10

// Runs at least one time

// ------------------------------------------
// Menu driven example
// ------------------------------------------

let choice = 1;

do {
  console.log('1. Add');
  console.log('2. Delete');
  console.log('3. Exit');

  choice++;
} while (choice <= 3);

// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

while
------
Checks condition first

do while
---------
Executes first
Checks condition later

Important
-----------
do while runs at least once

*/
