import type { Companion } from "../models/companion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "../stores/userStore";
import "../styles/CompanionTile.css";
import Button from "./ui/Button";
import ConfirmModal from "./ui/ConfirmModal";
import CompanionSprite from "./CompanionSprite";

interface CompanionProps {
  companion: Companion;
}

export default function CompanionTile({ companion }: CompanionProps) {
  const [isSpriteOpen, setIsSpriteOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const releaseCompanionAndGetOfflinium = useUser(
    (state) => state.releaseCompanionAndGetOfflinium,
  );

  useEffect(() => {
    if (!isSpriteOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSpriteOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSpriteOpen]);

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
            Invoqué le {new Date(companion.birthdate).toLocaleDateString("fr-FR")}
          </span>
        </span>
        <div className="companion-actions">
          <Button onClick={() => companion.sayHello()}>👋​</Button>
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

      {isSpriteOpen &&
        createPortal(
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
              <h2 id={`companion-preview-title-${companion.id}`}>
                {companion.name}
              </h2>
              <p>
                Compagnon invoqué le {new Date(companion.birthdate).toLocaleDateString("fr-FR")}.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
