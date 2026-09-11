import { useEffect } from "react";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { useUser } from "../stores/userStore";
import {
  COMPANION_INVOCATION_COST,
  COMPANION_INVOCATION_OFFLINE_MS,
} from "../utils/constants";
import "../styles/Village.css";
import CompanionTile from "./CompanionTile";
import { formatCountdown } from "../utils/format";
import Card from "./ui/Card";

export default function Village() {
  const user = useUser((state) => state.user);
  const invokeCompanion = useUser((state) => state.invokeCompanion);
  const cancelCompanionInvocation = useUser(
    (state) => state.cancelCompanionInvocation,
  );

  const completeCompanionInvocations = useUser(
    (state) => state.completeCompanionInvocations,
  );
  const { isOnline, totalOfflineMs } = useOnlineStatus();
  const { companions, pendingCompanions } = user.village;
  const liveOfflinium = user.getAvailableOfflinium(totalOfflineMs);

  useEffect(() => {
    completeCompanionInvocations(totalOfflineMs);
  }, [completeCompanionInvocations, totalOfflineMs]);

  const canInvoke = liveOfflinium >= COMPANION_INVOCATION_COST;

  return (
    <Card
      ariaLabel="Village"
      title="Village"
      subtitle="Utilisez vos périodes hors ligne pour peupler votre village."
    >
      <div className="village-section">
        <div className="village-section-heading">
          <h3>Vos compagnons</h3>
          <span className="village-count">{companions.length}</span>
        </div>

        {companions.length > 0 ? (
          <ul className="companion-list">
            {companions.map((companion) => (
              <CompanionTile companion={companion} key={companion.id} />
            ))}
          </ul>
        ) : (
          <div className="village-empty-state">
            <span className="village-empty-icon" aria-hidden="true">
              ◇
            </span>
            <p>Votre village n&apos;a pas encore de compagnon.</p>
            <span>La première invocation vous attend.</span>
          </div>
        )}
      </div>

      <div className="village-section village-crafting-section">
        <div className="village-section-heading">
          <div>
            <h3>À créer</h3>
            <p>Chaque création avance pendant vos périodes hors ligne.</p>
          </div>
        </div>

        <button
          type="button"
          className={`craft-tile${canInvoke ? "" : " craft-tile-unavailable"}`}
          onClick={() => invokeCompanion(totalOfflineMs)}
          disabled={!canInvoke}
          aria-label="Invoquer un compagnon pour 10 orbes d'Offlinium"
        >
          <span className="craft-tile-topline">
            <span className="craft-tile-icon" aria-hidden="true">
              🐾
            </span>
            <span className="craft-tile-cost">
              {COMPANION_INVOCATION_COST} ⬡
            </span>
          </span>
          <strong>Compagnon</strong>
          <span className="craft-tile-description">⏳​ 1 min hors ligne</span>

          {pendingCompanions.length > 0 && (
            <span className="craft-tile-progress-list">
              {pendingCompanions.map((pending, index) => {
                const isActive = index === 0;
                const elapsed = isActive
                  ? Math.max(0, totalOfflineMs - pending.offlineMsAtStart)
                  : 0;
                const remaining = COMPANION_INVOCATION_OFFLINE_MS - elapsed;
                const progress = isActive
                  ? Math.min(
                      100,
                      Math.max(
                        0,
                        (elapsed / COMPANION_INVOCATION_OFFLINE_MS) * 100,
                      ),
                    )
                  : 0;

                return (
                  <span className="craft-tile-progress" key={pending.id}>
                    <span className="craft-tile-progress-label">
                      <span>
                        {isActive
                          ? isOnline
                            ? "En attente hors ligne"
                            : "Invocation"
                          : `En file · position ${index + 1}`}
                      </span>
                      <strong>
                        {isActive ? formatCountdown(remaining) : "—"}
                      </strong>
                    </span>
                    <span
                      className="craft-tile-progress-track"
                      aria-hidden="true"
                    >
                      <span style={{ width: `${progress}%` }} />
                    </span>
                  </span>
                );
              })}
            </span>
          )}

          <span className="craft-tile-action">
            {canInvoke
              ? "Invoquer"
              : `Il vous manque ${COMPANION_INVOCATION_COST - liveOfflinium} ⬡`}
          </span>
        </button>

        {pendingCompanions.length > 0 && (
          <div
            className="craft-queue-cancel-list"
            aria-label="Invocations en cours"
          >
            {pendingCompanions.map((pending, index) => (
              <div className="craft-queue-cancel-item" key={pending.id}>
                <span>
                  {index === 0
                    ? "Invocation active"
                    : `Invocation en file ${index + 1}`}
                </span>
                <button
                  type="button"
                  className="craft-cancel-button"
                  onClick={() =>
                    cancelCompanionInvocation(pending.id, totalOfflineMs)
                  }
                >
                  Annuler · rembourser {COMPANION_INVOCATION_COST} ⬡
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
