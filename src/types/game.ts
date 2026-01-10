export type GameMode = 'classic' | '3-fach';

export type RowKey = '9' | '10' | 'B' | 'D' | 'K' | 'A' | 'S' | 'F' | 'P' | 'G';

export const ROW_KEYS: RowKey[] = ['9', '10', 'B', 'D', 'K', 'A', 'S', 'F', 'P', 'G'];

export interface Player {
  id: string;
  name: string;
  // Scores for each column.
  // Classic = 1 column (index 0 used)
  // 3-Fach = 3 columns
  columns: ScoreColumn[];
}

export type ScoreColumn = {
  [key in RowKey]: number | null;
};

export interface GameState {
  players: Player[];
  mode: GameMode;
  currentTurnPlayerIndex: number;
  isGameStarted: boolean;
}

export interface GameContextType extends GameState {
  startGame: (playerNames: string[], mode: GameMode) => void;
  updateScore: (playerId: string, colIndex: number, rowKey: RowKey, value: number | null) => void;
  resetGame: () => void;
  currentPlayerId: string | null;
  isGameComplete: boolean;
  getWinner: () => { player: Player; total: number } | null;
}
