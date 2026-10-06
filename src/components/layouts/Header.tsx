import OffliniumBadge from "../OffliniumBadge";
import PopulationBadge from "../PopulationBadge";
import { useOnlineStatus } from "../../stores/onlineStatusStore";
import "../../styles/Header.css";

export default function Header({
  isMenuOpen,
  onMenuOpen,
}: {
  isMenuOpen: boolean;
  onMenuOpen: () => void;
}) {
  const offlineCountdownMs = useOnlineStatus(
    (state) => state.offlineCountdownMs,
  );

  return (
    <header className="app-header">
      <div className="header-top">
        <button
          className="header-menu-button"
          type="button"
          onClick={onMenuOpen}
          aria-label="Ouvrir le menu"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-controls="app-navigation"
        >
          <span aria-hidden="true">☰</span>
        </button>
        <h1>Offliner</h1>
        <div className="header-resources">
          <PopulationBadge />
          <OffliniumBadge />
        </div>
      </div>
      <p className="app-subtitle">Votre village hors-ligne</p>
      {offlineCountdownMs !== null && (
        <div className="offline-countdown" role="status" aria-live="polite">
          <span>Enregistrement de la période dans</span>
          <strong>{Math.ceil(offlineCountdownMs / 1000)} s</strong>
          <small>Restez hors ligne pour la confirmer.</small>
        </div>
      )}
    </header>
  );
}
