import type { Period } from "../models/period";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0) parts.push(`${seconds}s`);
  else if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length === 0) return "0s";
  return parts.join(" ");
}

function periodDurationMs(period: Period, now: number): number {
  const end = period.end ?? now;
  return Math.max(0, end - period.start);
}

export { formatDate, formatDateTime, formatDuration, periodDurationMs };
