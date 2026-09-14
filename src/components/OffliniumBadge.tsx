import { useOffliniumBadge } from "../hooks/useOffliniumBadge";
import "../styles/OffliniumBadge.css";

export default function OffliniumBadge() {
  const { isOnline, currentOfflinium } = useOffliniumBadge();

  return (
    <div className={`header-offlinium-badge ${!isOnline ? "active" : ""}`}>
      <span className="badge-gem">⬡</span>
      <span className="badge-count">{currentOfflinium}</span>
    </div>
  );
}
