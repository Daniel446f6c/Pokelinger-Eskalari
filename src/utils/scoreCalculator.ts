import type { RowKey } from '../types/game';

// Dice Face Values
export const FACE_VALUES: Record<string, number> = {
    '9': 1,
    '10': 2,
    'B': 3,
    'D': 4,
    'K': 5,
    'A': 6
};

// Base Scores
export const BASE_SCORES: Record<string, number> = {
    'S': 20,
    'F': 30,
    'P': 50,
    'G': 70
};

export const FACES = ['9', '10', 'B', 'D', 'K', 'A'];

export function calculateSpecialScore(
    type: RowKey,
    isServiert: boolean,
    faces: { main: string, secondary?: string } // main used for P, G, F(Trip). secondary for F(Pair)
): number {
    if (!['S', 'F', 'P', 'G'].includes(type)) return 0;

    const base = BASE_SCORES[type] || 0;
    const multiplier = isServiert ? 2 : 1;
    const scoreBase = base * multiplier;

    let diceSum = 0;

    if (type === 'G') {
        // 5 of a kind
        diceSum = (FACE_VALUES[faces.main] || 0) * 5;
    } else if (type === 'P') {
        // 4 of a kind
        diceSum = (FACE_VALUES[faces.main] || 0) * 4 + (FACE_VALUES[faces.secondary || ''] || 0);
    } else if (type === 'F') {
        // 3 of main + 2 of secondary
        diceSum = (FACE_VALUES[faces.main] || 0) * 3 + (FACE_VALUES[faces.secondary || ''] || 0) * 2;
    } else if (type === 'S') {
        // Straight - Fixed values, no dice sum added
        // "Große Straße" (10-A) = 25 Base. Serviert = 50.
        // "Kleine Straße" (9-K) = 20 Base. Serviert = 40.
        const isLarge = faces.main === 'A';
        const baseVal = isLarge ? 25 : 20;
        return isServiert ? baseVal * 2 : baseVal;
    }

    return scoreBase + diceSum;
}
