import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useUser } from "../stores/userStore";
import { useOnlineStatus } from "../stores/onlineStatusStore";
import { USER_KEY } from "../utils/constants";
import "../styles/DataBackup.css";
import Card from "./ui/Card";
import Button from "./ui/Button";

type Feedback = {
  kind: "success" | "error";
  message: string;
};

function isBackupData(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const periodList = record.periodList;
  const village = record.village;

  if (
    typeof record.name !== "string" ||
    typeof record.createdAt !== "number" ||
    !Number.isFinite(record.createdAt) ||
    typeof record.offlinium !== "number" ||
    !Number.isFinite(record.offlinium) ||
    typeof record.offliniumSpentDuringOpenPeriod !== "number" ||
    !Number.isFinite(record.offliniumSpentDuringOpenPeriod) ||
    typeof periodList !== "object" ||
    periodList === null ||
    typeof village !== "object" ||
    village === null
  ) {
    return false;
  }

  const periodRecord = periodList as Record<string, unknown>;
  const villageRecord = village as Record<string, unknown>;

  return (
    Array.isArray(periodRecord.days) &&
    Array.isArray(villageRecord.companions) &&
    Array.isArray(villageRecord.houses) &&
    Array.isArray(villageRecord.pendingElements)
  );
}

export default function DataBackup() {
  const saveUser = useUser((state) => state.saveUser);
  const syncWithStorage = useUser((state) => state.syncWithStorage);
  const refreshOnlineStatus = useOnlineStatus((state) => state.refreshFromUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleExport() {
    if (typeof window === "undefined") return;

    saveUser();
    const rawData = window.localStorage.getItem(USER_KEY);

    if (!rawData) {
      setFeedback({
        kind: "error",
        message: "Impossible de lire les données du compte.",
      });
      return;
    }

    const blob = new Blob([rawData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `offliner-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);

    setFeedback({
      kind: "success",
      message: "Sauvegarde exportée. Conservez ce fichier précieusement.",
    });
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsedData: unknown = JSON.parse(await file.text());

      if (!isBackupData(parsedData)) {
        throw new Error("format");
      }

      const shouldImport = window.confirm(
        "Cette action remplacera le compte actuel par la sauvegarde sélectionnée. Continuer ?",
      );
      if (!shouldImport) return;

      window.localStorage.setItem(USER_KEY, JSON.stringify(parsedData));
      syncWithStorage(navigator.onLine, Date.now());
      refreshOnlineStatus();
      setFeedback({
        kind: "success",
        message: "Compte restauré avec succès.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "format") {
        setFeedback({
          kind: "error",
          message: "Ce fichier ne ressemble pas à une sauvegarde Offliner.",
        });
        return;
      }

      setFeedback({
        kind: "error",
        message: "Import impossible. Vérifiez le fichier et réessayez.",
      });
    }
  }

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
