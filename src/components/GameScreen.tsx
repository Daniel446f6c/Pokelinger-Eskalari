import { useGame } from '../context/GameContext';
import ScoreTable from './ScoreSheet/ScoreTable';

const GameScreen = () => {
    const { resetGame, mode } = useGame();

    const handleNewGame = () => {
        if (confirm('Spiel wirklich beenden?')) {
            resetGame();
        }
    };

    return (
        <div style={{ maxWidth: '100%', width: '100%' }}>
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: 'left' }}>
                    <h2 style={{ margin: 0, color: 'var(--gold)' }}>Pokelinger Eskalari</h2>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Modus: {mode === '3-fach' ? '3-Fach (x1, x2, x3)' : 'Klassisch'}
                    </span>
                </div>
                <button onClick={handleNewGame} style={{ background: 'rgba(255,255,255,0.1)' }}>
                    Neues Spiel
                </button>
            </header>

            <ScoreTable />

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'gray' }}>
                Tipp: Klicke auf eine Zelle um Punkte einzutragen.
            </div>
        </div>
    );
};

export default GameScreen;
