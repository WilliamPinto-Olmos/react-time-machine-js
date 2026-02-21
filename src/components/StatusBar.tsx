import React from "react";
import { useTimeMachine } from "../context.js";
import { formatDate } from "../utils/dateFormat.js";

export const StatusBar: React.FC = () => {
  const { active, displayTime, mode, handleToggleExpand, dateFormat } =
    useTimeMachine();

  const getStatusText = () => {
    if (!active) return "● Real time";
    const dateStr = formatDate(displayTime, dateFormat);
    return `● ${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${dateStr}`;
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
