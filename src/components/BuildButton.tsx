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
        <span className="craft-tile-cost">{cost} ⬡</span>
      </span>
      <strong>{elementName}</strong>
      <span className="craft-tile-description">⏱️ {craftTime}</span>

      {pendingElements.length > 0 && (
        <span className="craft-tile-progress-list">
          {pendingElements.map(renderProgress)}
        </span>
      )}

      <span className="craft-tile-action">{children}</span>
    </button>
  );
}
