import { usePendingElement } from "../hooks/usePendingElement";
import type { PendingElement } from "../models/village";
import "../styles/PendingElements.css";

interface PendingElementProps {
  pending: PendingElement;
  index: number;
}

export default function PendingElement({
  pending,
  index,
}: PendingElementProps) {
  const { cancelPendingElement, totalOfflineMs } = usePendingElement();
  return (
    <div className="craft-queue-cancel-item">
      <span>
        {pending.type === "house" ? "Maison" : "Compagnon"} ·{" "}
        {index === 0 ? "en cours" : `en file ${index + 1}`}
      </span>
      <button
        type="button"
        className="craft-cancel-button"
        onClick={() => cancelPendingElement(pending.id, totalOfflineMs)}
      >
        Annuler · rembourser{" "}
        {pending.storedOffliniumCost + pending.openPeriodOffliniumCost} ⬡
      </button>
    </div>
  );
}
