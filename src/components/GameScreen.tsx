import { useGame } from '../context/GameContext';
import ScoreTable from './ScoreSheet/ScoreTable';
import VictoryScreen from './VictoryScreen';

const GameScreen = () => {
    const { resetGame, mode, isGameComplete } = useGame();

    const handleNewGame = () => {
        if (confirm('Spiel wirklich beenden?')) {
            resetGame();
        }
    };

    // Show victory screen when game is complete
    if (isGameComplete) {
        return <VictoryScreen />;
    }

    return (
        <div style={{ maxWidth: '100%', width: '100%' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                position: 'relative'
            }}>
                {/* Decorative gradient line */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, hsl(270, 70%, 55%), hsl(42, 85%, 55%), transparent)',
                    opacity: 0.6
                }} />

                <div style={{ textAlign: 'left' }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Pokelinger Eskalari
                    </h2>
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.25rem'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {mode === '3-fach' ? '3-Fach' : 'Klassisch'}
                        </span>
                        {mode === '3-fach' && <span style={{ opacity: 0.7 }}>x1, x2, x3</span>}
                    </span>
                </div>

                <button
                    onClick={handleNewGame}
                    className="btn-ghost"
                    style={{
                        padding: '0.6rem 1.2rem',
                        fontSize: '0.9rem'
                    }}
                >
                    🏠 Neues Spiel
                </button>
            </header>

            <ScoreTable />

            <div style={{
                marginTop: '2rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ opacity: 0.6 }}>💡</span>
                Klicke auf eine Zelle um Punkte einzutragen
            </div>
        </div>
    );
};

export default GameScreen;
