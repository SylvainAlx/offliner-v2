import { useMemo } from "react";
import { useOnlineStatus, type OfflinePeriod } from "./hooks/useOnlineStatus";
import { useDeviceType } from "./hooks/useDeviceType";
import "./App.css";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0) parts.push(`${seconds}s`);
  else if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length === 0) return "0s";
  return parts.join(" ");
}

function periodDurationMs(period: OfflinePeriod, now: number): number {
  const end = period.end ?? now;
  return Math.max(0, end - period.start);
}

function DesktopGate({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="gate-container">
      <div className="gate-card">
        <div className="gate-icon" aria-hidden="true">
          <div className="phone-svg">
            <div className="phone-body">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="phone-wave"></div>
              </div>
              <div className="phone-button"></div>
            </div>
            <div className="phone-arrow">→</div>
          </div>
        </div>

        <h1 className="gate-title">Utilisez Offliner sur mobile</h1>
        <p className="gate-lead">
          Offliner est conçu pour vous aider à <strong>déconnecter</strong>{" "}
          depuis votre téléphone.
        </p>

        <ul className="gate-reasons">
          <li>
            <span className="gate-bullet">🌱</span>
            Retrouvez la maîtrise de votre temps d'écran
          </li>
          <li>
            <span className="gate-bullet">📴</span>
            Activez le mode avion et suivez vos sessions
          </li>
          <li>
            <span className="gate-bullet">🎯</span>
            Des habitudes numériques plus saines
          </li>
        </ul>

        <div className="gate-cta">
          <p className="gate-cta-text">
            Ouvrez cette page dans le navigateur de votre téléphone :
          </p>
          <div className="gate-url" title="URL de la page">
            {typeof window !== "undefined" ? window.location.href : "..."}
          </div>
        </div>

        <button type="button" className="gate-bypass" onClick={onContinue}>
          Continuer sur desktop (aperçu)
        </button>
      </div>
    </div>
  );
}

function App() {
  const device = useDeviceType();
  const {
    isOnline,
    lastChecked,
    offlinePeriods,
    totalOfflineMs,
    resetTracking,
  } = useOnlineStatus();

  const { completedPeriods, openPeriod } = useMemo(() => {
    const completed = offlinePeriods.filter((p) => p.end !== null).reverse();
    const open = offlinePeriods.find((p) => p.end === null) ?? null;
    return { completedPeriods: completed, openPeriod: open };
  }, [offlinePeriods]);

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;

  if (device.isDesktop && !sessionStorage.getItem("offliner:bypass-desktop")) {
    return (
      <DesktopGate
        onContinue={() => {
          sessionStorage.setItem("offliner:bypass-desktop", "1");
          window.dispatchEvent(new Event("resize"));
        }}
      />
    );
  }

  return (
    <div className={`app-container ${isOnline ? "online" : "offline"}`}>
      <header className="app-header">
        <h1>Offliner</h1>
        <p className="app-subtitle">Détecteur de connexion</p>
      </header>

      <main className="app-main">
        <div className="status-card">
          <div
            className={`status-indicator ${isOnline ? "pulse-online" : "pulse-offline"}`}
          >
            <div className="status-dot"></div>
          </div>

          <div className="status-content">
            <h2
              className={`status-title ${isOnline ? "text-online" : "text-offline"}`}
            >
              {isOnline ? "En ligne" : "Hors ligne"}
            </h2>
            <p className="status-description">
              {isOnline
                ? "Votre appareil est connecté à Internet."
                : "Votre appareil n'est pas connecté à Internet."}
            </p>
          </div>

          <div className="status-details">
            <div className="detail-item">
              <span className="detail-label">Dernier contrôle</span>
              <span className="detail-value">{formatDate(lastChecked)}</span>
            </div>
            <div className="detail-item highlight">
              <span className="detail-label">Temps total hors ligne</span>
              <span className="detail-value strong">
                {formatDuration(totalOfflineMs)}
              </span>
            </div>
          </div>
        </div>

        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <h3>📊 Historique</h3>
              <p className="tracking-sub">
                {offlinePeriods.length} période
                {offlinePeriods.length > 1 ? "s" : ""} enregistrée
                {offlinePeriods.length > 1 ? "s" : ""}
              </p>
            </div>
            {offlinePeriods.length > 0 && (
              <button
                type="button"
                className="reset-btn"
                onClick={resetTracking}
              >
                Réinitialiser
              </button>
            )}
          </div>

          {openPeriod && (
            <div className="period-item period-open">
              <div className="period-dot period-dot-active"></div>
              <div className="period-content">
                <div className="period-top">
                  <span className="period-status">En cours…</span>
                  <span className="period-duration">
                    {formatDuration(periodDurationMs(openPeriod, now))}
                  </span>
                </div>
                <div className="period-time">
                  Débuté le {formatDateTime(openPeriod.start)}
                </div>
              </div>
            </div>
          )}

          {completedPeriods.length > 0 ? (
            <ul className="period-list">
              {completedPeriods.map((period, index) => {
                const safeIndex = offlinePeriods.findIndex(
                  (p) => p.start === period.start && p.end === period.end,
                );
                return (
                  <li
                    key={`${period.start}-${period.end}-${safeIndex}-${index}`}
                    className="period-item"
                  >
                    <div className="period-dot"></div>
                    <div className="period-content">
                      <div className="period-top">
                        <span className="period-status">Terminée</span>
                        <span className="period-duration">
                          {formatDuration(periodDurationMs(period, now))}
                        </span>
                      </div>
                      <div className="period-time">
                        {formatDateTime(period.start)} →{" "}
                        {formatDateTime(period.end!)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            !openPeriod && (
              <div className="empty-state">
                <p>Aucune période hors ligne enregistrée.</p>
                <p className="empty-hint">
                  Déconnectez-vous pour commencer le suivi.
                </p>
              </div>
            )
          )}
        </div>

        <div className="info-card">
          <h3>💡 Comment tester ?</h3>
          <p>
            Activez/désactivez le mode avion ou votre connexion Wi-Fi/données
            mobiles.
          </p>
          <p>
            Vous pouvez aussi utiliser les outils de développement de votre
            navigateur (Network → Offline).
          </p>
        </div>
      </main>

      <footer className="app-footer">
        <p>POC Offliner — Détection et suivi de connexion</p>
      </footer>
    </div>
  );
}

export default App;
