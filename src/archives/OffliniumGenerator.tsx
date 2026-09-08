import { useState, useEffect, useRef, useMemo } from "react";
import { useOnlineStatus } from "../contexts/OnlineStatusContext";
import "../styles/OffliniumGenerator.css";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";


export default function OffliniumGenerator() {
  const { isOnline, totalOfflineMs } = useOnlineStatus();

  const totalOfflinium = Math.floor(totalOfflineMs / OFFLINIUM_DELIVERY_INTERVAL);
  const cycleMs = totalOfflineMs % OFFLINIUM_DELIVERY_INTERVAL;
  const cycleSeconds = Math.floor(cycleMs / 1000);
  const remainingSeconds = 60 - cycleSeconds;
  const cyclePercent = Math.min(100, Math.max(0, (cycleMs / OFFLINIUM_DELIVERY_INTERVAL) * 100));

  // Trigger burst effect when offlinium increases
  const [showBurst, setShowBurst] = useState(false);
  const prevOffliniumRef = useRef(totalOfflinium);

  useEffect(() => {
    if (totalOfflinium > prevOffliniumRef.current) {
      setShowBurst(true);
      const timer = setTimeout(() => setShowBurst(false), 1200);
      prevOffliniumRef.current = totalOfflinium;
      return () => clearTimeout(timer);
    }
    prevOffliniumRef.current = totalOfflinium;
  }, [totalOfflinium]);

  // Circumference for the circular progress bar (r = 54 => 2 * pi * 54 ~= 339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cyclePercent / 100) * circumference;

  const statusMessage = useMemo(() => {
    if (!isOnline) {
      return `Extraction active : prochain cristal dans ${remainingSeconds}s`;
    }
    return `En pause : déconnectez-vous pour finir le cycle (${remainingSeconds}s restantes)`;
  }, [isOnline, remainingSeconds]);

  return (
    <div className={`offlinium-card ${!isOnline ? "extracting" : "idle"}`}>
      <div className="offlinium-header">
        <div className="offlinium-title-group">
          <span className="offlinium-badge-icon">⚛️</span>
          <div>
            <h3 className="offlinium-title">Réacteur d'Offlinium</h3>
            <p className="offlinium-rate">Taux : 1 ⬡ / {OFFLINIUM_DELIVERY_INTERVAL / 1000} secondes hors ligne</p>
          </div>
        </div>
        <div className="offlinium-total-chip">
          <span className="chip-label">Réserve</span>
          <span className="chip-value">{totalOfflinium} ⬡</span>
        </div>
      </div>

      <div className="reactor-core-wrapper">
        <div className="reactor-visual">
          <svg className="reactor-svg" viewBox="0 0 130 130">
            {/* Background ring */}
            <circle
              className="reactor-track"
              cx="65"
              cy="65"
              r={radius}
            />
            {/* Progress ring */}
            <circle
              className="reactor-progress"
              cx="65"
              cy="65"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Central orb */}
          <div className="reactor-orb">
            <span className="orb-crystal">✨</span>
            <span className="orb-seconds">
              {`${cycleSeconds}s`}
            </span>
            <span className="orb-max">/ {OFFLINIUM_DELIVERY_INTERVAL / 1000}s</span>
          </div>

          {/* Animated particle burst on +1 */}
          {showBurst && (
            <div className="particle-burst">
              <span className="burst-particle">+1 ⬡</span>
            </div>
          )}
        </div>

        <div className="reactor-info">
          <div className="reactor-status-tag">
            <span className="status-ping"></span>
            <span className="status-tag-text">{statusMessage}</span>
          </div>

          <div className="reactor-bar-container">
            <div className="reactor-bar-labels">
              <span>Cycle de synthèse</span>
              <span>{Math.round(cyclePercent)}%</span>
            </div>
            <div className="reactor-progress-bar">
              <div
                className="reactor-progress-fill"
                style={{ width: `${cyclePercent}%` }}
              />
            </div>
          </div>

          <p className="reactor-hint">
            💡 <strong>1 {OFFLINIUM_DELIVERY_INTERVAL / 1000} secondes hors-ligne = 1 Offlinium</strong> accumulé.
          </p>
        </div>
      </div>
    </div>
  );
}
