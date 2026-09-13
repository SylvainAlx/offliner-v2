import OffliniumBadge from "../OffliniumBadge";
import "../../styles/Header.css";

export default function Header({
  isMenuOpen,
  onMenuOpen,
}: {
  isMenuOpen: boolean;
  onMenuOpen: () => void;
}) {
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
        <OffliniumBadge />
      </div>
      <p className="app-subtitle">Votre village hors-ligne</p>
    </header>
  );
}
