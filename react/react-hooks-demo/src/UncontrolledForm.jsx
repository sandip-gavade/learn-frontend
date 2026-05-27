import { useRef, useState } from 'react';

function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted({
      name: nameRef.current.value,
      email: emailRef.current.value,
    });
  };

  return (
    <div>
      <h2>2. Uncontrolled Form</h2>
      <p>
        DOM owns the value. No onChange, no state per keystroke. Read with
        useRef on submit.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input ref={nameRef} />
        </div>

        <div>
          <label>Email: </label>
          <input ref={emailRef} />
        </div>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <p>
          ✅ Read from DOM: {submitted.name} — {submitted.email}
        </p>
      )}
    </div>
  );
}

export default UncontrolledForm;
