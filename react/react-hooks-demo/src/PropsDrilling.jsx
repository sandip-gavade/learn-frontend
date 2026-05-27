// Props Drilling — data passes through every level even if middle components don't need it

function ChildC({ name }) {
  return <p>ChildC finally uses it → <strong>{name}</strong> ✅</p>;
}

function ChildB({ name }) {
  return (
    <div style={{ marginLeft: 20 }}>
      <p>ChildB received "{name}" — doesn't use it, just passes down</p>
      <ChildC name={name} />
    </div>
  );
}

function ChildA({ name }) {
  return (
    <div style={{ marginLeft: 20 }}>
      <p>ChildA received "{name}" — doesn't use it, just passes down</p>
      <ChildB name={name} />
    </div>
  );
}

function PropsDrilling() {
  const user = "Rahul";

  return (
    <div>
      <h2>3. Props Drilling</h2>
      <p>App owns "Rahul" → ChildA → ChildB → ChildC. Middle components are just middlemen.</p>
      <p>App (owns "{user}")</p>
      <ChildA name={user} />
    </div>
  );
}

export default PropsDrilling;
