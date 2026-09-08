import { useOnlineStatusContext } from "../hooks/useOnlineStatusContext";
import { useUserContext } from "../hooks/useUserContext";

export default function OffliniumBadge() {
    const { isOnline } = useOnlineStatusContext();
    const { user } = useUserContext();

    return (
        <div className={`header-offlinium-badge ${!isOnline ? "active" : ""}`}>
          <span className="badge-gem">⬡</span>
          <span className="badge-count">{isOnline ? user.offlinium : "Extraction"}</span>
        </div>
    );
}