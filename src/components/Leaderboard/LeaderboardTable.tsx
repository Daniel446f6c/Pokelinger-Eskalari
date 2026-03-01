import React from 'react';
import type { LeaderboardEntry } from '../../hooks/useLeaderboard';

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    loading: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, loading }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Rangliste wird geladen...
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Noch keine Einträge in der Ruhmeshalle.
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table className="score-table" style={{ width: '100%', minWidth: '400px' }}>
                <thead>
                    <tr>
                        <th style={{
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--gold)',
                            fontWeight: 700,
                            textAlign: 'center',
                            width: '60px'
                        }}>
                            Rang
                        </th>
                        <th style={{
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--gold)',
                            fontWeight: 700,
                            textAlign: 'left'
                        }}>
                            Name
                        </th>
                        <th style={{
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--gold)',
                            fontWeight: 700,
                            textAlign: 'right'
                        }}>
                            Punkte
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => {
                        const rank = index + 1;
                        let rankStyle: React.CSSProperties = { color: 'white', fontWeight: 600 };
                        let rankIcon = rank.toString();

                        // Special styles for top 3
                        if (rank === 1) {
                            rankStyle = { color: '#FFD700', fontWeight: 800, fontSize: '1.2rem', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' };
                            rankIcon = '👑';
                        } else if (rank === 2) {
                            rankStyle = { color: '#C0C0C0', fontWeight: 700 };
                        } else if (rank === 3) {
                            rankStyle = { color: '#CD7F32', fontWeight: 700 };
                        }

                        return (
                            <tr key={entry.id} style={{
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                background: index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                                transition: 'background 0.2s'
                            }}>
                                <td style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'center',
                                    ...rankStyle
                                }}>
                                    {rankIcon}
                                </td>
                                <td style={{
                                    padding: '0.75rem 1rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    textShadow: rank === 1 ? '0 0 5px rgba(255, 255, 255, 0.3)' : 'none'
                                }}>
                                    {entry.username}
                                </td>
                                <td style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'right',
                                    fontWeight: 700,
                                    color: 'var(--accent-color)'
                                }}>
                                    {entry.score}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
