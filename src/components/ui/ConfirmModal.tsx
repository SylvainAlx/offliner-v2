import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      message={message}
      onClose={onCancel}
    >
      <div className="modal-actions">
        <button
          type="button"
          className="modal-button modal-button-cancel"
          onClick={onCancel}
          autoFocus
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="modal-button modal-button-confirm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
