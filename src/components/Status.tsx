import { useOnlineStatus } from "../stores/onlineStatusStore";
import { formatDate, formatDuration } from "../utils/format";
import "../styles/Status.css";
import Card from "./ui/Card";

export default function Status() {
  const { isOnline, lastChecked, totalOfflineMs } = useOnlineStatus();

  return (
    <Card
      ariaLabel="Statut de la connexion"
      title={isOnline ? "En ligne" : "Hors ligne"}
      subtitle={
        isOnline
          ? "Votre appareil est connecté à Internet."
          : "Votre appareil n'est pas connecté à Internet."
      }
    >
      <div className="status-details">
        <div className="detail-item">
          <span className="detail-label">Dernier contrôle</span>
          <span className="detail-value">{formatDate(lastChecked)}</span>
        </div>
        <div className="detail-item highlight">
          <span className="detail-label">Temps total hors ligne</span>
          <span className="detail-value strong">
            {formatDuration(totalOfflineMs)}
          </span>
        </div>
      </div>
    </Card>
  );
}
