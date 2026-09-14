import "../styles/Tracking.css";
import PeriodItem from "./PeriodItem";
import DayItem from "./DayItem";
import Card from "./ui/Card";
import { useTracking } from "../hooks/useTracking";

export default function Tracking() {
  const { completedDays, openPeriod, now } = useTracking();

  return (
    <Card
      ariaLabel="Historique des périodes hors ligne"
      title="Historique"
      subtitle="Suivez vos périodes hors ligne et leur impact sur votre village."
    >
      <div className="tracking-header">
        <p className="tracking-sub">
          {completedDays.length} journée
          {completedDays.length > 1 ? "s" : ""} enregistrée
          {completedDays.length > 1 ? "s" : ""}
        </p>
      </div>

      {openPeriod && <PeriodItem isOpen={true} now={now} period={openPeriod} />}

      {completedDays.length > 0 ? (
        <ul className="period-list">
          {completedDays.map((day) => (
            <DayItem day={day} key={day.dayStart} />
          ))}
        </ul>
      ) : (
        !openPeriod && (
          <div className="empty-state">
            <p>Aucune période hors ligne enregistrée.</p>
            <p className="empty-hint">
              Déconnectez-vous pour commencer le suivi.
            </p>
          </div>
        )
      )}
    </Card>
  );
}
