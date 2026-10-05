import "../styles/Help.css";
import {
  COMPANION_EVOLUTION_COSTS,
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
        Chaque compagnon commence enfant. Vous pouvez le faire évoluer en
        adolescent ({COMPANION_EVOLUTION_COSTS.adolescent} ⬡), adulte (
        {COMPANION_EVOLUTION_COSTS.adult} ⬡), puis sage (
        {COMPANION_EVOLUTION_COSTS.sage} ⬡).
      </p>
    </Card>
  );
}
