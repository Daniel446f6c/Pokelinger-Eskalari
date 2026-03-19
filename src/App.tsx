import { useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import ReloadPrompt from './components/ReloadPrompt';
import { useOfflineSync } from './hooks/useOfflineSync';

function App() {
  const { isGameStarted } = useGame();
  useOfflineSync();

  return (
    <div className="app-container">
      {isGameStarted ? <GameScreen /> : <SetupScreen />}
      <ReloadPrompt />
    </div>
  );
}

export default App;
