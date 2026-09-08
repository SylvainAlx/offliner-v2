import { useMemo } from "react";
import { useOnlineStatus } from "../contexts/OnlineStatusContext";
import {
  formatDateTime,
  formatDuration,
} from "../utils/format";
import "../styles/Tracking.css";
import { useUser } from "../contexts/UserContext";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";

export default function Tracking() {
  const { resetTracking, lastChecked } = useOnlineStatus();
  const { user } = useUser();

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;
  const { completedPeriods, openPeriod } = useMemo(() => {
    const completed = user.periodList.periods.filter((p) => p.end !== null).reverse();
    const open = user.periodList.periods.find((p) => p.end === null) ?? null;
    return { completedPeriods: completed, openPeriod: open };
  }, [user]);

  return (
    <div className="tracking-card">
      <button onClick={() => console.log(user)}>LOG</button>
      <div className="tracking-header">
        <div>
          <h3>📊 Historique</h3>
          <p className="tracking-sub">
            {user.periodList.periods.length} période
            {user.periodList.periods.length > 1 ? "s" : ""} enregistrée
            {user.periodList.periods.length > 1 ? "s" : ""}
          </p>
        </div>
        {user.periodList.periods.length > 0 && (
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
              <div className="period-metrics">
                <span className="period-duration">
                  {formatDuration(openPeriod.getPeriodDurationMs(now))}
                </span>
                <span className="period-offlinium-tag active">
                  +{Math.floor(openPeriod.getPeriodDurationMs(now) / OFFLINIUM_DELIVERY_INTERVAL)} ⬡
                </span>
              </div>
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
            const safeIndex = user.periodList.periods.findIndex(
              (p) => p.start === period.start && p.end === period.end,
            );
            const durationMs = period.getPeriodDurationMs() ?? 0;
            const offliniumGain = period.getOffliniumGain();

            return (
              <li
                key={`${period.start}-${period.end}-${safeIndex}-${index}`}
                className="period-item"
              >
                <div className="period-dot"></div>
                <div className="period-content">
                  <div className="period-top">
                    <span className="period-status">Terminée</span>
                    <div className="period-metrics">
                      <span className="period-duration">
                        {formatDuration(durationMs)}
                      </span>
                      {offliniumGain > 0 && (
                        <span className="period-offlinium-tag">
                          +{offliniumGain} ⬡
                        </span>
                      )}
                    </div>
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
