import React from "react";
import { useTimeMachine } from "../context.js";
import type { TimeMachineMode } from "../context.js";

const MODES: TimeMachineMode[] = ["flowing", "frozen"];

export const ModeToggle: React.FC = () => {
  const { mode, setMode } = useTimeMachine();

  return (
    <div className="time-machine-input-group">
      <label>Mode:</label>
      <div className="time-machine-toggle">
        {MODES.map((m) => (
          <div
            key={m}
            className={`time-machine-toggle-option ${mode === m ? "time-machine-toggle-option-active" : ""}`}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

ModeToggle.displayName = "TimeMachine.ModeToggle";
