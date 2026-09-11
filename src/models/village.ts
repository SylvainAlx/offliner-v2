import { Companion } from "./companion";
import {
  COMPANION_INVOCATION_COST,
  COMPANION_INVOCATION_OFFLINE_MS,
} from "../utils/constants";

export interface PendingCompanion {
  id: string;
  startedAt: number;
  offlineMsAtStart: number;
  storedOffliniumCost: number;
  openPeriodOffliniumCost: number;
}

export class Village {
  companions: Companion[];
  pendingCompanions: PendingCompanion[];

  constructor() {
    this.companions = [];
    this.pendingCompanions = [];
  }

  loadVillage(village: unknown): void {
    if (typeof village === "object" && village !== null) {
      const record = village as {
        companions?: unknown;
        pendingCompanions?: unknown;
      };

      this.companions = Array.isArray(record.companions)
        ? record.companions.map((companionData) => {
            const companion = new Companion();
            Object.assign(companion, companionData);
            return companion;
          })
        : [];

      const pendingCompanions = Array.isArray(record.pendingCompanions)
        ? record.pendingCompanions.filter(isPendingCompanion).map((pending) => ({
            ...pending,
            storedOffliniumCost:
              pending.storedOffliniumCost ?? COMPANION_INVOCATION_COST,
            openPeriodOffliniumCost: pending.openPeriodOffliniumCost ?? 0,
          }))
        : [];
      this.pendingCompanions = pendingCompanions.map((pending, index) => ({
        ...pending,
        offlineMsAtStart:
          index === 0
            ? pending.offlineMsAtStart
            : pendingCompanions[0].offlineMsAtStart +
              index * COMPANION_INVOCATION_OFFLINE_MS,
      }));
    }
  }

  addCompanion(companion: Companion): void {
    this.companions.push(companion);
  }

  releaseCompanion(companionId: string): boolean {
    const previousLength = this.companions.length;
    this.companions = this.companions.filter(
      (companion) => companion.id !== companionId,
    );
    return this.companions.length < previousLength;
  }

  getCompanion(companionId: string): Companion | undefined {
    return this.companions.find((companion) => companion.id === companionId);
  }

  addPendingCompanion(
    offlineMs: number,
    storedOffliniumCost: number,
    openPeriodOffliniumCost: number,
    startedAt = Date.now(),
  ): void {
    const previous = this.pendingCompanions.at(-1);
    this.pendingCompanions.push({
      id: crypto.randomUUID(),
      startedAt,
      storedOffliniumCost,
      openPeriodOffliniumCost,
      offlineMsAtStart: previous
        ? previous.offlineMsAtStart + COMPANION_INVOCATION_OFFLINE_MS
        : Math.max(0, offlineMs),
    });
  }

  cancelPendingCompanion(
    companionId: string,
    currentOfflineMs: number,
  ): PendingCompanion | undefined {
    const index = this.pendingCompanions.findIndex(
      (pending) => pending.id === companionId,
    );
    if (index === -1) return;

    const [cancelled] = this.pendingCompanions.splice(index, 1);
    if (this.pendingCompanions.length === 0) return cancelled;

    const first = this.pendingCompanions[0];
    if (index === 0) {
      first.offlineMsAtStart = currentOfflineMs;
    }

    for (let queueIndex = Math.max(1, index); queueIndex < this.pendingCompanions.length; queueIndex += 1) {
      this.pendingCompanions[queueIndex].offlineMsAtStart =
        this.pendingCompanions[queueIndex - 1].offlineMsAtStart +
        COMPANION_INVOCATION_OFFLINE_MS;
    }

    return cancelled;
  }

  completePendingCompanions(currentOfflineMs: number): number {
    const completed = this.pendingCompanions.filter(
      (pending) =>
        currentOfflineMs - pending.offlineMsAtStart >=
        COMPANION_INVOCATION_OFFLINE_MS,
    );

    if (completed.length === 0) return 0;

    const completedIds = new Set(completed.map((pending) => pending.id));
    this.pendingCompanions = this.pendingCompanions.filter(
      (pending) => !completedIds.has(pending.id),
    );
    completed.forEach(() => this.addCompanion(new Companion()));
    return completed.length;
  }
}

function isPendingCompanion(value: unknown): value is PendingCompanion {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.startedAt === "number" &&
    typeof record.offlineMsAtStart === "number" &&
    (record.storedOffliniumCost === undefined ||
      typeof record.storedOffliniumCost === "number") &&
    (record.openPeriodOffliniumCost === undefined ||
      typeof record.openPeriodOffliniumCost === "number")
  );
}
