import { useState, useEffect } from 'react';
import { ref, onValue, push, query, orderByChild, limitToLast } from 'firebase/database';
import { db, ensureAppCheck } from '../utils/firebase';
import type { GameMode } from '../types/game';
import { useToast } from './useToast';
import { PENDING_SCORES_KEY, type PendingScore } from './useOfflineSync';

export interface LeaderboardEntry {
    id: string;
    username: string;
    score: number;
    timestamp: number;
}

export const useLeaderboard = () => {
    const [scoresClassic, setScoresClassic] = useState<LeaderboardEntry[]>([]);
    const [scores2Fach, setScores2Fach] = useState<LeaderboardEntry[]>([]);
    const [scores3Fach, setScores3Fach] = useState<LeaderboardEntry[]>([]);
    const [loadingClassic, setLoadingClassic] = useState(true);
    const [loading2Fach, setLoading2Fach] = useState(true);
    const [loading3Fach, setLoading3Fach] = useState(true);

    const loading = loadingClassic || loading2Fach || loading3Fach;

    const { showToast } = useToast();

    useEffect(() => {
        let classicUnsubscribe: (() => void) | undefined;
        let fach2Unsubscribe: (() => void) | undefined;
        let fach3Unsubscribe: (() => void) | undefined;

        const setupListeners = async () => {
            try {
                await ensureAppCheck();

                // Query for classic mode, ordered by score, limit to top 50
                const classicRef = query(ref(db, 'leaderboard/classic'), orderByChild('score'), limitToLast(50));
                classicUnsubscribe = onValue(classicRef, (snapshot) => {
                    const data = snapshot.val();
                    const entries = data ? Object.entries(data).map(([key, value]: [string, any]) => ({
                        id: key,
                        ...value
                    })) : [];
                    // Realtime DB order is ascending when using limitToLast with positive numbers, 
                    // so highest score is at the end. We reverse to show highest score first.
                    setScoresClassic(entries.sort((a, b) => b.score - a.score));
                    setLoadingClassic(false);
                }, (error) => {
                    console.error("Firebase read error (classic):", error.message);
                    setLoadingClassic(false);
                });

                // Query for 2-fach mode, ordered by score, limit to top 50
                const fach2Ref = query(ref(db, 'leaderboard/2-fach'), orderByChild('score'), limitToLast(50));
                fach2Unsubscribe = onValue(fach2Ref, (snapshot) => {
                    const data = snapshot.val();
                    const entries = data ? Object.entries(data).map(([key, value]: [string, any]) => ({
                        id: key,
                        ...value
                    })) : [];
                    setScores2Fach(entries.sort((a, b) => b.score - a.score));
                    setLoading2Fach(false);
                }, (error) => {
                    console.error("Firebase read error (2-fach):", error.message);
                    setLoading2Fach(false);
                });

                // Query for 3-fach mode, ordered by score, limit to top 50
                const fach3Ref = query(ref(db, 'leaderboard/3-fach'), orderByChild('score'), limitToLast(50));
                fach3Unsubscribe = onValue(fach3Ref, (snapshot) => {
                    const data = snapshot.val();
                    const entries = data ? Object.entries(data).map(([key, value]: [string, any]) => ({
                        id: key,
                        ...value
                    })) : [];
                    setScores3Fach(entries.sort((a, b) => b.score - a.score));
                    setLoading3Fach(false);
                }, (error) => {
                    console.error("Firebase read error (3-fach):", error.message);
                    setLoading3Fach(false);
                });

            } catch (error) {
                console.error("App Check initialization failed:", error);
                setLoadingClassic(false);
                setLoading2Fach(false);
                setLoading3Fach(false);
            }
        };

        setupListeners();

        return () => {
            if (classicUnsubscribe) classicUnsubscribe();
            if (fach2Unsubscribe) fach2Unsubscribe();
            if (fach3Unsubscribe) fach3Unsubscribe();
        };
    }, []);

    const submitScore = async (username: string, score: number, mode: GameMode) => {
        const timestamp = Date.now();
        
        const saveOffline = () => {
            const newPending: PendingScore = {
                id: Math.random().toString(36).substring(2, 9),
                username,
                score,
                mode,
                timestamp
            };
            const stored = localStorage.getItem(PENDING_SCORES_KEY);
            const pendingScores: PendingScore[] = stored ? JSON.parse(stored) : [];
            pendingScores.push(newPending);
            localStorage.setItem(PENDING_SCORES_KEY, JSON.stringify(pendingScores));
            showToast('Offline: Eintrag lokal gecached. Wird gesendet, sobald die Verbindung wiederhergestellt ist.', 'warning');
        };

        if (!navigator.onLine) {
            saveOffline();
            return;
        }

        try {
            await ensureAppCheck();
            const path = mode === 'classic' ? 'leaderboard/classic' : mode === '2-fach' ? 'leaderboard/2-fach' : 'leaderboard/3-fach';
            const newScoreRef = ref(db, path);
            await push(newScoreRef, { username, score, timestamp });
            console.log("Score submitted successfully!");
        } catch (error) {
            console.error("Error submitting score: ", error);
            saveOffline();
        }
    };

    return {
        scoresClassic,
        scores2Fach,
        scores3Fach,
        submitScore,
        loading
    };
};
