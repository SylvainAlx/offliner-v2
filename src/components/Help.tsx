import "../styles/Help.css";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";

export default function Help() {
  return (
    <div className="info-card">
      <h3>💡 Comment ça marche ?</h3>
      <p>
        <strong>{`1 particule d'Offlinium générée toutes les ${OFFLINIUM_DELIVERY_INTERVAL / 1000} secondes.`}.</strong> Plus vous restez déconnecté, plus votre réacteur en synthétise.
      </p>
      <p>
        Pour tester, activez le mode avion, coupez le Wi-Fi ou utilisez l'onglet Réseau (Network → Offline) de vos outils de développement.
      </p>
    </div>
  );
}
