import { useEffect } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";
import {
  COMPANION_INVOCATION_COST,
  HOUSE_CONSTRUCTION_COST,
} from "../utils/constants";
import { formatCountdown } from "../utils/format";
import type { PendingElement } from "../models/village";
import "../styles/Village.css";
import CompanionTile from "./CompanionTile";
import Card from "./ui/Card";
import VillageSection from "./VillageSection";

export default function Village() {
  const user = useUser((state) => state.user);
  const buildHouse = useUser((state) => state.buildHouse);
  const invokeCompanion = useUser((state) => state.invokeCompanion);
  const cancelPendingElement = useUser((state) => state.cancelPendingElement);
  const completePendingElements = useUser(
    (state) => state.completePendingElements,
  );
  const { isOnline, totalOfflineMs } = useOnlineStatus();
  const { houses, companions, pendingElements } = user.village;
  const liveOfflinium = user.getAvailableOfflinium(totalOfflineMs);
  const pendingHouses = pendingElements.filter(
    (pending) => pending.type === "house",
  );
  const pendingCompanions = pendingElements.filter(
    (pending) => pending.type === "companion",
  );
  const companionCapacity = user.village.companionCapacity;

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

  return (
    <Card
      ariaLabel="Village"
      title="Village"
      subtitle="Utilisez vos périodes hors ligne pour développer votre village."
    >
      <VillageSection
        title="Vos maisons"
        subtitle="Chaque maison accueille jusqu'à 4 compagnons."
      >
        <div className="village-house-summary">
          <span className="village-count">{houses.length}</span>
          <span aria-hidden="true">🏠</span>
          <span>
            Capacité actuelle : <strong>{companionCapacity}</strong> compagnons
          </span>
        </div>
      </VillageSection>
      <VillageSection
        title="Vos compagnons"
        subtitle="Votre population utilise les places disponibles dans vos maisons."
      >
        <span className="village-count">
          {companions.length}/{companionCapacity}
        </span>
        {companions.length > 0 ? (
          <ul className="companion-list">
            {companions.map((companion) => (
              <CompanionTile companion={companion} key={companion.id} />
            ))}
          </ul>
        ) : (
          <div className="village-empty-state">
            <span className="village-empty-icon" aria-hidden="true">
              ◇
            </span>
            <p>Votre village n&apos;a pas encore de compagnon.</p>
            <span>
              {houses.length === 0
                ? "Construisez d'abord une maison."
                : "La première invocation vous attend."}
            </span>
          </div>
        )}
      </VillageSection>
      <VillageSection
        title="À construire"
        subtitle="Chaque élément avance pendant vos périodes hors ligne."
      >
        <div className="craft-tile-grid">
          <button
            type="button"
            className={`craft-tile${canBuildHouse ? "" : " craft-tile-unavailable"}`}
            onClick={() => buildHouse(totalOfflineMs)}
            disabled={!canBuildHouse}
            aria-label={`Construire une maison pour ${HOUSE_CONSTRUCTION_COST} orbes d'Offlinium`}
          >
            <span className="craft-tile-topline">
              <span className="craft-tile-icon" aria-hidden="true">
                🏠
              </span>
              <span className="craft-tile-cost">
                {HOUSE_CONSTRUCTION_COST} ⬡
              </span>
            </span>
            <strong>Maison</strong>
            <span className="craft-tile-description">⏳ 5 min hors ligne</span>

            {pendingHouses.length > 0 && (
              <span className="craft-tile-progress-list">
                {pendingHouses.map(renderProgress)}
              </span>
            )}

            <span className="craft-tile-action">
              {canBuildHouse
                ? "Construire"
                : `Il vous manque ${HOUSE_CONSTRUCTION_COST - liveOfflinium} ⬡`}
            </span>
          </button>

          <button
            type="button"
            className={`craft-tile${canInvoke ? "" : " craft-tile-unavailable"}`}
            onClick={() => invokeCompanion(totalOfflineMs)}
            disabled={!canInvoke}
            aria-label={`Invoquer un compagnon pour ${COMPANION_INVOCATION_COST} orbes d'Offlinium`}
          >
            <span className="craft-tile-topline">
              <span className="craft-tile-icon" aria-hidden="true">
                🐾
              </span>
              <span className="craft-tile-cost">
                {COMPANION_INVOCATION_COST} ⬡
              </span>
            </span>
            <strong>Compagnon</strong>
            <span className="craft-tile-description">⏳ 1 min hors ligne</span>

            {pendingCompanions.length > 0 && (
              <span className="craft-tile-progress-list">
                {pendingCompanions.map(renderProgress)}
              </span>
            )}

            <span className="craft-tile-action">
              {houses.length === 0
                ? "Construisez d'abord une maison"
                : !hasCompanionSlot
                  ? "Quota atteint : construisez plus de maisons ou libérez un compagnon"
                  : canInvoke
                    ? "Invoquer"
                    : `Il vous manque ${COMPANION_INVOCATION_COST - liveOfflinium} ⬡`}
            </span>
          </button>
        </div>
        {pendingElements.length > 0 && (
          <div
            className="craft-queue-cancel-list"
            aria-label="Constructions en cours"
          >
            {pendingElements.map((pending, index) => (
              <div className="craft-queue-cancel-item" key={pending.id}>
                <span>
                  {pending.type === "house" ? "Maison" : "Compagnon"} ·{" "}
                  {index === 0 ? "en cours" : `en file ${index + 1}`}
                </span>
                <button
                  type="button"
                  className="craft-cancel-button"
                  onClick={() =>
                    cancelPendingElement(pending.id, totalOfflineMs)
                  }
                >
                  Annuler · rembourser{" "}
                  {pending.storedOffliniumCost +
                    pending.openPeriodOffliniumCost}{" "}
                  ⬡
                </button>
              </div>
            ))}
          </div>
        )}
      </VillageSection>
    </Card>
  );
}
