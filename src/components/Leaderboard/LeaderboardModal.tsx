import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import LeaderboardTable from './LeaderboardTable';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
    const { scoresClassic, scores3Fach, loading } = useLeaderboard();
    const [activeTab, setActiveTab] = useState<'classic' | '3-fach'>('3-fach');

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

    const activeScores = activeTab === 'classic' ? scoresClassic : scores3Fach;

    return createPortal(
        <div className="modal-overlay" style={{ zIndex: 300 }}>
            <div className="glass-panel modal-content" style={{
                width: '95%',
                maxWidth: '600px',
                padding: '2rem',
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
                        <span style={{ filter: 'drop-shadow(0 0 10px hsla(42, 85%, 55%, 0.4))' }}>🏆</span>
                        Ruhmeshalle
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
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setActiveTab('3-fach')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            background: activeTab === '3-fach'
                                ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === '3-fach' ? 'black' : 'white',
                            border: activeTab === '3-fach' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        3-Fach (Top 50)
                    </button>
                    <button
                        onClick={() => setActiveTab('classic')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            background: activeTab === 'classic'
                                ? 'linear-gradient(135deg, hsl(42, 85%, 55%) 0%, hsl(57, 90%, 65%) 100%)'
                                : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === 'classic' ? 'black' : 'white',
                            border: activeTab === 'classic' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Klassisch (Top 50)
                    </button>
                </div>

                {/* Table Content (Scrollable) */}
                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    <LeaderboardTable entries={activeScores} loading={loading} />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LeaderboardModal;
