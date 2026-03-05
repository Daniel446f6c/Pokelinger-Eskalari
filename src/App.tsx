import { useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import ReloadPrompt from './components/ReloadPrompt';

function App() {
  const { isGameStarted } = useGame();

  return (
    <div className="app-container">
      {isGameStarted ? <GameScreen /> : <SetupScreen />}
      <ReloadPrompt />
    </div>
  );
}

export default App;
