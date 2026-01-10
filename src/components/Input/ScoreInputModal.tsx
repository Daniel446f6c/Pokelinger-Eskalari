import { useState, useEffect } from 'react';
import type { RowKey } from '../../types/game';
import { calculateSpecialScore, FACES } from '../../utils/scoreCalculator';

interface ScoreInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: number | null) => void;
    rowKey: RowKey;
    initialValue: number | null;
    playerName: string;
    multiplier?: number;
}

const ScoreInputModal = ({ isOpen, onClose, onConfirm, rowKey, initialValue, playerName, multiplier = 1 }: ScoreInputModalProps) => {
    const [currentValue, setCurrentValue] = useState<string>('');

    // Wizard State
    const [isServiert, setIsServiert] = useState(false);
    const [faceMain, setFaceMain] = useState<string>('A');
    const [faceSecondary, setFaceSecondary] = useState<string>('K');
    const [straightType, setStraightType] = useState<'small' | 'large' | null>(null);

    // Derived
    const isNumberRow = ['9', '10', 'B', 'D', 'K', 'A'].includes(rowKey);
    const isSpecial = ['S', 'F', 'P', 'G'].includes(rowKey);

    useEffect(() => {
        if (isOpen) {
            setCurrentValue(initialValue !== null ? initialValue.toString() : '');
            setIsServiert(false);
            setFaceMain('A');
            setFaceSecondary('K');
            setStraightType(null); // Reset
        }
    }, [isOpen, initialValue]);

    // Reactive Update for Straight
    useEffect(() => {
        if (rowKey === 'S' && straightType) {
            const base = straightType === 'large' ? 25 : 20;
            const final = isServiert ? base * 2 : base;
            setCurrentValue(final.toString());
        }
    }, [isServiert, straightType, rowKey]);

    // Reactive Update for Special Wizard (F, P, G) if needed?
    // User asked specifically for Straight independence.
    // For F/P/G, let's also auto-update if wizard is active?
    // Currently they have a "Berechnen" button.
    // Let's stick to the "Berechnen" button for F/P/G to avoid accidental overwrites of manual input,
    // but for Straight it's purely selection based usually.

    // Actually, for F/P/G, if user toggles Serviert, they probably expect update too if they used wizard.
    // But let's stick to user request: "Reihenfolge ... straße ... unabhängig".

    if (!isOpen) return null;

    // -- Handlers --

    const handleManualNum = (num: number) => {
        setCurrentValue(prev => prev + num.toString());
        // If user types manually, clear wizard state so we don't overwrite?
        setStraightType(null);
    };

    const handleBackspace = () => {
        setCurrentValue(prev => prev.slice(0, -1));
        setStraightType(null);
    };

    const handleClear = () => {
        setCurrentValue('');
        setStraightType(null);
    };

    const handleConfirm = () => {
        const val = currentValue === '' ? null : parseInt(currentValue, 10);
        // Multiplier is applied to the final stored value
        const finalVal = val !== null ? val * multiplier : null;
        onConfirm(finalVal);
    };

    // -- Special Logic --

    const handleCountInput = (count: number) => {
        // For Rows 9-A: Input is "Count of Dice". Score = Count * FaceValue.
        // Face Values: 9=1, 10=2, B=3, D=4, K=5, A=6.
        const faceMap: Record<string, number> = { '9': 1, '10': 2, 'B': 3, 'D': 4, 'K': 5, 'A': 6 };
        const faceVal = faceMap[rowKey] || 0;
        const score = count * faceVal;
        setCurrentValue(score.toString());
    };

    // Wizard (F, P, G)
    const applyWizardScore = () => {
        const score = calculateSpecialScore(rowKey, isServiert, { main: faceMain, secondary: faceSecondary });
        setCurrentValue(score.toString());
    };

    const displayValue = currentValue === '' ? 0 : parseInt(currentValue, 10);
    const totalValue = displayValue * multiplier;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div className="glass-panel" style={{ width: '95%', maxWidth: '400px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{playerName}</span>
                        <h2 style={{ margin: 0, color: 'var(--gold)' }}>
                            {isSpecial ? (rowKey === 'S' ? 'Straße' : rowKey === 'F' ? 'Full House' : rowKey === 'P' ? 'Poker' : 'Grande') : `Reihe ${rowKey}`}
                            {multiplier > 1 && <span style={{ marginLeft: '0.5rem', color: 'var(--accent-color)', fontSize: '0.8em' }}>
                                (x{multiplier})
                            </span>}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ padding: '0.2rem 0.6rem', background: 'transparent', border: 'none', fontSize: '1.5rem' }}>✕</button>
                </div>

                {/* Display Score */}
                <div style={{
                    background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px',
                    fontSize: '2.5rem', textAlign: 'right', marginBottom: '1.5rem',
                    border: '1px solid var(--accent-color)', color: 'white', fontWeight: 'bold'
                }}>
                    {currentValue === '' ? <span style={{ color: 'rgba(255,255,255,0.3)' }}>0</span> : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span>{totalValue}</span>
                            {multiplier > 1 && currentValue !== '0' && (
                                <span style={{ fontSize: '1rem', color: 'gray' }}>
                                    {currentValue} x {multiplier}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* --- UI FOR NUMBER ROWS (9-A) --- */}
                {isNumberRow && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Anzahl der Würfel:</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5, 6].map(count => (
                                <button
                                    key={count}
                                    onClick={() => handleCountInput(count)}
                                    style={{
                                        padding: '1rem', fontSize: '1.2rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    {count}x
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'gray', textAlign: 'center' }}>
                            (Berechnet automatisch Anzahl x Augenwert)
                        </div>
                    </div>
                )}

                {/* --- UI FOR STRAIGHT (S) --- */}
                {rowKey === 'S' && (
                    <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={isServiert}
                                    onChange={(e) => {
                                        const newVal = e.target.checked;
                                        setIsServiert(newVal);
                                        // Auto-update if a value is already set? Better just let user click button again.
                                    }}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--main-primary)' }}
                                />
                                <span style={{ fontSize: '1.1rem' }}>Serviert (x2)</span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <button onClick={() => setStraightType('small')} style={{ flex: 1, padding: '1rem', background: straightType === 'small' ? 'var(--gold)' : 'rgba(255, 255, 255, 0.1)', color: straightType === 'small' ? 'black' : 'white' }}>
                                Kl. Straße (20)
                            </button>
                            <button onClick={() => setStraightType('large')} style={{ flex: 1, padding: '1rem', background: straightType === 'large' ? 'var(--gold)' : 'rgba(255, 255, 255, 0.1)', color: straightType === 'large' ? 'black' : 'white' }}>
                                Gr. Straße (25)
                            </button>
                        </div>
                    </div>
                )}

                {/* --- WIZARD FOR F, P, G --- */}
                {(rowKey === 'F' || rowKey === 'P' || rowKey === 'G') && (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Rechner</h4>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={isServiert}
                                    onChange={(e) => setIsServiert(e.target.checked)}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--main-primary)' }}
                                />
                                <span style={{ fontSize: '1.1rem' }}>Serviert (x2)</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ width: '80px' }}>{rowKey === 'F' ? 'Drilling:' : rowKey === 'P' ? 'Poker:' : 'Würfel:'}</span>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                                    {FACES.map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFaceMain(f)}
                                            style={{
                                                padding: '0.4rem',
                                                background: faceMain === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                                                color: faceMain === f ? 'black' : 'white',
                                                minWidth: '30px'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(rowKey === 'F' || rowKey === 'P') && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <span style={{ width: '80px' }}>{rowKey === 'F' ? 'Zwilling:' : 'Kicker:'}</span>
                                    <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                                        {FACES.map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFaceSecondary(f)}
                                                style={{
                                                    padding: '0.4rem',
                                                    background: faceSecondary === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                                                    color: faceSecondary === f ? 'black' : 'white',
                                                    minWidth: '30px'
                                                }}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={applyWizardScore}
                            style={{ width: '100%', marginTop: '1rem', background: 'var(--accent-color)', color: 'white' }}
                        >
                            Berechnen
                        </button>
                    </div>
                )}

                {/* Manual Numpad Toggle / Fallback */}
                <details style={{ marginBottom: '1rem', cursor: 'pointer', color: 'gray' }}>
                    <summary>Manuelle Eingabe (Ziffernblock)</summary>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginTop: '1rem' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                            <button key={n} onClick={() => handleManualNum(n)} style={{ fontSize: '1.5rem', padding: '0.8rem', gridColumn: n === 0 ? 'span 2' : 'span 1' }}>{n}</button>
                        ))}
                        <button onClick={handleBackspace} style={{ fontSize: '1.2rem', background: 'rgba(255,100,100,0.2)' }}>⌫</button>
                    </div>
                </details>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => { setCurrentValue('0'); }} style={{ flex: 1, background: '#d32f2f' }}>
                        Strich (0)
                    </button>
                    <button onClick={handleClear} style={{ flex: 1, background: '#555' }}>
                        Clear
                    </button>
                    <button onClick={handleConfirm} style={{ flex: 2, background: 'var(--gold)', color: 'black', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Eintragen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScoreInputModal;
