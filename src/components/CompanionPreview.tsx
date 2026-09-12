import type { Companion } from "../models/companion";
import CompanionSprite from "./CompanionSprite";
import "../styles/CompanionPreview.css";

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
      className="companion-preview-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) setIsSpriteOpen(false);
      }}
    >
      <div
        className="companion-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`companion-preview-title-${companion.id}`}
      >
        <button
          type="button"
          className="companion-preview-close"
          onClick={() => setIsSpriteOpen(false)}
          aria-label="Fermer l’aperçu"
          autoFocus
        >
          ×
        </button>
        <div className="companion-sprite-large">
          <CompanionSprite id={companion.id} />
        </div>
        <h2 id={`companion-preview-title-${companion.id}`}>{companion.name}</h2>
        <p>
          Compagnon invoqué le{" "}
          {new Date(companion.birthdate).toLocaleDateString("fr-FR")}.
        </p>
      </div>
    </div>
  );
}
