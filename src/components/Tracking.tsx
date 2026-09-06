import { useMemo } from "react";
import { useOnlineStatusContext } from "../hooks/useOnlineStatusContext";
import {
  formatDateTime,
  formatDuration,
  periodDurationMs,
} from "../utils/format";
import "../styles/Tracking.css";

export default function Tracking() {
  const { offlinePeriods, resetTracking, lastChecked } =
    useOnlineStatusContext();

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;
  const { completedPeriods, openPeriod } = useMemo(() => {
    const completed = offlinePeriods.filter((p) => p.end !== null).reverse();
    const open = offlinePeriods.find((p) => p.end === null) ?? null;
    return { completedPeriods: completed, openPeriod: open };
  }, [offlinePeriods]);

  return (
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
          <button type="button" className="reset-btn" onClick={resetTracking}>
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
  );
}
