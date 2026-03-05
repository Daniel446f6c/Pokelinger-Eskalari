import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import LeaderboardTable from './LeaderboardTable';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
    const { scoresClassic, scores2Fach, scores3Fach, loading } = useLeaderboard();
    const [activeTab, setActiveTab] = useState<'classic' | '2-fach' | '3-fach'>('3-fach');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            (document.activeElement as HTMLElement)?.blur();
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const activeScores = activeTab === 'classic' ? scoresClassic : activeTab === '2-fach' ? scores2Fach : scores3Fach;

    return createPortal(
        <div className="modal-overlay" style={{ zIndex: 300 }}>
            <div className="glass-panel modal-content" style={{
                width: '90%',
                maxWidth: '480px',
                padding: '1.5rem',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '2rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        🏆 Hall of Fame
                    </h2>
                    <button
                        onClick={onClose}
                        className="btn-ghost"
                        style={{ padding: '0.5rem', fontSize: '1.2rem', lineHeight: 1 }}
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    {(['3-fach', '2-fach', 'classic'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '0.75rem 0.25rem',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                borderRadius: 'var(--radius-sm)',
                                background: activeTab === tab
                                    ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                color: activeTab === tab ? 'black' : 'white',
                                border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab === '3-fach' ? '3-Fach' : tab === '2-fach' ? '2-Fach' : 'Klassisch'}
                        </button>
                    ))}
                </div>

                {/* Table Content (Scrollable) */}
                <div style={{ overflowX: 'hidden', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    <LeaderboardTable entries={activeScores} loading={loading} />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LeaderboardModal;
