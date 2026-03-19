import { useEffect, useRef } from 'react';
import { useToast } from './useToast';
import { useNetworkStatus } from './useNetworkStatus';

export const useNetworkToasts = () => {
    const isOnline = useNetworkStatus();
    const { showToast } = useToast();
    const previousState = useRef(isOnline);

    useEffect(() => {
        if (previousState.current === isOnline) {
            return;
        }
        previousState.current = isOnline;

        if (isOnline) {
            showToast('Internetverbindung wiederhergestellt.', 'success');
        } else {
            showToast('Keine Internetverbindung.', 'error');
        }
    }, [isOnline, showToast]);
};
