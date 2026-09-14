import { useVillageConstructions } from "../hooks/useVIllageConstructions";
import {
  COMPANION_INVOCATION_COST,
  HOUSE_CONSTRUCTION_COST,
} from "../utils/constants";
import { BuildButton } from "./BuildButton";
import PendingElement from "./PendingElement";
import VillageSection from "./VillageSection";
import "../styles/VillageConstructions.css";

export default function VillageConstructions() {
  const {
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
  } = useVillageConstructions();
  return (
    <VillageSection
      title="À construire"
      subtitle="Chaque élément avance pendant vos périodes hors ligne."
    >
      <div className="craft-tile-grid">
        <BuildButton
          elementName="Maison"
          icon="🏠"
          canBuild={canBuildHouse}
          onClick={() => buildHouse(totalOfflineMs)}
          cost={HOUSE_CONSTRUCTION_COST}
          pendingElements={pendingHouses}
          renderProgress={renderProgress}
          liveOfflinium={liveOfflinium}
          craftTime="2 min"
        >
          {canBuildHouse
            ? "Construire"
            : `Il vous manque ${HOUSE_CONSTRUCTION_COST - liveOfflinium} ⬡`}
        </BuildButton>
        <BuildButton
          elementName="Compagnon"
          icon="🐾"
          canBuild={canInvoke}
          onClick={() => invokeCompanion(totalOfflineMs)}
          cost={COMPANION_INVOCATION_COST}
          pendingElements={pendingCompanions}
          renderProgress={renderProgress}
          liveOfflinium={liveOfflinium}
          craftTime="1 min"
        >
          {houses.length === 0
            ? "Construisez d'abord une maison"
            : !hasCompanionSlot
              ? "Quota atteint : construisez plus de maisons ou libérez un compagnon"
              : canInvoke
                ? "Invoquer"
                : `Il vous manque ${COMPANION_INVOCATION_COST - liveOfflinium} ⬡`}
        </BuildButton>
      </div>
      {pendingElements.length > 0 && (
        <div
          className="craft-queue-cancel-list"
          aria-label="Constructions en cours"
        >
          {pendingElements.map((pending, index) => (
            <PendingElement key={pending.id} pending={pending} index={index} />
          ))}
        </div>
      )}
    </VillageSection>
  );
}
