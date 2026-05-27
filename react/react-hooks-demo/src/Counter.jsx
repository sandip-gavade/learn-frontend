import React, { useReducer } from 'react';

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  function reducer(state, action) {
    switch (action.type) {
      case 'increament':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return { count: 0 };
      default:
    }
  }
  return (
    <div>
      <h1>Count :{state.count}</h1>
      <button
        onClick={() => {
          dispatch({ type: 'increament' });
        }}
      >
        {' '}
        add{' '}
      </button>
      <button
        onClick={() => {
          dispatch({ type: 'decrement' });
        }}
      >
        {' '}
        decrement{' '}
      </button>
      <button
        onClick={() => {
          dispatch({ type: 'reset' });
        }}
      >
        {' '}
        reset{' '}
      </button>
    </div>
  );
};

export default Counter;
