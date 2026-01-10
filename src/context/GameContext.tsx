import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { type GameMode, type GameContextType, type Player, type RowKey, ROW_KEYS } from '../types/game';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [mode, setMode] = useState<GameMode>('classic');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentTurnPlayerIndex, setCurrentTurnPlayerIndex] = useState(0);

    const startGame = (playerNames: string[], selectedMode: GameMode) => {
        const numCols = selectedMode === '3-fach' ? 3 : 1;

        const newPlayers: Player[] = playerNames.map((name, index) => {
            const columns = Array(numCols).fill(null).map(() => {
                const col: any = {};
                ROW_KEYS.forEach(key => col[key] = null);
                return col;
            });

            return {
                id: `player-${index}-${Date.now()}`,
                name,
                columns
            };
        });

        setPlayers(newPlayers);
        setMode(selectedMode);
        setIsGameStarted(true);
        setCurrentTurnPlayerIndex(0);
    };

    const updateScore = (playerId: string, colIndex: number, rowKey: RowKey, value: number | null) => {
        setPlayers(prev => prev.map(p => {
            if (p.id !== playerId) return p;

            const newCols = [...p.columns];
            newCols[colIndex] = { ...newCols[colIndex], [rowKey]: value };
            return { ...p, columns: newCols };
        }));

        // Advance turn
        setCurrentTurnPlayerIndex(prev => (prev + 1) % players.length);
    };

    const resetGame = () => {
        setIsGameStarted(false);
        setPlayers([]);
        setCurrentTurnPlayerIndex(0);
    };

    const currentPlayerId = players[currentTurnPlayerIndex]?.id || null;

    // Check if all cells are filled
    const isGameComplete = useMemo(() => {
        if (players.length === 0) return false;

        return players.every(player =>
            player.columns.every(column =>
                ROW_KEYS.every(key => column[key] !== null)
            )
        );
    }, [players]);

    // Calculate player total
    const calculatePlayerTotal = useCallback((player: Player): number => {
        return player.columns.reduce((total, column) => {
            return total + ROW_KEYS.reduce((colSum, key) => colSum + (column[key] || 0), 0);
        }, 0);
    }, []);

    // Get the winner (player with highest total)
    const getWinner = useCallback((): { player: Player; total: number } | null => {
        if (players.length === 0) return null;

        let winner: Player | null = null;
        let highestTotal = -Infinity;

        for (const player of players) {
            const total = calculatePlayerTotal(player);
            if (total > highestTotal) {
                highestTotal = total;
                winner = player;
            }
        }

        return winner ? { player: winner, total: highestTotal } : null;
    }, [players, calculatePlayerTotal]);

    return (
        <GameContext.Provider value={{
            players,
            mode,
            isGameStarted,
            currentTurnPlayerIndex,
            currentPlayerId,
            startGame,
            updateScore,
            resetGame,
            isGameComplete,
            getWinner
        }}>
            {children}
        </GameContext.Provider>
    );
};
