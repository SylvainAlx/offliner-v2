import { useOnlineStatusContext } from "../hooks/useOnlineStatusContext";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";
import "../styles/OffliniumBadge.css";

export default function OffliniumBadge() {
  const { isOnline, totalOfflineMs } = useOnlineStatusContext();
  const currentOfflinium = Math.floor(totalOfflineMs / OFFLINIUM_DELIVERY_INTERVAL);

  return (
    <div className={`header-offlinium-badge ${!isOnline ? "active" : ""}`}>
      <span className="badge-gem">⬡</span>
      <span className="badge-count">{currentOfflinium}</span>
    </div>
  );
}