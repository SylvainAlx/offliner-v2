import type { Companion } from "../models/companion";
import { COMPANION_STAGE_LABELS } from "../models/companion";
import { createPortal } from "react-dom";
import "../styles/CompanionTile.css";
import Button from "./ui/Button";
import ConfirmModal from "./ui/ConfirmModal";
import InfoModal from "./ui/InfoModal";
import CompanionSprite from "./CompanionSprite";
import CompanionPreview from "./CompanionPreview";
import { useCompanionTile } from "../hooks/useCompanionTile";

interface CompanionProps {
  companion: Companion;
}

export default function CompanionTile({ companion }: CompanionProps) {
  const {
    isSpriteOpen,
    setIsSpriteOpen,
    isReleaseModalOpen,
    setIsReleaseModalOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
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
      <li className="companion-item">
        <button
          type="button"
          className="companion-avatar"
          onClick={() => setIsSpriteOpen(true)}
          aria-label={`Voir ${companion.name} en grand`}
        >
          <CompanionSprite id={companion.id} />
        </button>
        <span className="companion-details">
          <strong>{companion.name}</strong>
          <span className="companion-stage">{companion.stageLabel}</span>
          <span>
            Invoqué le{" "}
            {new Date(companion.birthdate).toLocaleDateString("fr-FR")}
          </span>
          <span className="companion-evolution-hint">
            {companion.canEvolve()
              ? `Prochain stade : ${nextStageLabel} · ${evolutionCost.toLocaleString("fr-FR")} ⬡`
              : "Stade maximal atteint"}
          </span>
        </span>
        <div className="companion-actions">
          <Button onClick={() => setIsInfoModalOpen(true)}>👋​</Button>
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
            {companion.canEvolve() ? "⬆️" : "✨"}
          </Button>
          <Button
            onClick={() => setIsReleaseModalOpen(true)}
            color="var(--red-bg)"
          >
            ❌​
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

      <InfoModal
        isOpen={isInfoModalOpen}
        title={`Bonjour de ${companion.name}`}
        message={companion.sayHello()}
        onClose={() => setIsInfoModalOpen(false)}
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
