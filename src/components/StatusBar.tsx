import React from "react";
import { useTimeMachine } from "../context.js";
import { formatDate } from "../utils/dateFormat.js";

export const StatusBar: React.FC = () => {
  const {
    active,
    displayTime,
    mode,
    handleToggleExpand,
    dateFormat,
    translations,
  } = useTimeMachine();

  const getStatusText = () => {
    if (!active) return `● ${translations.realTime}`;
    const dateStr = formatDate(displayTime, dateFormat);
    const modeStr =
      mode === "flowing" ? translations.flowing : translations.frozen;
    return `● ${modeStr}: ${dateStr}`;
  };

  return (
    <div className="time-machine-status-bar" onClick={handleToggleExpand}>
      <span
        className={
          active
            ? "time-machine-status-bar-active"
            : "time-machine-status-bar-inactive"
        }
      >
        {getStatusText()}
      </span>
    </div>
  );
};

StatusBar.displayName = "TimeMachine.StatusBar";
