import type { OfflineDay } from "../models/periodList";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";
import { formatDateTime, formatDay, formatDuration } from "../utils/format";
import "../styles/PeriodItem.css";

export default function DayItem({ day }: { day: OfflineDay }) {
  const periodLabel = `${day.periodCount} période${day.periodCount > 1 ? "s" : ""}`;

  return (
    <div className="period-item">
      <div className="period-dot"></div>
      <div className="period-content">
        <div className="period-top">
          <span className="period-status">{formatDay(day.dayStart)}</span>
          <div className="period-metrics">
            <span className="period-duration">
              {formatDuration(day.durationMs)}
            </span>
            <span className="period-offlinium-tag">
              +{Math.floor(day.durationMs / OFFLINIUM_DELIVERY_INTERVAL)} ⬡
            </span>
          </div>
        </div>
        <div className="period-time">
          {periodLabel} · {formatDateTime(day.firstStart)} →{" "}
          {formatDateTime(day.lastEnd)}
        </div>
      </div>
    </div>
  );
}
