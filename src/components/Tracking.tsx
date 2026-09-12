import { useMemo, useState } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import "../styles/Tracking.css";
import { useUser } from "../stores/userStore";
import PeriodItem from "./PeriodItem";
import DayItem from "./DayItem";
import Card from "./ui/Card";
import Button from "./ui/Button";
import ConfirmModal from "./ui/ConfirmModal";

export default function Tracking() {
  const { resetTracking, lastChecked } = useOnlineStatus();
  const { user } = useUser();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const nowRef = useMemo(
    () => ({ now: lastChecked ? lastChecked.getTime() : 0 }),
    [lastChecked],
  );
  const now = nowRef.now;
  const { completedDays, openPeriod } = useMemo(() => {
    return {
      completedDays: user.periodList.days,
      openPeriod: user.periodList.getOpenPeriod(),
    };
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
            {completedDays.length} journée
            {completedDays.length > 1 ? "s" : ""} enregistrée
            {completedDays.length > 1 ? "s" : ""}
          </p>
        </div>
        {(completedDays.length > 0 || openPeriod) && (
          <Button onClick={() => setIsResetModalOpen(true)}>
            Réinitialiser
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Réinitialiser l'historique ?"
        message="Cette action supprimera toutes vos périodes hors ligne et les Offlinium associés."
        confirmLabel="Réinitialiser"
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          resetTracking();
          setIsResetModalOpen(false);
        }}
      />

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
