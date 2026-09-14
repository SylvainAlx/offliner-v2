import { useVillageHouses } from "../hooks/useVillageHouses";
import VillageSection from "./VillageSection";
import "../styles/VillageHouses.css";

export default function VillageHouses() {
  const { houses } = useVillageHouses();
  return (
    <VillageSection
      title="Vos maisons"
      subtitle="Chaque maison accueille jusqu'à 4 compagnons."
    >
      <div className="village-house-summary">
        <span className="village-count">{houses.length}</span>
        <span aria-hidden="true">🏠</span>
      </div>
    </VillageSection>
  );
}
