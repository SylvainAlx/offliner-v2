import type { PendingElement } from "../models/village";
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
    <div className="flex min-h-[150px] w-[280px] flex-col items-stretch rounded-2xl border border-(--accent-border) bg-[linear-gradient(150deg,#ffffff_0%,#faf5ff_100%)] p-3.5 text-left font-inherit text-(--gray-900)">
      <span className="mb-2 flex items-center justify-between">
        <span className="relative inline-flex">
          <span
            className="grid size-[35px] place-items-center rounded-[11px] bg-(--accent-bg) text-[1.2rem]"
            aria-hidden="true"
          >
            {icon}
          </span>
          <span
            className="absolute right-[-8px] bottom-[-6px] rounded-full border border-(--gray-200) bg-white p-[2px_5px] font-[var(--mono)] text-[0.65rem] font-extrabold leading-[1.1] whitespace-nowrap text-(--gray-800)"
            aria-label={countLabel}
          >
            {count}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[0.78rem] font-extrabold text-(--accent)">
            {cost} ⬡
          </span>
        </span>
      </span>
      <strong className="text-[0.94rem]">{elementName}</strong>
      <span className="mt-0.5 text-[0.75rem] text-(--gray-600)">
        {description}
      </span>
      <span className="mt-0.5 text-[0.7rem] text-(--gray-500)">
        ⏱️ {craftTime}
      </span>

      {pendingElements.length > 0 && (
        <span className="mt-3 flex flex-col gap-[7px]">
          {pendingElements.map(renderProgress)}
        </span>
      )}

      <span
        className={`mt-auto pt-3 text-[0.75rem] font-extrabold ${
          canBuild ? "text-(--accent)" : "text-(--gray-600)"
        }`}
      >
        {children}
      </span>
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
