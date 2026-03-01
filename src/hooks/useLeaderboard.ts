import { useState, useEffect } from 'react';
import { ref, onValue, push, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../utils/firebase';
import type { GameMode } from '../types/game';

export interface LeaderboardEntry {
    id: string;
    username: string;
    score: number;
    timestamp: number;
}

export const useLeaderboard = () => {
    const [scoresClassic, setScoresClassic] = useState<LeaderboardEntry[]>([]);
    const [scores3Fach, setScores3Fach] = useState<LeaderboardEntry[]>([]);
    const [loadingClassic, setLoadingClassic] = useState(true);
    const [loading3Fach, setLoading3Fach] = useState(true);

    const loading = loadingClassic || loading3Fach;

    useEffect(() => {
        // Query for classic mode, ordered by score, limit to top 50
        const classicRef = query(ref(db, 'leaderboard/classic'), orderByChild('score'), limitToLast(50));
        const classicUnsubscribe = onValue(classicRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const entries = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value
                }));
                // Realtime DB order is ascending when using limitToLast with positive numbers, 
                // so highest score is at the end. We reverse to show highest score first.
                setScoresClassic(entries.sort((a, b) => b.score - a.score));
            } else {
                setScoresClassic([]);
            }
            setLoadingClassic(false);
        }, (error: Error) => {
            console.error("Firebase read error (classic):", error.message);
            setScoresClassic([]);
            setLoadingClassic(false);
        });

        // Query for 3-fach mode, ordered by score, limit to top 50
        const fach3Ref = query(ref(db, 'leaderboard/3-fach'), orderByChild('score'), limitToLast(50));
        const fach3Unsubscribe = onValue(fach3Ref, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const entries = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value
                }));
                setScores3Fach(entries.sort((a, b) => b.score - a.score));
            } else {
                setScores3Fach([]);
            }
            setLoading3Fach(false);
        }, (error: Error) => {
            console.error("Firebase read error (3-fach):", error.message);
            setScores3Fach([]);
            setLoading3Fach(false);
        });

        return () => {
            classicUnsubscribe();
            fach3Unsubscribe();
        };
    }, []);

    const submitScore = async (username: string, score: number, mode: GameMode) => {
        const path = mode === 'classic' ? 'leaderboard/classic' : 'leaderboard/3-fach';
        const newScoreRef = ref(db, path);
        try {
            await push(newScoreRef, {
                username,
                score,
                timestamp: Date.now()
            });
            console.log("Score submitted successfully!");
        } catch (error) {
            console.error("Error submitting score: ", error);
            // This error will trigger until user puts real credentials in firebase config,
            // which is expected per user's requests.
        }
    };

    return {
        scoresClassic,
        scores3Fach,
        submitScore,
        loading
    };
};
