import { Period } from "./period";

export class PeriodList {
  periods: Period[];

  constructor(periods: Period[] = []) {
    this.periods = periods;
  }

  loadPeriods(rawPeriods: object[] | Period[] = []): void {
    try {
      if (Array.isArray(rawPeriods)) {
        this.periods = rawPeriods as Period[];
      } else {
        this.periods = [];
      }
    } catch {
      this.periods = [];
    }
  }

  addPeriod(period: Period): void {
    this.periods.push(period);
  }

  removePeriod(period: Period): void {
    this.periods = this.periods.filter((p) => p !== period);
  }

  clearPeriods(): void {
    this.periods = [];
  }

  computeTotalMs(now: number): number {
  return this.periods.reduce((total: number, p: Period) => {
    const end = p.end ?? now;
    const dur = end - p.start;
    return total + Math.max(0, dur);
  }, 0);
}

closeAnyOpenPeriod(
  endTs: number,
): void {
  const openIdx = this.periods.findIndex((p) => p.end === null);
  if (openIdx === -1) return;
  const updated = this.periods.slice();
  updated[openIdx] = new Period(updated[openIdx].start, endTs);
}

openPeriodIfNeeded(
  startTs: number,
): void {
  const hasOpen = this.periods.some((p) => p.end === null);
  if (hasOpen) return;
  this.periods.push(new Period(startTs));
}
}