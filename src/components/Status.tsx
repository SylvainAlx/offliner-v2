import { useOnlineStatus } from "../stores/onlineStatusStore";
import { formatDate, formatDuration } from "../utils/format";
import "../styles/Status.css";
import Card from "./ui/Card";

export default function Status() {
  const { isOnline, lastChecked, totalOfflineMs } = useOnlineStatus();

  return (
    <Card ariaLabel="Statut de la connexion">
      <div
        className={`status-indicator ${isOnline ? "pulse-online" : "pulse-offline"}`}
      >
        <div className="status-dot"></div>
      </div>

      <div className="status-content">
        <h2
          className={`status-title ${isOnline ? "text-online" : "text-offline"}`}
        >
          {isOnline ? "En ligne" : "Hors ligne"}
        </h2>
        <p className="status-description">
          {isOnline
            ? "Votre appareil est connecté à Internet."
            : "Votre appareil n'est pas connecté à Internet."}
        </p>
      </div>

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
