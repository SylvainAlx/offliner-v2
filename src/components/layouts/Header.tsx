import OffliniumBadge from "../OffliniumBadge";
import "../../styles/Header.css"

export default function Header() {

  return (
    <header className="app-header">
      <div className="header-top">
        <h1>Offliner</h1>
        <OffliniumBadge />
      </div>
      <p className="app-subtitle">Un monde hors-ligne</p>
    </header>
  );
}
