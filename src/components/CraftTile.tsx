import type { PendingElement } from "../models/village";
import "../styles/CraftTile.css";
import Button from "./ui/Button";

interface CraftTileProps {
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
  actionLabel: string;
}

export function CraftTile({
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
  actionLabel,
}: CraftTileProps) {
  return (
    <div className={`craft-tile${canBuild ? "" : " craft-tile-unavailable"}`}>
      <span className="craft-tile-topline">
        <span className="craft-tile-icon-wrapper">
          <span className="craft-tile-icon" aria-hidden="true">
            {icon}
          </span>
          <span className="craft-tile-count" aria-label={countLabel}>
            {count}
          </span>
        </span>
        <span className="craft-tile-meta">
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
      <Button
        disabled={!canBuild}
        onClick={onClick}
        aria-label={`Construire ${elementName} pour ${cost} orbes d'Offlinium`}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
