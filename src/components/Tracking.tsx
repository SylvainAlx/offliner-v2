import { useMemo } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import "../styles/Tracking.css";
import { useUser } from "../stores/userStore";
import PeriodItem from "./PeriodItem";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function Tracking() {
  const { resetTracking, lastChecked } = useOnlineStatus();
  const { user } = useUser();

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;
  const { completedPeriods, openPeriod } = useMemo(() => {
    const completed = user.periodList.periods
      .filter((p) => p.end !== null)
      .reverse();
    const open = user.periodList.periods.find((p) => p.end === null) ?? null;
    return { completedPeriods: completed, openPeriod: open };
  }, [user]);

  return (
    <Card
      ariaLabel="Historique des périodes hors ligne"
      title="Historique"
      subtitle="Suivez vos périodes hors ligne et leur impact sur votre village."
    >
      <div className="tracking-header">
        <div>
          <p className="tracking-sub">
            {user.periodList.periods.length} période
            {user.periodList.periods.length > 1 ? "s" : ""} enregistrée
            {user.periodList.periods.length > 1 ? "s" : ""}
          </p>
        </div>
        {user.periodList.periods.length > 0 && (
          <Button onClick={resetTracking}>Réinitialiser</Button>
        )}
      </div>

      {openPeriod && <PeriodItem isOpen={true} now={now} period={openPeriod} />}

      {completedPeriods.length > 0 ? (
        <ul className="period-list">
          {completedPeriods.map((period, index) => {
            const safeIndex = user.periodList.periods.findIndex(
              (p) => p.start === period.start && p.end === period.end,
            );

            return (
              <PeriodItem
                isOpen={false}
                period={period}
                key={`${period.start}-${period.end}-${safeIndex}-${index}`}
              />
            );
          })}
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
