import Card from "./ui/Card";
import { useVillage } from "../hooks/useVillage";
import VillageCompanions from "./VillageCompanions";
import "../styles/Village.css";
import VillageHouses from "./VillageHouses";
import VillageConstructions from "./VillageConstructions";

export default function Village() {
  const {
    isOnline
  } = useVillage();

  return (
    <Card
      ariaLabel="Village"
      title="Village"
      subtitle={isOnline ? "Coupez internet pour développer votre village." : "Profitez de ce temps hors ligne pour développer votre village."}
    >
      <VillageHouses />
      <VillageCompanions />
      <VillageConstructions />
    </Card>
  );
}
