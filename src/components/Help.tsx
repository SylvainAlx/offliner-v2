import "../styles/Help.css";
import {
  COMPANIONS_PER_HOUSE,
  COMPANION_EVOLUTION_COSTS,
  HOUSE_CONSTRUCTION_COST,
  OFFLINIUM_DELIVERY_INTERVAL,
} from "../utils/constants";
import Card from "./ui/Card";

export default function Help() {
  return (
    <Card
      ariaLabel="Aide et informations"
      title="Aide"
      subtitle="Comment fonctionne Offliner ?"
    >
      <p>
        <strong>
          1 particule d'Offlinium (⬡) est générée toutes les{" "}
          {OFFLINIUM_DELIVERY_INTERVAL / 1000} secondes que vous passez hors
          ligne.
        </strong>
      </p>
      <p>
        Pour tester, activez le mode avion, coupez le Wi-Fi ou utilisez l'onglet
        Réseau (Network → Offline) de vos outils de développement.
      </p>
      <p>
        Les maisons se construisent avec {HOUSE_CONSTRUCTION_COST} ⬡ et
        permettent d&apos;accueillir chacune {COMPANIONS_PER_HOUSE} compagnons.
        Votre capacité maximale augmente lorsque la construction est terminée,
        et le compteur du bouton indique le nombre de maisons construites.
      </p>
      <p>
        Chaque compagnon commence enfant. Vous pouvez le faire évoluer en
        adolescent ({COMPANION_EVOLUTION_COSTS.adolescent} ⬡), adulte (
        {COMPANION_EVOLUTION_COSTS.adult} ⬡), puis sage (
        {COMPANION_EVOLUTION_COSTS.sage} ⬡).
      </p>
      <p>
        Les compagnons évolués accélèrent la récolte : un adolescent ajoute +1
        ⬡, un adulte +2 ⬡ et un sage +3 ⬡ à chaque tranche de{" "}
        {OFFLINIUM_DELIVERY_INTERVAL / 1000} secondes hors ligne.
      </p>
    </Card>
  );
}
