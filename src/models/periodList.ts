import { Period } from "./period";

export class PeriodList {
  periods: Period[];

  constructor(periods: Period[] = []) {
    this.periods = periods;
  }

  loadPeriods(rawPeriods: unknown = []): void {
    try {
      let list: any[] = [];
      if (Array.isArray(rawPeriods)) {
        list = rawPeriods;
      } else if (rawPeriods && typeof rawPeriods === "object") {
        const candidate =
          (rawPeriods as any).periods ??
          (rawPeriods as any).periodList ??
          (rawPeriods as any).perdioList ??
          (rawPeriods as any).offlinePeriods;
        if (Array.isArray(candidate)) {
          list = candidate;
        }
      }
      this.periods = list
        .filter((p: any) => p && p.start !== undefined && !isNaN(Number(p.start)))
        .map(
          (p: any) =>
            new Period(
              Number(p.start),
              p.end !== null && p.end !== undefined && !isNaN(Number(p.end))
                ? Number(p.end)
                : null,
            ),
        );
    } catch {
      this.periods = [];
    }
  }

  clearPeriods(): void {
    this.periods = [];
  }

  computeTotalMs(now?: number): number {
  return this.periods.reduce((total: number, p: Period) => {
    const end = p.end ?? now;
    const dur = Number(end) - Number(p.start);
    return total + Math.max(0, dur);
  }, 0);
}

  closeAnyOpenPeriod(endTs: number): void {
    const openIdx = this.periods.findIndex((p) => p.end === null);
    if (openIdx === -1) return;
    this.periods[openIdx].close(endTs);
  }

  openPeriodIfNeeded(
  startTs: number,
): void {
  const hasOpen = this.periods.some((p) => p.end === null);
  if (hasOpen) return;
  this.periods.push(new Period(startTs));
}
}