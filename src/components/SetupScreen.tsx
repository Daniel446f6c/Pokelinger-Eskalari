import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import type { GameMode } from '../types/game';

const SetupScreen = () => {
    const { startGame } = useGame();
    const [numPlayers, setNumPlayers] = useState(2);
    const [names, setNames] = useState<string[]>(['Spieler 1', 'Spieler 2']);
    const [mode, setMode] = useState<GameMode>('3-fach');

    useEffect(() => {
        setNames(prev => {
            const newNames = [...prev];
            if (numPlayers > prev.length) {
                for (let i = prev.length; i < numPlayers; i++) {
                    newNames.push(`Spieler ${i + 1}`);
                }
            } else {
                return newNames.slice(0, numPlayers);
            }
            return newNames;
        });
    }, [numPlayers]);

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    const handleStart = () => {
        startGame(names, mode);
    };

    return (
        <div className="glass-panel" style={{
            maxWidth: '500px',
            margin: '3rem auto',
            padding: '2.5rem',
            position: 'relative'
        }}>
            {/* Decorative glow */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(ellipse at center, hsla(270, 70%, 50%, 0.1) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: -1
            }} />

            {/* Title */}
            <h1 style={{
                fontSize: '2.8rem',
                marginBottom: '0.3rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
            }}>
                Pokelinger Eskalari
            </h1>
            <p style={{
                color: 'var(--text-muted)',
                marginBottom: '2.5rem',
                fontSize: '1rem',
                fontWeight: 500
            }}>
                Das digitale Verrechnungsblatt
            </p>

            {/* Player Count */}
            <div className="fade-in" style={{ marginBottom: '2rem', textAlign: 'left', animationDelay: '0.1s' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    color: 'var(--accent-color)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Spieleranzahl
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            onClick={() => setNumPlayers(n)}
                            style={{
                                flex: 1,
                                padding: '0.9rem',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: numPlayers === n
                                    ? 'linear-gradient(135deg, hsl(270, 75%, 55%) 0%, hsl(300, 70%, 60%) 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: numPlayers === n
                                    ? '1px solid transparent'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                color: numPlayers === n ? 'white' : 'var(--text-muted)',
                                boxShadow: numPlayers === n ? '0 4px 15px hsla(270, 70%, 50%, 0.4)' : 'none'
                            }}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Player Names */}
            <div className="fade-in" style={{ marginBottom: '2rem', textAlign: 'left', animationDelay: '0.2s' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    color: 'var(--accent-color)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Spielernamen
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {names.map((name, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(idx, e.target.value)}
                            placeholder={`Name von Spieler ${idx + 1}`}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Game Mode */}
            <div className="fade-in" style={{ marginBottom: '2.5rem', textAlign: 'left', animationDelay: '0.3s' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    color: 'var(--accent-color)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Spielmodus
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {(['classic', '3-fach'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                background: mode === m
                                    ? 'linear-gradient(135deg, hsl(270, 75%, 55%) 0%, hsl(300, 70%, 60%) 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: mode === m
                                    ? '1px solid transparent'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                color: mode === m ? 'white' : 'var(--text-muted)',
                                boxShadow: mode === m ? '0 4px 15px hsla(270, 70%, 50%, 0.4)' : 'none'
                            }}
                        >
                            {m === 'classic' ? 'Klassisch' : '3-Fach'}
                            <span style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                marginTop: '0.25rem',
                                opacity: 0.8,
                                fontWeight: 400
                            }}>
                                {m === 'classic' ? '1 Spalte' : '3 Spalten (x1, x2, x3)'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <button
                onClick={handleStart}
                className="btn-primary pulse"
                style={{
                    width: '100%',
                    padding: '1.1rem',
                    fontSize: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    letterSpacing: '0.02em'
                }}
            >
                🎲 Spiel Starten
            </button>
        </div>
    );
};

export default SetupScreen;
