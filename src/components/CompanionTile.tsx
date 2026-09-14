import type { Companion } from "../models/companion";
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
    releaseCompanionAndGetOfflinium,
  } = useCompanionTile();

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
          <span>
            Invoqué le{" "}
            {new Date(companion.birthdate).toLocaleDateString("fr-FR")}
          </span>
        </span>
        <div className="companion-actions">
          <Button onClick={() => setIsInfoModalOpen(true)}>👋​</Button>
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
