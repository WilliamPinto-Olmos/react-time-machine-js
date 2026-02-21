import React from "react";
import { useTimeMachine } from "../context.js";

export const Input: React.FC = () => {
  const { inputTime, setInputTime, dateFormat } = useTimeMachine();

  return (
    <div className="time-machine-input-group">
      <label>Target Date/Time:</label>
      <input
        type="text"
        className="time-machine-input"
        value={inputTime}
        placeholder={dateFormat}
        onChange={(e) => setInputTime(e.target.value)}
      />
    </div>
  );
};

Input.displayName = "TimeMachine.Input";
