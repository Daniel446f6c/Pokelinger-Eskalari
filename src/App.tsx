import { useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';

function App() {
  const { isGameStarted } = useGame();

  return (
    <div className="app-container">
      {isGameStarted ? <GameScreen /> : <SetupScreen />}
    </div>
  );
}

export default App;
