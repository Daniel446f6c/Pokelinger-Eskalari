import { useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import ReloadPrompt from './components/ReloadPrompt';
import { useOfflineSync } from './hooks/useOfflineSync';
import { useNetworkToasts } from './hooks/useNetworkToasts';

function App() {
  const { isGameStarted } = useGame();
  useOfflineSync();
  useNetworkToasts();

  return (
    <div className="app-container">
      {isGameStarted ? <GameScreen /> : <SetupScreen />}
      <ReloadPrompt />
    </div>
  );
}

export default App;
