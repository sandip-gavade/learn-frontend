// ==========================================
// map(), filter(), reduce()
// ==========================================


// ==========================================
// 1. map()
// ==========================================

// map()
// ------
// Creates new array
// Transforms each element


let numbers = [1, 2, 3, 4];

let doubled = numbers.map((num) => {
    return num * 2;
});

console.log(doubled);

// Output:
// [2, 4, 6, 8]


// ------------------------------------------
// map with objects
// ------------------------------------------

let students = [
    { name: "Sandip", marks: 90 },
    { name: "Rahul", marks: 80 }
];

let names = students.map((student) => {
    return student.name;
});

console.log(names);

// Output:
// [ 'Sandip', 'Rahul' ]


// ==========================================
// 2. filter()
// ==========================================

// filter()
// ---------
// Returns matching elements


let nums = [10, 20, 30, 40];

let result = nums.filter((num) => {
    return num > 20;
});

console.log(result);

// Output:
// [30, 40]


// ------------------------------------------
// Filter even numbers
// ------------------------------------------

let values = [1, 2, 3, 4, 5, 6];

let evenNumbers = values.filter((num) => {
    return num % 2 === 0;
});

console.log(evenNumbers);

// Output:
// [2, 4, 6]


// ==========================================
// 3. reduce()
// ==========================================

// reduce()
// ---------
// Converts array into single value


let arr = [1, 2, 3, 4];

let total = arr.reduce((sum, current) => {
    return sum + current;
}, 0);

console.log(total);

// Output:
// 10


// ------------------------------------------
// Find maximum number
// ------------------------------------------

let max = arr.reduce((largest, current) => {

    if (current > largest) {
        return current;
    }

    return largest;

}, arr[0]);

console.log(max);

// Output:
// 4


// ==========================================
// REAL INTERVIEW EXAMPLES
// ==========================================


// ------------------------------------------
// map -> Add GST
// ------------------------------------------

let prices = [100, 200, 300];

let gstPrices = prices.map((price) => {
    return price + 20;
});

console.log(gstPrices);


// ------------------------------------------
// filter -> Passed students
// ------------------------------------------

let marks = [35, 80, 90, 20];

let passed = marks.filter((mark) => {
    return mark >= 40;
});

console.log(passed);


// ------------------------------------------
// reduce -> Total cart amount
// ------------------------------------------

let cart = [100, 200, 300];

let cartTotal = cart.reduce((total, amount) => {
    return total + amount;
}, 0);

console.log(cartTotal);


// ==========================================
// DIFFERENCE
// ==========================================

/*

map()
------
Transforms data

filter()
---------
Filters data

reduce()
---------
Produces single value

*/


// ==========================================
// IMPORTANT INTERVIEW QUESTION
// ==========================================

/*

map()
Returns array of SAME length

filter()
Returns array of SMALLER or SAME length

reduce()
Returns SINGLE value

*/