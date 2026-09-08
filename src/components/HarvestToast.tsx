import { useState, useEffect, useRef } from "react";
import { useOnlineStatusContext } from "../hooks/useOnlineStatusContext";
import { useUserContext } from "../hooks/useUserContext";
import "../styles/HarvestToast.css";

export default function HarvestToast() {
  const { isOnline } = useOnlineStatusContext();
  const { user } = useUserContext();
  const [harvestData, setHarvestData] = useState<{ amount: number; durationMin: number } | null>(null);
  const wasOfflineRef = useRef(!isOnline);

  useEffect(() => {
    // Detect transition from offline to online
    if (wasOfflineRef.current && isOnline) {
      // Find the most recently completed period
      const completed = user.periodList.periods.filter((p) => p.end !== null);
      if (completed.length > 0) {
        const lastPeriod = completed[completed.length - 1];
        const durationMs = (lastPeriod.end ?? Date.now()) - lastPeriod.start;
        const durationMin = Math.floor(durationMs / 60000);
        const amount = Math.floor(durationMs / 60000);

        if (amount > 0) {
          setHarvestData({ amount, durationMin });
          const timer = setTimeout(() => setHarvestData(null), 6000);
          return () => clearTimeout(timer);
        }
      }
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline, user]);

  if (!harvestData) return null;

  return (
    <div className="harvest-toast-overlay">
      <div className="harvest-toast-card">
        <div className="harvest-icon-wrap">
          <span className="harvest-icon">🎉</span>
        </div>
        <div className="harvest-content">
          <h4 className="harvest-title">Récolte d'Offlinium réussie !</h4>
          <p className="harvest-desc">
            Vous avez passé <strong>{harvestData.durationMin} min</strong> hors ligne et extrait{" "}
            <span className="harvest-highlight">+{harvestData.amount} Offlinium</span> ✨
          </p>
        </div>
        <button
          type="button"
          className="harvest-close-btn"
          onClick={() => setHarvestData(null)}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
