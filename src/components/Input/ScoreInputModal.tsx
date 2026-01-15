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

    const [isServiert, setIsServiert] = useState(false);
    const [faceMain, setFaceMain] = useState<string>('A');
    const [faceSecondary, setFaceSecondary] = useState<string>('K');
    const [straightType, setStraightType] = useState<'small' | 'large' | null>(null);

    const isNumberRow = ['9', '10', 'B', 'D', 'K', 'A'].includes(rowKey);

    useEffect(() => {
        if (isOpen) {
            setCurrentValue(initialValue !== null ? initialValue.toString() : '');
            setIsServiert(false);
            setFaceMain('A');
            setFaceSecondary('K');
            setStraightType(null);
        }
    }, [isOpen, initialValue]);

    useEffect(() => {
        if (rowKey === 'S' && straightType) {
            const base = straightType === 'large' ? 25 : 20;
            const final = isServiert ? base * 2 : base;
            setCurrentValue(final.toString());
        }
    }, [isServiert, straightType, rowKey]);

    if (!isOpen) return null;

    const handleManualNum = (num: number) => {
        setCurrentValue(prev => prev + num.toString());
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
        const finalVal = val !== null ? val * multiplier : null;
        onConfirm(finalVal);
    };

    const handleCountInput = (count: number) => {
        const faceMap: Record<string, number> = { '9': 1, '10': 2, 'B': 3, 'D': 4, 'K': 5, 'A': 6 };
        const faceVal = faceMap[rowKey] || 0;
        const score = count * faceVal;
        setCurrentValue(score.toString());
    };

    const applyWizardScore = () => {
        const score = calculateSpecialScore(rowKey, isServiert, { main: faceMain, secondary: faceSecondary });
        setCurrentValue(score.toString());
    };

    const displayValue = currentValue === '' ? 0 : parseInt(currentValue, 10);
    const totalValue = displayValue * multiplier;

    const getRowLabel = () => {
        switch (rowKey) {
            case 'S': return 'Straße';
            case 'F': return 'Full House';
            case 'P': return 'Poker';
            case 'G': return 'Grande';
            default: return `Reihe ${rowKey}`;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content" style={{
                width: '95%',
                maxWidth: '420px',
                padding: '1.75rem',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem'
                }}>
                    <div>
                        <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            fontWeight: 500
                        }}>
                            {playerName}
                        </span>
                        <h2 style={{
                            margin: '0.25rem 0 0 0',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {getRowLabel()}
                            {multiplier > 1 && (
                                <span style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--accent-color)',
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    fontWeight: 600
                                }}>
                                    x{multiplier}
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-ghost"
                        style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '1.2rem',
                            lineHeight: 1
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Score Display */}
                <div style={{
                    background: 'rgba(0,0,0,0.4)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative accent */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, var(--accent-color), var(--gold))'
                    }} />

                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        textAlign: 'right',
                        color: currentValue === '' ? 'rgba(255,255,255,0.2)' : 'white'
                    }}>
                        {currentValue === '' ? '0' : totalValue}
                    </div>
                    {multiplier > 1 && currentValue !== '' && currentValue !== '0' && (
                        <div style={{
                            textAlign: 'right',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.25rem'
                        }}>
                            {currentValue} × {multiplier}
                        </div>
                    )}
                </div>

                {/* Number Row UI */}
                {isNumberRow && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            color: 'var(--text-muted)',
                            marginBottom: '0.75rem',
                            fontSize: '0.85rem',
                            fontWeight: 500
                        }}>
                            Anzahl der Würfel:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5, 6].map(count => (
                                <button
                                    key={count}
                                    onClick={() => handleCountInput(count)}
                                    style={{
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {count}×
                                </button>
                            ))}
                        </div>
                        <div style={{
                            marginTop: '0.5rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textAlign: 'center'
                        }}>
                            Berechnet: Anzahl × Augenwert
                        </div>
                    </div>
                )}

                {/* Straight UI */}
                {rowKey === 'S' && (
                    <div style={{
                        marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            userSelect: 'none',
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            background: isServiert ? 'rgba(var(--accent-color), 0.1)' : 'transparent',
                            borderRadius: '8px',
                            transition: 'background 0.2s ease'
                        }}>
                            <input
                                type="checkbox"
                                checked={isServiert}
                                onChange={(e) => setIsServiert(e.target.checked)}
                            />
                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                                Serviert <span style={{ color: 'var(--gold)' }}>(×2)</span>
                            </span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setStraightType('small')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontWeight: 600,
                                    background: straightType === 'small'
                                        ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                        : 'rgba(255, 255, 255, 0.08)',
                                    color: straightType === 'small' ? 'black' : 'white',
                                    border: straightType === 'small' ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                Kleine (20)
                            </button>
                            <button
                                onClick={() => setStraightType('large')}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontWeight: 600,
                                    background: straightType === 'large'
                                        ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                        : 'rgba(255, 255, 255, 0.08)',
                                    color: straightType === 'large' ? 'black' : 'white',
                                    border: straightType === 'large' ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                Große (25)
                            </button>
                        </div>
                    </div>
                )}

                {/* Wizard for F, P, G */}
                {(rowKey === 'F' || rowKey === 'P' || rowKey === 'G') && (
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <h4 style={{
                            marginTop: 0,
                            marginBottom: '0.75rem',
                            color: 'var(--accent-color)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Rechner
                        </h4>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            userSelect: 'none',
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            background: isServiert ? 'rgba(var(--accent-color), 0.1)' : 'transparent',
                            borderRadius: '8px'
                        }}>
                            <input
                                type="checkbox"
                                checked={isServiert}
                                onChange={(e) => setIsServiert(e.target.checked)}
                            />
                            <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                                Serviert <span style={{ color: 'var(--gold)' }}>(×2)</span>
                            </span>
                        </label>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{
                                    width: '70px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 500
                                }}>
                                    {rowKey === 'F' ? 'Drilling:' : rowKey === 'P' ? 'Poker:' : 'Würfel:'}
                                </span>
                                <div style={{ display: 'flex', flex: 1, gap: '0.25rem' }}>
                                    {FACES.map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFaceMain(f)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                background: faceMain === f
                                                    ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                                    : 'rgba(255,255,255,0.08)',
                                                color: faceMain === f ? 'black' : 'white',
                                                border: 'none'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(rowKey === 'F' || rowKey === 'P') && (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{
                                        width: '70px',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        fontWeight: 500
                                    }}>
                                        {rowKey === 'F' ? 'Zwilling:' : 'Kicker:'}
                                    </span>
                                    <div style={{ display: 'flex', flex: 1, gap: '0.25rem' }}>
                                        {FACES.map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFaceSecondary(f)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    background: faceSecondary === f
                                                        ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                                        : 'rgba(255,255,255,0.08)',
                                                    color: faceSecondary === f ? 'black' : 'white',
                                                    border: 'none'
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
                            className="btn-accent"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '0.8rem'
                            }}
                        >
                            Berechnen
                        </button>
                    </div>
                )}

                {/* Manual Numpad */}
                <details style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                    <summary style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        padding: '0.5rem 0',
                        userSelect: 'none'
                    }}>
                        Manuelle Eingabe (Ziffernblock)
                    </summary>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        marginTop: '0.75rem'
                    }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                            <button
                                key={n}
                                onClick={() => handleManualNum(n)}
                                style={{
                                    fontSize: '1.4rem',
                                    padding: '0.75rem',
                                    gridColumn: n === 0 ? 'span 2' : 'span 1',
                                    fontWeight: 600,
                                    background: 'rgba(255,255,255,0.08)'
                                }}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            onClick={handleBackspace}
                            style={{
                                fontSize: '1.2rem',
                                background: 'rgba(255, 100, 100, 0.15)',
                                border: '1px solid rgba(255, 100, 100, 0.3)'
                            }}
                        >
                            ⌫
                        </button>
                    </div>
                </details>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button
                        onClick={() => setCurrentValue('0')}
                        className="btn-danger"
                        style={{ flex: 1, padding: '0.9rem' }}
                    >
                        Strich (0)
                    </button>
                    <button
                        onClick={handleClear}
                        className="btn-ghost"
                        style={{ flex: 1, padding: '0.9rem' }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="btn-primary"
                        style={{
                            flex: 2,
                            padding: '0.9rem',
                            fontSize: '1.1rem'
                        }}
                    >
                        Eintragen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScoreInputModal;
