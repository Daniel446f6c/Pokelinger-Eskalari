import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import type { GameMode } from '../types/game';

const SetupScreen = () => {
    const { startGame } = useGame();
    const [numPlayers, setNumPlayers] = useState(2);
    const [names, setNames] = useState<string[]>(['Spieler 1', 'Spieler 2']);
    const [mode, setMode] = useState<GameMode>('3-fach');

    useEffect(() => {
        // Adjust names array when numPlayers changes
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
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                Pokelinger Eskalari
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Das digitale Verrechnungsblatt
            </p>

            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                    Spieleranzahl
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[2, 3, 4, 5].map(n => (
                        <button
                            key={n}
                            onClick={() => setNumPlayers(n)}
                            style={{
                                flex: 1,
                                borderColor: numPlayers === n ? 'var(--accent-color)' : '',
                                background: numPlayers === n ? 'var(--accent-color)' : '',
                                color: numPlayers === n ? 'white' : ''
                            }}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                    Namen
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {names.map((name, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(idx, e.target.value)}
                            placeholder={`Name von Spieler ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>
                    Modus
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {(['classic', '3-fach'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                flex: 1,
                                borderColor: mode === m ? 'var(--accent-color)' : '',
                                background: mode === m ? 'var(--accent-color)' : '',
                                color: mode === m ? 'white' : ''
                            }}
                        >
                            {m === 'classic' ? 'Klassisch (1 Spalte)' : '3-Fach (3 Spalten)'}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleStart}
                style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.2rem',
                    background: 'var(--gold)',
                    color: '#000',
                    fontWeight: 'bold',
                    marginTop: '1rem'
                }}
            >
                Spiel Starten
            </button>
        </div>
    );
};

export default SetupScreen;
