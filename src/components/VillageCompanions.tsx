import { useVillageCompanions } from "../hooks/useVillageCompanions";
import CompanionTile from "./CompanionTile";
import VillageSection from "./VillageSection";
import "../styles/VillageCompanions.css";

export default function VillageCompanions() {
  const { houses, companions, companionCapacity } = useVillageCompanions();

  return (
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
  );
}
