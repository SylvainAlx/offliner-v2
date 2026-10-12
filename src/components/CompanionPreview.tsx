import type { Companion } from "../models/companion";
import CompanionSprite from "./CompanionSprite";

interface CompanionPreviewProps {
  companion: Companion;
  setIsSpriteOpen: (isOpen: boolean) => void;
}

export default function CompanionPreview({
  companion,
  setIsSpriteOpen,
}: CompanionPreviewProps) {
  return (
    <div
      className="fixed inset-0 z-[1000] grid place-items-center p-6 bg-[rgba(17,24,39,0.68)] animate-[modal-fade-in_0.15s_ease-out]"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) setIsSpriteOpen(false);
      }}
    >
      <div
        className="relative flex w-full max-w-[320px] flex-col items-center rounded-[20px] border border-(--gray-100) bg-white p-[28px_24px_24px] text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`companion-preview-title-${companion.id}`}
      >
        <button
          type="button"
          className="absolute top-2.5 right-3 grid size-8 place-items-center rounded-full border-0 bg-(--gray-100) p-0 font-inherit text-[1.35rem] leading-none text-(--gray-700) outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          onClick={() => setIsSpriteOpen(false)}
          aria-label="Fermer l’aperçu"
          autoFocus
        >
          ×
        </button>
        <div className="mt-1 mb-4 grid size-52 place-items-center rounded-[18px] bg-(--accent-bg)">
          <CompanionSprite
            id={companion.id}
            className="block size-44 [image-rendering:pixelated] [shape-rendering:crispEdges]"
          />
        </div>
        <h2
          className="m-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-[var(--heading)] text-[1.05rem] font-medium text-(--gray-900)"
          id={`companion-preview-title-${companion.id}`}
        >
          {companion.name}
        </h2>
        <p className="mt-2.5 mb-[-1px] text-[0.78rem] font-bold text-(--accent)">
          {companion.stageLabel}
        </p>
        <p className="mt-[5px] text-[0.78rem] text-(--gray-600)">
          Compagnon invoqué le{" "}
          {new Date(companion.birthdate).toLocaleDateString("fr-FR")}.
        </p>
      </div>
    </div>
  );
}
