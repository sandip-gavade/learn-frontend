import ControlledForm from './ControlledForm';
import UncontrolledForm from './UncontrolledForm';
import PropsDrilling from './PropsDrilling';
import ContextExample from './ContextExample';
import MemoExample from './MemoExample';
import Counter from './Counter';

function App() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h1>React Hooks Examples</h1>
      <hr />
      <ControlledForm />
      <hr />
      <UncontrolledForm />
      <hr />
      <PropsDrilling />
      <hr />
      <ContextExample />
      <hr />
      {/* <MemoExample /> */}
      <hr />
      <Counter></Counter>
    </div>
  );
}

export default App;
