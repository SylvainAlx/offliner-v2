import "../styles/DataBackup.css";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useDataBackup } from "../hooks/useDataBackup";

export default function DataBackup() {
  const { handleExport, handleImport, fileInputRef, feedback } =
    useDataBackup();

  return (
    <Card
      ariaLabel="Sauvegarde du compte"
      title="Sauvegarde"
      subtitle="Exportez ou récupérez vos données Offliner."
    >
      <div className="data-backup-content">
        <p className="data-backup-description">
          Enregistrez votre compte dans un fichier JSON pour conserver votre
          progression ou la transférer sur un autre appareil.
        </p>

        <div className="data-backup-actions">
          <Button onClick={handleExport} color="var(--accent)">
            Exporter mes données
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            color="var(--green-dark)"
          >
            Importer une sauvegarde
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
    </Card>
  );
}
