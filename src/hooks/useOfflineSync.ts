import { useEffect, useCallback } from 'react';
import { ref, push } from 'firebase/database';
import { db, ensureAppCheck } from '../utils/firebase';
import { useToast } from './useToast';
import { useNetworkStatus } from './useNetworkStatus';
import type { GameMode } from '../types/game';

export const PENDING_SCORES_KEY = 'pokelinger_pending_scores';
let isSyncing = false;

export interface PendingScore {
    id: string;
    username: string;
    score: number;
    mode: GameMode;
    timestamp: number;
}

export const useOfflineSync = () => {
    const isOnline = useNetworkStatus();
    const { showToast } = useToast();

    const syncPendingScores = useCallback(async () => {
        if (isSyncing) return;
        
        const stored = localStorage.getItem(PENDING_SCORES_KEY);
        if (!stored) return;

        isSyncing = true;
        let pendingScores: PendingScore[] = [];
        
        try {
            pendingScores = JSON.parse(stored);
            if (pendingScores.length === 0) {
                isSyncing = false;
                return;
            }

            localStorage.removeItem(PENDING_SCORES_KEY);

            let successCount = 0;
            const remainingScores: PendingScore[] = [];

            for (const item of pendingScores) {
                try {
                    await ensureAppCheck();
                    const path = item.mode === 'classic' ? 'leaderboard/classic' : item.mode === '2-fach' ? 'leaderboard/2-fach' : 'leaderboard/3-fach';
                    const newScoreRef = ref(db, path);
                    await push(newScoreRef, {
                        username: item.username,
                        score: item.score,
                        timestamp: item.timestamp
                    });
                    successCount++;
                } catch (err) {
                    console.error("Failed to sync score", item, err);
                    remainingScores.push(item);
                }
            }

            if (remainingScores.length > 0) {
                const concurrentStored = localStorage.getItem(PENDING_SCORES_KEY);
                const concurrentScores: PendingScore[] = concurrentStored ? JSON.parse(concurrentStored) : [];
                localStorage.setItem(PENDING_SCORES_KEY, JSON.stringify([...remainingScores, ...concurrentScores]));
            }

            if (successCount > 0) {
                showToast('Offline-Einträge erfolgreich synchronisiert!', 'success');
            }
        } catch (e) {
            console.error("Error syncing scores from localStorage", e);
            if (pendingScores.length > 0) {
                const concurrentStored = localStorage.getItem(PENDING_SCORES_KEY);
                const concurrentScores: PendingScore[] = concurrentStored ? JSON.parse(concurrentStored) : [];
                localStorage.setItem(PENDING_SCORES_KEY, JSON.stringify([...pendingScores, ...concurrentScores]));
            }
        } finally {
            isSyncing = false;
        }
    }, [showToast]);

    useEffect(() => {
        if (isOnline) {
            syncPendingScores();
        }
    }, [isOnline, syncPendingScores]);
};
