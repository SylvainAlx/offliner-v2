import { Period } from "./period";

export interface OfflineDay {
  dayStart: number;
  durationMs: number;
  periodCount: number;
  firstStart: number;
  lastEnd: number;
}

export class PeriodList {
  days: OfflineDay[];
  openPeriodStart: number | null;

  constructor(days: OfflineDay[] = [], openPeriodStart: number | null = null) {
    this.days = days;
    this.openPeriodStart = openPeriodStart;
  }

  loadPeriods(rawPeriods: unknown = []): void {
    try {
      const candidate = getCandidate(rawPeriods);
      if (candidate && !Array.isArray(candidate) && Array.isArray(candidate.days)) {
        this.days = candidate.days
          .filter(isOfflineDay)
          .map((day) => ({ ...day }));
        this.sortDays();
        this.openPeriodStart = isFiniteNumber(candidate.openPeriodStart)
          ? candidate.openPeriodStart
          : null;
        return;
      }

      // Older saves contain one Period object per offline session. Compact them
      // into daily entries as they are loaded.
      const legacyPeriods = Array.isArray(candidate)
        ? candidate
        : candidate && Array.isArray(candidate.periods)
          ? candidate.periods
          : [];
      this.days = [];
      this.openPeriodStart = null;

      legacyPeriods
        .filter(isStoredPeriod)
        .forEach((period) => {
          const start = Number(period.start);
          if (period.end === null || period.end === undefined) {
            if (
              this.openPeriodStart === null ||
              start < this.openPeriodStart
            ) {
              this.openPeriodStart = start;
            }
            return;
          }
          this.aggregatePeriod(start, Number(period.end));
        });
      this.sortDays();
    } catch {
      this.days = [];
      this.openPeriodStart = null;
    }
  }

  clearPeriods(): void {
    this.days = [];
    this.openPeriodStart = null;
  }

  discardOpenPeriod(): void {
    this.openPeriodStart = null;
  }

  computeCompletedMs(): number {
    return this.days.reduce((total, day) => total + day.durationMs, 0);
  }

  computeTotalMs(now?: number): number {
    const openDuration =
      this.openPeriodStart === null
        ? 0
        : Math.max(0, (now ?? Date.now()) - this.openPeriodStart);
    return this.computeCompletedMs() + openDuration;
  }

  getOpenPeriod(): Period | null {
    return this.openPeriodStart === null
      ? null
      : new Period(this.openPeriodStart);
  }

  closeAnyOpenPeriod(endTs: number): number | undefined {
    if (this.openPeriodStart === null) return;

    const start = this.openPeriodStart;
    const duration = Math.max(0, endTs - start);
    this.aggregatePeriod(start, endTs);
    this.openPeriodStart = null;
    return duration;
  }

  openPeriodIfNeeded(startTs: number): void {
    if (this.openPeriodStart !== null) return;
    this.openPeriodStart = startTs;
  }

  private aggregatePeriod(start: number, end: number): void {
    if (end < start) return;

    if (end === start) {
      this.addDaySegment(getDayStart(start), 0, start, end);
      return;
    }

    let cursor = start;
    while (cursor < end) {
      const dayStart = getDayStart(cursor);
      const nextDayStart = getNextDayStart(dayStart);
      const segmentEnd = Math.min(end, nextDayStart);
      this.addDaySegment(dayStart, segmentEnd - cursor, cursor, segmentEnd);
      cursor = segmentEnd;
    }
    this.sortDays();
  }

  private addDaySegment(
    dayStart: number,
    durationMs: number,
    segmentStart: number,
    segmentEnd: number,
  ): void {
    const existing = this.days.find((day) => day.dayStart === dayStart);
    if (existing) {
      existing.durationMs += durationMs;
      existing.periodCount += 1;
      existing.firstStart = Math.min(existing.firstStart, segmentStart);
      existing.lastEnd = Math.max(existing.lastEnd, segmentEnd);
      return;
    }

    this.days.push({
      dayStart,
      durationMs,
      periodCount: 1,
      firstStart: segmentStart,
      lastEnd: segmentEnd,
    });
  }

  private sortDays(): void {
    this.days.sort((left, right) => right.dayStart - left.dayStart);
  }
}

function getCandidate(rawPeriods: unknown):
  | { days?: unknown; openPeriodStart?: unknown; periods?: unknown }
  | unknown[]
  | null {
  if (Array.isArray(rawPeriods)) return rawPeriods;
  if (!rawPeriods || typeof rawPeriods !== "object") return null;

  const record = rawPeriods as Record<string, unknown>;
  const candidate =
    record.periods ??
    record.periodList ??
    record.perdioList ??
    record.offlinePeriods ??
    rawPeriods;
  return candidate && typeof candidate === "object"
    ? (candidate as { days?: unknown; openPeriodStart?: unknown; periods?: unknown })
    : null;
}

function getDayStart(timestamp: number): number {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getNextDayStart(dayStart: number): number {
  const date = new Date(dayStart);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getTime();
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOfflineDay(value: unknown): value is OfflineDay {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    isFiniteNumber(record.dayStart) &&
    isFiniteNumber(record.durationMs) &&
    isFiniteNumber(record.periodCount) &&
    isFiniteNumber(record.firstStart) &&
    isFiniteNumber(record.lastEnd)
  );
}

function isStoredPeriod(value: unknown): value is {
  start: number;
  end: number | null;
} {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    isFiniteNumber(Number(record.start)) &&
    (record.end === null ||
      record.end === undefined ||
      isFiniteNumber(Number(record.end)))
  );
}
