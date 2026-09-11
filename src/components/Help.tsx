import "../styles/Help.css";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";
import Card from "./ui/Card";

export default function Help() {
  return (
    <Card ariaLabel="Aide et informations">
      <h3>💡 Comment ça marche ?</h3>
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
    </Card>
  );
}
