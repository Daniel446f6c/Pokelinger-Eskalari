import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ROW_KEYS, type RowKey } from '../../types/game';
import ScoreInputModal from '../Input/ScoreInputModal';

const ScoreTable = () => {
    const { players, mode, updateScore, currentPlayerId } = useGame();

    // Modal State
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
        // LOCKING RULES:
        // 1. Can only edit if it's this player's turn
        if (playerId !== currentPlayerId) return;
        // 2. Can only edit empty cells (once filled, it's locked)
        if (val !== null) return;

        setEditingCell({ playerId, colIndex, rowKey, currentVal: val, playerName });
    };

    const handleInputConfirm = (val: number | null) => {
        if (editingCell) {
            // If user confirms null (e.g. closes modal without entry), do nothing?
            // Or if they explicitly enter 0 (Strich), that's a value.
            // If they cancel, val might be null. We should only update if val is not null?
            // Actually, standard modal onClose triggers 'setEditingCell(null)'.
            // onConfirm triggers this. passing null means "Cancel" usually?
            // My modal passes 'null' if empty but we want to allow 0.
            // Let's assume onConfirm passes final number or we skip update if undefined.
            // If user cancels, we shouldn't call updateScore at all.
            // But ScoreInputModal calls onConfirm(null) currently if empty?
            // If the user enters nothing and clicks 'Eintragen', maybe we shouldn't allow that.

            if (val !== null) {
                updateScore(editingCell.playerId, editingCell.colIndex, editingCell.rowKey, val);
            }
            setEditingCell(null);
        }
    };

    return (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)' }}>Name</th>
                        {players.map(p => {
                            const isActive = p.id === currentPlayerId;
                            return (
                                <th
                                    key={p.id}
                                    colSpan={mode === '3-fach' ? 3 : 1}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: isActive ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                                        background: isActive ? 'rgba(var(--hue-accent), 0.1)' : 'transparent',
                                        color: isActive ? 'var(--accent-color)' : 'var(--gold)',
                                        fontSize: '1.2rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {p.name} {isActive && ' (Am Zug)'}
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
                                        <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>x1</div>
                                        <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>x2</div>
                                        <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>x3</div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {ROW_KEYS.map(key => (
                        <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '0.8rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                                {key}
                            </td>
                            {players.map(p => (
                                p.columns.map((col, colIdx) => {
                                    const val = col[key];
                                    return (
                                        <td
                                            key={`${p.id}-${colIdx}`}
                                            style={{ padding: '0.2rem', textAlign: 'center' }}
                                        >
                                            <button
                                                onClick={() => handleCellClick(p.id, colIdx, key, val, p.name)}
                                                style={{
                                                    width: '100%',
                                                    background: val !== null ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    color: val !== null ? 'white' : 'transparent',
                                                    minHeight: '40px'
                                                }}
                                            >
                                                {val !== null ? val : '-'}
                                            </button>
                                        </td>
                                    );
                                })
                            ))}
                        </tr>
                    ))}

                    {/* TOTAL ROW */}
                    <tr style={{ borderTop: '2px solid var(--accent-color)', fontWeight: 'bold' }}>
                        <td style={{ padding: '1rem', color: 'var(--gold)' }}>Total</td>
                        {players.map(p => (
                            p.columns.map((col, colIdx) => (
                                <td key={`total-${p.id}-${colIdx}`} style={{ textAlign: 'center', padding: '1rem', color: 'var(--gold)' }}>
                                    {calculateColumnSum(col)}
                                </td>
                            ))
                        ))}
                    </tr>

                    {/* GRAND TOTAL ROW FOR 3-FACH */}
                    {mode === '3-fach' && (
                        <tr style={{ background: 'rgba(255,215,0,0.1)' }}>
                            <td style={{ padding: '1rem', color: 'var(--gold)' }}>Sum</td>
                            {players.map(p => {
                                const grandTotal = p.columns.reduce((sum, col) => sum + calculateColumnSum(col), 0);
                                return (
                                    <td key={`grand-${p.id}`} colSpan={3} style={{ textAlign: 'center', padding: '1rem', fontSize: '1.2rem', color: 'var(--gold)' }}>
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
