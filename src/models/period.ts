import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";

export class Period {
  start: number;
  end: number | null;

  constructor(start: number, end: number | null = null) {
    this.start = start;
    this.end = end;
  }

  getPeriodDurationMs(now: number): number {
    const end = this.end ?? now;
    return Math.max(0, end - this.start);
  } 

  getOffliniumGain(now: number): number {
    return Math.floor(this.getPeriodDurationMs(now) / OFFLINIUM_DELIVERY_INTERVAL);
  }
}