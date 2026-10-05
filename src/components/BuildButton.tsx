import type { PendingElement } from "../models/village";
import "../styles/buildButton.css";

interface BuildButtonProps {
  elementName: string;
  icon: string;
  canBuild: boolean;
  onClick: () => void;
  cost: number;
  pendingElements: PendingElement[];
  renderProgress: (
    pendingElement: PendingElement,
    index: number,
  ) => React.ReactNode;
  count: React.ReactNode;
  countLabel: string;
  description: string;
  liveOfflinium: number;
  craftTime: string;
  children: React.ReactNode;
}

export function BuildButton({
  elementName,
  icon,
  canBuild,
  onClick,
  cost,
  pendingElements,
  renderProgress,
  count,
  countLabel,
  description,
  craftTime,
  children,
}: BuildButtonProps) {
  return (
    <button
      type="button"
      className={`craft-tile${canBuild ? "" : " craft-tile-unavailable"}`}
      onClick={() => onClick()}
      disabled={!canBuild}
      aria-label={`Construire ${elementName} pour ${cost} orbes d'Offlinium`}
    >
      <span className="craft-tile-topline">
        <span className="craft-tile-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="craft-tile-meta">
          <span className="craft-tile-count" aria-label={countLabel}>
            {count}
          </span>
          <span className="craft-tile-cost">{cost} ⬡</span>
        </span>
      </span>
      <strong>{elementName}</strong>
      <span className="craft-tile-description">{description}</span>
      <span className="craft-tile-time">⏱️ {craftTime}</span>

      {pendingElements.length > 0 && (
        <span className="craft-tile-progress-list">
          {pendingElements.map(renderProgress)}
        </span>
      )}

      <span className="craft-tile-action">{children}</span>
    </button>
  );
}
