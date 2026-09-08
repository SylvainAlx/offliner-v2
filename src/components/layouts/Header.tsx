import OffliniumBadge from "../OffliniumBadge";

export default function Header() {

  return (
    <header className="app-header">
      <div className="header-top">
        <h1>Offliner</h1>
        <OffliniumBadge />
      </div>
      <p className="app-subtitle">Détecteur de connexion & Générateur d'Offlinium</p>
    </header>
  );
}
