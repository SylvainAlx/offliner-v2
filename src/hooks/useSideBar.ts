import { useEffect, useRef } from "react";
import type { AppSection } from "../components/layouts/Sidebar";

export function useSideBar(isOpen: boolean, onClose: () => void, onSelect: (section: AppSection) => void) {
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

  return {
    closeButtonRef,
    handleSelect,
  };
}