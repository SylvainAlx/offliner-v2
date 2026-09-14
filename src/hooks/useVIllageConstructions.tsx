import { useEffect } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";
import {
  COMPANION_INVOCATION_COST,
  HOUSE_CONSTRUCTION_COST,
} from "../utils/constants";
import type { PendingElement } from "../models/village";
import { formatCountdown } from "../utils/format";

export function useVillageConstructions() {
  const user = useUser((state) => state.user);
  const buildHouse = useUser((state) => state.buildHouse);
  const invokeCompanion = useUser((state) => state.invokeCompanion);

  const completePendingElements = useUser(
    (state) => state.completePendingElements,
  );
  const { isOnline, totalOfflineMs } = useOnlineStatus();
  const { houses, pendingElements } = user.village;
  const liveOfflinium = user.getAvailableOfflinium(totalOfflineMs);
  const pendingHouses = pendingElements.filter(
    (pending) => pending.type === "house",
  );
  const pendingCompanions = pendingElements.filter(
    (pending) => pending.type === "companion",
  );

  useEffect(() => {
    completePendingElements(totalOfflineMs);
  }, [completePendingElements, totalOfflineMs]);

  const canBuildHouse = liveOfflinium >= HOUSE_CONSTRUCTION_COST;
  const hasCompanionSlot = user.village.canInvokeCompanion();
  const canInvoke =
    hasCompanionSlot && liveOfflinium >= COMPANION_INVOCATION_COST;

  const renderProgress = (pending: PendingElement) => {
    const queueIndex = pendingElements.findIndex(
      (element) => element.id === pending.id,
    );
    const isActive = queueIndex === 0;
    const elapsed = isActive
      ? Math.max(0, totalOfflineMs - pending.offlineMsAtStart)
      : 0;
    const remaining = pending.constructionOfflineMs - elapsed;
    const progress = isActive
      ? Math.min(
          100,
          Math.max(0, (elapsed / pending.constructionOfflineMs) * 100),
        )
      : 0;

    return (
      <span className="craft-tile-progress" key={pending.id}>
        <span className="craft-tile-progress-label">
          <span>
            {isActive
              ? isOnline
                ? "En attente hors ligne"
                : pending.type === "house"
                  ? "Construction"
                  : "Invocation"
              : `En file · position ${queueIndex + 1}`}
          </span>
          <strong>{isActive ? formatCountdown(remaining) : "—"}</strong>
        </span>
        <span className="craft-tile-progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </span>
      </span>
    );
  };

  return {
    houses,
    canBuildHouse,
    buildHouse,
    canInvoke,
    invokeCompanion,
    pendingElements,
    pendingHouses,
    renderProgress,
    pendingCompanions,
    totalOfflineMs,
    liveOfflinium,
    hasCompanionSlot,
  };
}
