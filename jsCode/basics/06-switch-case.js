// ==========================================
// JAVASCRIPT SWITCH CASE
// ==========================================


// ------------------------------------------
// Basic switch case
// ------------------------------------------

let day = 3;

switch (day) {

    case 1:
        console.log("Monday");
        break;

    case 2:
        console.log("Tuesday");
        break;

    case 3:
        console.log("Wednesday");
        break;

    case 4:
        console.log("Thursday");
        break;

    default:
        console.log("Invalid Day");

}

// Output:
// Wednesday


// ------------------------------------------
// Switch with string
// ------------------------------------------

let role = "admin";

switch (role) {

    case "admin":
        console.log("Full Access");
        break;

    case "manager":
        console.log("Limited Access");
        break;

    case "employee":
        console.log("Basic Access");
        break;

    default:
        console.log("No Access");

}

// Output:
// Full Access


// ------------------------------------------
// Multiple cases same output
// ------------------------------------------

let fruit = "mango";

switch (fruit) {

    case "apple":
    case "mango":
    case "banana":
        console.log("Fruit Available");
        break;

    default:
        console.log("Fruit Not Available");

}

// Output:
// Fruit Available


// ------------------------------------------
// What happens without break
// ------------------------------------------

let number = 1;

switch (number) {

    case 1:
        console.log("One");

    case 2:
        console.log("Two");

    case 3:
        console.log("Three");

}

// Output:
// One
// Two
// Three

// This is called fall-through


// ------------------------------------------
// Interview Notes
// ------------------------------------------

/*

switch
-------
Alternative to multiple if else

break
------
Stops execution

default
--------
Runs if no case matches

Best Use Case
--------------
Menu systems
Role handling
Day/month handling

*/