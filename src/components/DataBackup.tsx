import "../styles/DataBackup.css";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useDataBackup } from "../hooks/useDataBackup";
import ConfirmModal from "./ui/ConfirmModal";

export default function DataBackup() {
  const {
    handleExport,
    handleImport,
    handleClearAll,
    fileInputRef,
    feedback,
    isResetModalOpen,
    setIsResetModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
  } = useDataBackup();

  return (
    <Card
      ariaLabel="Données du compte"
      title="Données du compte"
      subtitle="Exportez, importez ou effacez vos données Offliner."
    >
      <div className="data-backup-content">
        <p className="data-backup-description">
          Enregistrez votre compte dans un fichier JSON pour conserver votre
          progression ou la transférer sur un autre appareil.
        </p>

        <div className="data-backup-actions">
          <Button
            onClick={() => setIsExportModalOpen(true)}
            color="var(--accent)"
          >
            Exporter mes données
          </Button>
          <Button
            onClick={() => setIsImportModalOpen(true)}
            color="var(--green-dark)"
          >
            Importer une sauvegarde
          </Button>
          <Button
            onClick={() => setIsResetModalOpen(true)}
            color="var(--red-dark)"
          >
            Effacer toutes les données
          </Button>
          <input
            ref={fileInputRef}
            className="data-backup-file-input"
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            aria-label="Choisir une sauvegarde JSON"
          />
        </div>

        {feedback && (
          <p
            className={`data-backup-feedback data-backup-feedback-${feedback.kind}`}
            role={feedback.kind === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        )}
      </div>
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Effacer toutes les données ?"
        message="Cette action supprimera toutes vos données Offliner. Continuer ?"
        confirmLabel="Effacer"
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          handleClearAll();
          setIsResetModalOpen(false);
        }}
      />
      <ConfirmModal
        isOpen={isImportModalOpen}
        title="Importer une sauvegarde ?"
        message="Cette action remplacera le compte actuel par la sauvegarde sélectionnée. Continuer ?"
        confirmLabel="Importer"
        onCancel={() => setIsImportModalOpen(false)}
        onConfirm={() => {
          setIsImportModalOpen(false);
          fileInputRef.current?.click();
        }}
      />
      <ConfirmModal
        isOpen={isExportModalOpen}
        title="Exporter les données ?"
        message="Cette action exportera vos données Offliner au format JSON. Continuer ?"
        confirmLabel="Exporter"
        onCancel={() => setIsExportModalOpen(false)}
        onConfirm={() => {
          handleExport();
          setIsExportModalOpen(false);
        }}
      />
    </Card>
  );
}
