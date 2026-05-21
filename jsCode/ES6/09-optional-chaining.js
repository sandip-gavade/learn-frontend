// ============================================================
//  09 — OPTIONAL CHAINING (?.)
//  What it is → How it works → How it's used in React
// ============================================================

// ─── WHAT IS IT? ─────────────────────────────────────────────
// Optional chaining (?.) lets you safely access nested properties.
// If any part in the chain is null or undefined, it stops and
// returns undefined — instead of throwing a TypeError.

// ─── THE PROBLEM IT SOLVES ──────────────────────────────────

const user = {
  name: 'Anil',
  address: {
    city: 'Bangalore',
    pin: '560001',
  },
};

// This works fine
console.log(user.address.city); // "Bangalore"

// But what if address doesn't exist?
const user2 = { name: 'Raj' };

// ❌ This CRASHES:
// console.log(user2.address.city);
// TypeError: Cannot read property 'city' of undefined

// Old fix — verbose and ugly:
const cityOld = user2 && user2.address && user2.address.city;
console.log(cityOld); // undefined

// ✅ Optional chaining — clean!
const cityNew = user2?.address?.city;
console.log(cityNew); // undefined (no error!)

// ─── JAVASCRIPT BASICS ──────────────────────────────────────

// 1. Property access
const config = { db: { host: 'localhost', port: 5432 } };
console.log(config?.db?.host); // "localhost"
console.log(config?.db?.name); // undefined
console.log(config?.cache?.host); // undefined (cache doesn't exist)

// 2. Array element access
const data = {
  users: [{ name: 'A' }, { name: 'B' }],
};
console.log(data.users?.[0]?.name); // "A"
console.log(data.users?.[99]?.name); // undefined (no crash)
console.log(data.items?.[0]?.name); // undefined (items doesn't exist)

// 3. Method/function calls
const obj = {
  greet: (name) => `Hello, ${name}`,
};
console.log(obj.greet?.('Raj')); // "Hello, Raj"
console.log(obj.missing?.('Raj')); // undefined (doesn't crash)

// 4. Combined with nullish coalescing (??) for default values
//    ?. returns undefined if missing
//    ?? provides a fallback when value is null/undefined

const userName = user2?.address?.city ?? 'Unknown city';
console.log(userName); // "Unknown city"

// ?? vs ||
// ||  treats 0, "", false as falsy → replaces them
// ??  ONLY replaces null and undefined
console.log(0 || 'fallback'); // "fallback" (0 is falsy)
console.log(0 ?? 'fallback'); // 0          (0 is not null/undefined)
console.log('' || 'fallback'); // "fallback"
console.log('' ?? 'fallback'); // ""
console.log(null ?? 'fallback'); // "fallback"

// 5. Deep chain
const apiResponse = {
  data: {
    results: [{ id: 1, meta: { tags: ['react', 'js'] } }],
  },
};
const firstTag = apiResponse?.data?.results?.[0]?.meta?.tags?.[0];
console.log(firstTag); // "react"

const missingTag = apiResponse?.data?.results?.[5]?.meta?.tags?.[0];
console.log(missingTag); // undefined

// ─── HOW IT'S USED IN REACT ─────────────────────────────────

// A. Safe rendering of API data (data might be null while loading)
//
//    const UserProfile = ({ user }) => (
//      <div>
//        <h2>{user?.name ?? "Unknown"}</h2>
//        <p>{user?.address?.city ?? "City not set"}</p>
//        <p>Posts: {user?.posts?.length ?? 0}</p>
//        <p>Latest: {user?.posts?.[0]?.title ?? "No posts"}</p>
//      </div>
//    );
//
//    // Works even if user is null!
//    // <UserProfile user={null} />  → no crash

// B. Optional callback props
//
//    const SearchBar = ({ onSearch, onClear }) => {
//      const handleSubmit = (query) => {
//        onSearch?.(query);    // only call if passed
//      };
//      const handleClear = () => {
//        onClear?.();          // only call if passed
//      };
//      return <input ... />;
//    };
//
//    // Both of these work:
//    <SearchBar onSearch={handleSearch} />              // onClear is optional
//    <SearchBar onSearch={handleSearch} onClear={reset} />

// C. Safe access in useEffect / data fetching
//
//    useEffect(() => {
//      const loadUser = async () => {
//        const res = await fetch(`/api/users/${id}`);
//        const data = await res.json();
//
//        // API might return different shapes
//        setName(data?.user?.name ?? "Anonymous");
//        setAvatar(data?.user?.profile?.avatar ?? "/default.png");
//      };
//      loadUser();
//    }, [id]);

// D. Event handling safety
//
//    const handleChange = (e) => {
//      const value = e?.target?.value ?? "";
//      setInput(value);
//    };

// ─── PRACTICE EXERCISES ─────────────────────────────────────

const response = {
  data: {
    user: {
      name: 'Sneha',
      orders: [{ id: 1, items: [{ name: 'Phone', price: 15000 }] }],
    },
  },
};

// 1. Safely get the user's name (should return "Sneha")

// 2. Safely get the first order's first item name (should return "Phone")

// 3. Safely get response.data.user.preferences.theme (doesn't exist)
//    Should return undefined, NOT throw error

// 4. Same as #3, but return "light" as default if missing

// 5. Safely get the price of the 2nd order's 1st item (doesn't exist)
//    Return 0 as default

// ─── SOLUTIONS (try yourself first!) ────────────────────────
/*

// 1.
const name = response?.data?.user?.name;
console.log(name); // "Sneha"

// 2.
const itemName = response?.data?.user?.orders?.[0]?.items?.[0]?.name;
console.log(itemName); // "Phone"

// 3.
const theme = response?.data?.user?.preferences?.theme;
console.log(theme); // undefined

// 4.
const themeWithDefault = response?.data?.user?.preferences?.theme ?? "light";
console.log(themeWithDefault); // "light"

// 5.
const price = response?.data?.user?.orders?.[1]?.items?.[0]?.price ?? 0;
console.log(price); // 0

*/
