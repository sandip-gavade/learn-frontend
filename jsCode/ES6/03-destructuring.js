// ============================================================
//  03 — DESTRUCTURING
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Destructuring lets you unpack values from arrays or properties
// from objects into individual variables. It's much cleaner
// than accessing each property one by one.

// ─── JAVASCRIPT BASICS — OBJECTS ────────────────────────────

// 1. Basic object destructuring
const user = {
  name: 'Amit',
  age: 26,
  city: 'Pune',
  skills: ['React', 'Node'],
};

// Without destructuring — repetitive
const name1 = user.name;
const age1 = user.age;

// With destructuring — pull out what you need
const { name, age, city } = user;
console.log(name); // "Amit"
console.log(city); // "Pune"

// 2. Rename while destructuring
const { name: userName, age: userAge } = user;
console.log(userName); // "Amit"
console.log(userAge); // 26

// 3. Default values
const { name: n, country = 'India' } = user;
console.log(country); // "India" (doesn't exist, so default kicks in)

// 4. Nested destructuring
const company = {
  companyName: 'TechCo',
  address: {
    city: 'Mumbai',
    pin: '400001',
  },
};
const {
  address: { city: companyCity, pin },
} = company;
console.log(companyCity); // "Mumbai"
console.log(pin); // "400001"

// ─── JAVASCRIPT BASICS — ARRAYS ─────────────────────────────

// 5. Basic array destructuring — by position
const rgb = [255, 128, 0];
const [red, green, blue] = rgb;
console.log(red); // 255
console.log(green); // 128
console.log(blue); // 0

// 6. Skip values with commas
const [first, , third] = [10, 20, 30];
console.log(first); // 10
console.log(third); // 30

// 7. Rest pattern — collect remaining items
const [head, second, ...rest] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(second);
console.log(rest); // [2, 3, 4, 5]

// 8. Swap variables — classic interview trick
let a = 1,
  b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1

// 9. Destructuring in function parameters
const printUser = ({ name, age }) => {
  console.log(`${name} is ${age} years old`);
};
printUser(user); // "Amit is 26 years old"

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Props destructuring — you'll do this in EVERY component
//
//    // WITHOUT destructuring — ugly and repetitive
//    const Profile = (props) => {
//      return (
//        <div>
//          <h2>{props.name}</h2>
//          <p>{props.email}</p>
//          <p>{props.role}</p>
//        </div>
//      );
//    };
//
//    // WITH destructuring — the standard way
//    const Profile = ({ name, email, role }) => (
//      <div>
//        <h2>{name}</h2>
//        <p>{email}</p>
//        <p>{role}</p>
//      </div>
//    );

// B. useState — THIS IS ARRAY DESTRUCTURING!
//
//    const [count, setCount] = useState(0);
//
//    // What's actually happening:
//    // const stateArray = useState(0);  // returns [0, function]
//    // const count = stateArray[0];     // the value
//    // const setCount = stateArray[1];  // the setter function
//
//    // Array destructuring lets you name them whatever you want:
//    const [email, setEmail] = useState("");
//    const [isOpen, setIsOpen] = useState(false);
//    const [items, setItems] = useState([]);

// C. Destructuring API response
//
//    const UserProfile = () => {
//      const [user, setUser] = useState(null);
//
//      useEffect(() => {
//        fetch("/api/user/1")
//          .then(res => res.json())
//          .then(data => {
//            const { name, email, avatar } = data;
//            setUser({ name, email, avatar });
//          });
//      }, []);
//
//      return user ? <h2>{user.name}</h2> : <p>Loading...</p>;
//    };

// D. Destructuring event object
//
//    const handleChange = (e) => {
//      const { name, value } = e.target;
//      setForm(prev => ({ ...prev, [name]: value }));
//    };

// ─── PRACTICE EXERCISES ─────────────────────────────────────

// 1. Destructure to get title and year
const movie = { title: 'RRR', year: 2022, rating: 8.0 };

// 2. Destructure the first two scores
const scores = [98, 85, 72, 91];

// 3. Destructure nested — get customer's name as customerName
const order = {
  id: 101,
  customer: { name: 'Ravi', phone: '9876543210' },
};

// 4. Write a function that takes an object { x, y } and
//    returns the distance from origin: Math.sqrt(x*x + y*y)
//    Use destructuring in the parameter.

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const { title, year } = movie;

// 2.
const [first, second] = scores;

// 3.
const { customer: { name: customerName } } = order;

// 4.
const distanceFromOrigin = ({ x, y }) => Math.sqrt(x * x + y * y);
console.log(distanceFromOrigin({ x: 3, y: 4 })); // 5

*/
