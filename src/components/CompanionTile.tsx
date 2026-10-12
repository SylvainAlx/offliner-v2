import type { Companion } from "../models/companion";
import {
  COMPANION_STAGE_LABELS,
  type CompanionStage,
} from "../models/companion";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import ConfirmModal from "./ui/ConfirmModal";
import CompanionSprite from "./CompanionSprite";
import CompanionPreview from "./CompanionPreview";
import { useCompanionTile } from "../hooks/useCompanionTile";

const STAGE_CLASSES: Record<CompanionStage, string> = {
  child:
    "[--card-edge:#3b82f6] [--card-surface:#eff6ff] [--card-accent:#1d4ed8]",
  adolescent:
    "[--card-edge:#16a34a] [--card-surface:#f0fdf4] [--card-accent:#15803d]",
  adult:
    "[--card-edge:#8b5cf6] [--card-surface:#f5f3ff] [--card-accent:#6d28d9]",
  sage: "[--card-edge:#d97706] [--card-surface:#fffbeb] [--card-accent:#b45309]",
};

interface CompanionProps {
  companion: Companion;
}

export default function CompanionTile({ companion }: CompanionProps) {
  const {
    isSpriteOpen,
    setIsSpriteOpen,
    isReleaseModalOpen,
    setIsReleaseModalOpen,
    isEvolutionModalOpen,
    setIsEvolutionModalOpen,
    evolutionCost,
    canEvolve,
    handleEvolution,
    releaseCompanionAndGetOfflinium,
  } = useCompanionTile(companion);
  const nextStageLabel = companion.nextStage
    ? COMPANION_STAGE_LABELS[companion.nextStage].toLowerCase()
    : "suivant";

  return (
    <>
      <li
        className={`relative flex w-[280px] flex-col items-stretch gap-2 overflow-hidden rounded-[15px] border-[3px] border-(--card-edge) bg-[linear-gradient(145deg,rgba(255,255,255,0.8),transparent_42%),var(--card-surface)] p-[9px] shadow-[0_5px_10px_rgba(17,24,39,0.14),inset_0_0_0_1px_rgba(255,255,255,0.8)] before:absolute before:inset-x-0 before:top-0 before:z-[1] before:h-1.5 before:bg-(--card-edge) before:content-[''] after:absolute after:inset-1 after:pointer-events-none after:rounded-[9px] after:border after:border-[rgba(255,255,255,0.7)] after:content-[''] ${STAGE_CLASSES[companion.stage]}`}
      >
        <div className="relative z-[1] flex min-w-0 flex-col items-center justify-between gap-1.5 p-[1px_2px_0]">
          <strong className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-[var(--display)] text-base text-(--gray-900)">
            {companion.name}
          </strong>
        </div>
        <button
          type="button"
          className="relative z-[1] grid h-[118px] w-full flex-[0_0_auto] place-items-center cursor-pointer p-2 text-[1.1rem] text-(--card-accent) transition-transform duration-150 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-(--card-accent) focus-visible:outline-offset-2"
          onClick={() => setIsSpriteOpen(true)}
          aria-label={`Voir ${companion.name} en grand`}
        >
          <CompanionSprite id={companion.id} />
        </button>
        <span className="flex-[0_0_auto] bg-[color-mix(in_srgb,var(--card-accent)_12%,white)] p-[3px] text-center text-[0.58rem] font-extrabold uppercase text-(--card-accent)">
          rang : {companion.stageLabel}
        </span>
        <span className="relative z-[1] flex min-w-0 flex-col items-center rounded-lg border border-[color-mix(in_srgb,var(--card-accent)_25%,transparent)] bg-[rgba(255,255,255,0.55)] p-[7px_5px] text-center">
          <span className="text-[0.59rem] uppercase tracking-[0.02em] text-(--gray-600)">
            Bonus de récolte
          </span>
          <strong className="font-[var(--mono)] text-base leading-tight text-(--card-accent)">
            +{companion.harvestBonus} ⬡
          </strong>
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[0.59rem] tracking-[0.02em] text-(--gray-600)">
            toutes les {OFFLINIUM_DELIVERY_INTERVAL / 1000} s hors ligne
          </span>
        </span>
        <div className="relative z-[1] flex justify-center gap-1.5 [&>button]:min-h-9 [&>button]:rounded-lg [&>button]:px-[11px] [&>button]:py-[7px] [&>button]:text-[0.8rem]">
          {companion.canEvolve() && (
            <Button
              onClick={() => setIsEvolutionModalOpen(true)}
              color="var(--green-dark)"
              disabled={!canEvolve}
              ariaLabel={
                canEvolve
                  ? `Faire évoluer ${companion.name}`
                  : `${companion.name} est sage ou manque d'Offlinium`
              }
            >
              Évoluer
            </Button>
          )}
          <Button
            onClick={() => setIsReleaseModalOpen(true)}
            color="var(--red-primary)"
          >
            Libérer
          </Button>
        </div>
      </li>

      <ConfirmModal
        isOpen={isReleaseModalOpen}
        title={`Libérer ${companion.name} ?`}
        message="Cette action est définitive. Vous récupérerez le coût d'invocation du compagnon."
        confirmLabel="Libérer"
        onCancel={() => setIsReleaseModalOpen(false)}
        onConfirm={() => {
          releaseCompanionAndGetOfflinium(companion.id);
          setIsReleaseModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={isEvolutionModalOpen}
        title={`Faire évoluer ${companion.name} ?`}
        message={`Passer au stade ${nextStageLabel} coûte ${evolutionCost.toLocaleString("fr-FR")} Offlinium.`}
        confirmLabel="Faire évoluer"
        onCancel={() => setIsEvolutionModalOpen(false)}
        onConfirm={handleEvolution}
      />

      {isSpriteOpen &&
        createPortal(
          <CompanionPreview
            companion={companion}
            setIsSpriteOpen={setIsSpriteOpen}
          />,
          document.body,
        )}
    </>
  );
}
