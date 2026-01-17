import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ROW_KEYS, type RowKey } from '../../types/game';
import ScoreInputModal from '../Input/ScoreInputModal';

const ScoreTable = () => {
    const { players, mode, updateScore, currentPlayerId } = useGame();

    const [editingCell, setEditingCell] = useState<{
        playerId: string,
        colIndex: number,
        rowKey: RowKey,
        currentVal: number | null,
        playerName: string
    } | null>(null);

    const calculateColumnSum = (col: Record<RowKey, number | null>) => {
        return ROW_KEYS.reduce((sum, key) => sum + (col[key] || 0), 0);
    };

    const handleCellClick = (playerId: string, colIndex: number, rowKey: RowKey, val: number | null, playerName: string) => {
        if (playerId !== currentPlayerId) return;
        if (val !== null) return;
        setEditingCell({ playerId, colIndex, rowKey, currentVal: val, playerName });
    };

    const handleInputConfirm = (val: number | null) => {
        if (editingCell) {
            if (val !== null) {
                updateScore(editingCell.playerId, editingCell.colIndex, editingCell.rowKey, val);
            }
            setEditingCell(null);
        }
    };

    return (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1.25rem', margin: '1rem 0' }}>
            <table className="score-table" style={{ minWidth: '760px', tableLayout: 'fixed', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{
                            textAlign: 'center',
                            padding: '0.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem'
                        }}>
                            Feld
                        </th>
                        {players.map(p => {
                            const isActive = p.id === currentPlayerId;
                            return (
                                <th
                                    key={p.id}
                                    colSpan={mode === '3-fach' ? 3 : 1}
                                    style={{
                                        padding: '1rem',
                                        background: isActive
                                            ? 'linear-gradient(180deg, hsla(270, 70%, 50%, 0.15) 0%, transparent 100%)'
                                            : 'transparent',
                                        borderBottom: isActive
                                            ? '2px solid var(--accent-color)'
                                            : '1px solid rgba(255,255,255,0.08)',
                                        color: isActive ? 'var(--accent-color)' : 'var(--gold)',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {p.name}
                                    {isActive && (
                                        <span style={{
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            fontWeight: 500,
                                            marginTop: '0.25rem',
                                            opacity: 0.8
                                        }}>
                                            Am Zug
                                        </span>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                    {mode === '3-fach' && (
                        <tr>
                            <th></th>
                            {players.map((_, i) => (
                                <th key={i} colSpan={3} style={{ padding: 0, border: 'none' }}>
                                    <div style={{ display: 'flex' }}>
                                        {[1, 2, 3].map(mult => (
                                            <div key={mult} style={{
                                                flex: 1,
                                                color: 'var(--text-muted)',
                                                fontSize: '0.75rem',
                                                textAlign: 'center',
                                                padding: '0.5rem',
                                                background: mult === 3
                                                    ? 'rgba(255, 215, 0, 0.05)'
                                                    : mult === 2
                                                        ? 'rgba(255, 255, 255, 0.02)'
                                                        : 'transparent',
                                                fontWeight: 600
                                            }}>
                                                x{mult}
                                            </div>
                                        ))}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {ROW_KEYS.map((key, rowIdx) => (
                        <tr key={key} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'
                        }}>
                            <td style={{
                                padding: '0.75rem 1rem',
                                fontWeight: 700,
                                color: ['S', 'F', 'P', 'G'].includes(key) ? 'var(--gold)' : 'var(--accent-color)',
                                fontSize: '0.95rem'
                            }}>
                                {key}
                            </td>
                            {players.map(p => (
                                p.columns.map((col, colIdx) => {
                                    const val = col[key];
                                    const isClickable = p.id === currentPlayerId && val === null;
                                    const multiplierBg = mode === '3-fach'
                                        ? colIdx === 2
                                            ? 'rgba(255, 215, 0, 0.03)'
                                            : colIdx === 1
                                                ? 'rgba(255, 255, 255, 0.01)'
                                                : 'transparent'
                                        : 'transparent';

                                    return (
                                        <td
                                            key={`${p.id}-${colIdx}`}
                                            style={{
                                                padding: '0.3rem',
                                                textAlign: 'center',
                                                background: multiplierBg
                                            }}
                                        >
                                            <button
                                                onClick={() => handleCellClick(p.id, colIdx, key, val, p.name)}
                                                disabled={!isClickable}
                                                style={{
                                                    width: '100%',
                                                    minHeight: '42px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '0.2rem',
                                                    textAlign: 'center',
                                                    background: val !== null
                                                        ? 'rgba(255,255,255,0.08)'
                                                        : isClickable
                                                            ? 'rgba(255,255,255,0.03)'
                                                            : 'transparent',
                                                    color: val !== null ? 'white' : 'rgba(255,255,255,0.2)',
                                                    border: isClickable
                                                        ? '1px dashed rgba(255,255,255,0.15)'
                                                        : '1px solid transparent',
                                                    fontSize: '1rem',
                                                    fontWeight: val !== null ? 600 : 400,
                                                    cursor: isClickable ? 'pointer' : 'default',
                                                    opacity: !isClickable && val === null ? 0.4 : 1,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {val !== null ? val : '–'}
                                            </button>
                                        </td>
                                    );
                                })
                            ))}
                        </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr style={{
                        borderTop: '2px solid var(--accent-color)',
                        fontWeight: 700,
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <td style={{
                            padding: '1rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Total
                        </td>
                        {players.map(p => (
                            p.columns.map((col, colIdx) => (
                                <td key={`total-${p.id}-${colIdx}`} style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    color: 'var(--gold)',
                                    fontSize: '1.1rem'
                                }}>
                                    {calculateColumnSum(col)}
                                </td>
                            ))
                        ))}
                    </tr>

                    {/* GRAND TOTAL ROW FOR 3-FACH */}
                    {mode === '3-fach' && (
                        <tr style={{
                            background: 'linear-gradient(90deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.15) 50%, rgba(255,215,0,0.08) 100%)'
                        }}>
                            <td style={{
                                padding: '1.25rem 1rem',
                                color: 'var(--gold)',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Gesamt
                            </td>
                            {players.map(p => {
                                const grandTotal = p.columns.reduce((sum, col) => sum + calculateColumnSum(col), 0);
                                return (
                                    <td
                                        key={`grand-${p.id}`}
                                        colSpan={3}
                                        style={{
                                            textAlign: 'center',
                                            padding: '1.25rem',
                                            fontSize: '1.5rem',
                                            fontWeight: 800,
                                            color: 'var(--gold)',
                                            textShadow: '0 0 20px hsla(42, 85%, 55%, 0.4)'
                                        }}
                                    >
                                        {grandTotal}
                                    </td>
                                );
                            })}
                        </tr>
                    )}
                </tbody>
            </table>

            {editingCell && (
                <ScoreInputModal
                    isOpen={!!editingCell}
                    onClose={() => setEditingCell(null)}
                    onConfirm={handleInputConfirm}
                    rowKey={editingCell.rowKey}
                    initialValue={editingCell.currentVal}
                    playerName={editingCell.playerName}
                    multiplier={mode === '3-fach' ? editingCell.colIndex + 1 : 1}
                />
            )}
        </div>
    );
};

export default ScoreTable;
