import { createContext, useContext } from 'react';

// Step 1: Create context
const UserContext = createContext();

function ChildC() {
  // Step 3: Consume directly — no props needed
  const name = useContext(UserContext);
  return (
    <p>
      ChildC grabs it via useContext → <strong>{name}</strong> ✅
    </p>
  );
}

function ChildB() {
  return (
    <div style={{ marginLeft: 20 }}>
      <p>ChildB — no props, clean ✨</p>
      <ChildC />
    </div>
  );
}

function ChildA() {
  return (
    <div style={{ marginLeft: 20 }}>
      <p>ChildA — no props, clean ✨</p>
      <ChildB />
    </div>
  );
}

function ContextExample() {
  const user = 'SAndip';

  return (
    <div>
      <h2>4. useContext (solves prop drilling)</h2>
      <p>ChildA and ChildB don't touch the data. ChildC grabs it directly.</p>

      {/* Step 2: Provide at the top */}
      <UserContext.Provider value={user}>
        <p>App + Provider (provides "{user}")</p>
        <ChildA />
      </UserContext.Provider>
    </div>
  );
}

export default ContextExample;
