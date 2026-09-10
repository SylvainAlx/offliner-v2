import type { Period } from "../models/period";
import { OFFLINIUM_DELIVERY_INTERVAL } from "../utils/constants";
import { formatDateTime, formatDuration } from "../utils/format";
import "../styles/PeriodItem.css";

interface PeriodItemProps {
  isOpen: boolean;
  now?: number;
  period: Period;
}

export default function PeriodItem({ isOpen, now, period }: PeriodItemProps) {
  return (
    <div className={`period-item ${isOpen && "period-open"}`}>
      <div className={`period-dot ${isOpen && "period-dot-active"}`}></div>
      <div className="period-content">
        <div className="period-top">
          <span className="period-status">
            {isOpen ? "En cours…" : "Terminé"}
          </span>
          <div className="period-metrics">
            <span className="period-duration">
              {formatDuration(
                period.getPeriodDurationMs(
                  isOpen && now !== undefined ? now : undefined,
                ),
              )}
            </span>
            <span className={`period-offlinium-tag ${isOpen && "active"}`}>
              {isOpen && now !== undefined
                ? "+" +
                  Math.floor(
                    period.getPeriodDurationMs(now) /
                      OFFLINIUM_DELIVERY_INTERVAL,
                  ) +
                  " ⬡"
                : "+" + period.getOffliniumGain() + " ⬡"}
            </span>
          </div>
        </div>
        <div className="period-time">
          {isOpen
            ? "Débuté le " + formatDateTime(period.start)
            : period.end != null
              ? formatDateTime(period.end) + " → " + formatDateTime(period.end)
              : ""}
        </div>
      </div>
    </div>
  );
}
