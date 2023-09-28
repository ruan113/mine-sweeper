/* eslint-disable @typescript-eslint/explicit-function-return-type */
import './App.css';
import Board from './components/board';

function App(): JSX.Element {
  return (
    <div className="App">
      <Board></Board>
    </div>
  );
}

export default App;
