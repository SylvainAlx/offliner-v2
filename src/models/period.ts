import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";

export class Period {
  start: number;
  end: number | null;
  private finalDuration: number;

  constructor(start: number, end: number | null = null) {
    this.start = start;
    this.end = end;
    this.finalDuration = this.getPeriodDurationMs();
  }

  close(end: number): number {
    this.end = end;
    this.finalDuration = this.getPeriodDurationMs(end);
    return this.finalDuration;
  }

  getPeriodDurationMs(now?: number): number {
    if (this.finalDuration) return this.finalDuration;
    const end = this.end ?? now ?? Date.now();
    return Math.max(0, end - this.start);
  }

  getOffliniumGain(now?: number): number {
    const duration = this.getPeriodDurationMs(now);
    return Math.floor(duration / OFFLINIUM_DELIVERY_INTERVAL);
  }
}
