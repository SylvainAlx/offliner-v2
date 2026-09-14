import {
  COMPANION_INVOCATION_COST,
  HOUSE_CONSTRUCTION_COST,
} from "../utils/constants";
import "../styles/Village.css";
import CompanionTile from "./CompanionTile";
import Card from "./ui/Card";
import VillageSection from "./VillageSection";
import { useVillage } from "../hooks/useVillage";

export default function Village() {
  const {
    houses,
    companionCapacity,
    companions,
    canBuildHouse,
    buildHouse,
    canInvoke,
    invokeCompanion,
    pendingElements,
    cancelPendingElement,
    pendingHouses,
    renderProgress,
    pendingCompanions,
    totalOfflineMs,
    liveOfflinium,
    hasCompanionSlot,
  } = useVillage();

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
