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
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-(--gray-100) pb-4">
        <p className="text-[0.82rem] font-medium text-(--gray-600)">
          {completedDays.length} journée
          {completedDays.length > 1 ? "s" : ""} enregistrée
          {completedDays.length > 1 ? "s" : ""}
        </p>
      </div>

      {openPeriod && <PeriodItem isOpen={true} now={now} period={openPeriod} />}

      {completedDays.length > 0 ? (
        <ul className="m-0 flex list-none flex-col p-0">
          {completedDays.map((day) => (
            <DayItem day={day} key={day.dayStart} />
          ))}
        </ul>
      ) : (
        !openPeriod && (
          <div className="p-[24px_12px] text-center text-(--gray-600)">
            <p className="mb-1.5 text-[0.9rem]">
              Aucune période hors ligne enregistrée.
            </p>
            <p className="text-[0.82rem] text-(--gray-600) opacity-80">
              Déconnectez-vous pour commencer le suivi.
            </p>
          </div>
        )
      )}
    </Card>
  );
}
