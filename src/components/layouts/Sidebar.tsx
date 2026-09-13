import { useEffect, useRef } from "react";
import "../../styles/Sidebar.css";

export type AppSection = "account" | "village" | "help";

const menuItems: Array<{
  id: AppSection;
  label: string;
  description: string;
  icon: string;
}> = [
  { id: "account", label: "Compte", description: "Profil, statut et suivi", icon: "◉" },
  { id: "village", label: "Village", description: "Compagnons et maisons", icon: "⌂" },
  { id: "help", label: "Aide", description: "Les règles d'Offliner", icon: "?" },
];

type SidebarProps = {
  activeSection: AppSection;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (section: AppSection) => void;
};

export default function Sidebar({
  activeSection,
  isOpen,
  onClose,
  onSelect,
}: SidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  function handleSelect(section: AppSection) {
    onSelect(section);
    onClose();
  }

  return (
    <>
      <div
        className={`sidebar-backdrop${isOpen ? " sidebar-backdrop-visible" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        id="app-navigation"
        className={`app-sidebar${isOpen ? " app-sidebar-open" : ""}`}
        aria-label="Navigation principale"
      >
        <div className="sidebar-heading">
          <div>
            <span className="sidebar-eyebrow">Navigation</span>
            <h2>Votre espace</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="sidebar-close"
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                className={`sidebar-link${isActive ? " sidebar-link-active" : ""}`}
                type="button"
                aria-current={isActive ? "page" : undefined}
                key={item.id}
                onClick={() => handleSelect(item.id)}
              >
                <span className="sidebar-link-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="sidebar-link-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="sidebar-link-arrow" aria-hidden="true">
                  →
                </span>
              </button>
            );
          })}
        </nav>

        <p className="sidebar-hint">Choisissez une section pour continuer.</p>
      </aside>
    </>
  );
}
