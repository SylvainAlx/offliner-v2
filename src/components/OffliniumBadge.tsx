import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";
import "../styles/OffliniumBadge.css";

export default function OffliniumBadge() {
  const { isOnline, totalOfflineMs } = useOnlineStatus();
  const user = useUser((state) => state.user);
  const currentOfflinium = user.getAvailableOfflinium(totalOfflineMs);

  return (
    <div className={`header-offlinium-badge ${!isOnline ? "active" : ""}`}>
      <span className="badge-gem">⬡</span>
      <span className="badge-count">{currentOfflinium}</span>
    </div>
  );
}
