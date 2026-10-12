import { db } from "./database";
import { USER_KEY } from "../utils/constants";

const MIGRATION_KEY = "localStorage-to-indexeddb-v1";

export async function migrateLegacyStorage(): Promise<void> {
  const migration = await db.meta.get(MIGRATION_KEY);
  if (migration) return;

  const raw = window.localStorage.getItem(USER_KEY);

  if (raw) {
    try {
      const data: unknown = JSON.parse(raw);

      if (typeof data === "object" && data !== null) {
        const currentProfile = await db.profiles.get("current");

        if (!currentProfile) {
          await db.profiles.put({
            id: "current",
            schemaVersion: 1,
            updatedAt: Date.now(),
            data,
          });
        }
      }
    } catch {
      // Une ancienne valeur invalide ne doit pas empêcher le démarrage.
    }
  }

  await db.meta.put({
    key: MIGRATION_KEY,
    value: new Date().toISOString(),
  });
}
