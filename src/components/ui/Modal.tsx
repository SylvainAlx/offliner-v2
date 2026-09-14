import { createPortal } from "react-dom";
import "../../styles/Modal.css";
import { useModal } from "../../hooks/useModal";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  message,
  onClose,
  children,
}: ModalProps) {
  const { titleId, messageId } = useModal(isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <h2 id={titleId}>{title}</h2>
        <p id={messageId}>{message}</p>
        {children}
      </div>
    </div>,
    document.body,
  );
}
