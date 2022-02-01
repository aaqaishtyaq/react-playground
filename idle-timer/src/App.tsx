import {useState} from 'react';
import './App.css';
import {IdleTimerContainer} from './components/IdleTimeContainer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <IdleTimerContainer
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        ></IdleTimerContainer>
      ) : (
        <button onClick={logIn}>Log me In</button>
      )}
    </div>
  );
}

export default App;
