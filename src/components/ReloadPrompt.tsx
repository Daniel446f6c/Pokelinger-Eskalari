import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      if (r) {
        // Alle 2 Stunden nach Updates suchen (2 * 60 * 60 * 1000)
        setInterval(() => {
          r.update();
        }, 2 * 60 * 60 * 1000);

        // Oder bei jedem neuen Öffnen/Zurückholen in den Vordergrund nach Updates suchen
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            r.update();
          }
        });
      }
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="pwa-toast-container">
      {(offlineReady || needRefresh) && (
        <div className="pwa-toast glass-panel">
          <div className="pwa-message">
            {offlineReady ? (
              <span>App ist auf dem neuesten Stand</span>
            ) : (
              <span>Neues Update verfügbar! Jetzt durchführen?</span>
            )}
          </div>
          <div className="pwa-buttons">
            {needRefresh && (
              <button className="btn-primary" onClick={() => updateServiceWorker(true)}>
                Update
              </button>
            )}
            <button className="btn-ghost" onClick={close}>
              {needRefresh ? 'Später' : 'Schließen'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReloadPrompt;