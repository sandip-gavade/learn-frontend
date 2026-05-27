import { useState } from 'react';

function ControlledForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({ name, email });
  };

  return (
    <div>
      <h2>1. Controlled Form</h2>
      <p>
        React state controls the input. Every keystroke updates state via
        onChange.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            value={name}
            onChange={(e) => {
              console.log(e.target.value);
              setName(e.target.value);
            }}
          />
          <span> → state: "{name}"</span>
        </div>

        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <span> → state: "{email}"</span>
        </div>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <p>
          ✅ Submitted from state: {submitted.name} — {submitted.email}
        </p>
      )}
    </div>
  );
}

export default ControlledForm;
