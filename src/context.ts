import React from "react";
import type { TimeMachinePlugin } from "./plugins.js";

export type TimeMachineMode = "flowing" | "frozen";

export interface TimeMachineContextValue {
  active: boolean;
  displayTime: number;
  mode: TimeMachineMode;
  inputTime: string;
  isExpanded: boolean;
  plugins: TimeMachinePlugin[];
  activeTab: string;
  dateFormat: string;
  setInputTime: (v: string) => void;
  setMode: (mode: TimeMachineMode) => void;
  setActiveTab: (tab: string) => void;
  handleToggleExpand: () => void;
  handleActivate: () => void;
  handleReset: () => void;
}

export const TimeMachineContext =
  React.createContext<TimeMachineContextValue | null>(null);

export function useTimeMachine(): TimeMachineContextValue {
  const ctx = React.useContext(TimeMachineContext);
  if (!ctx) {
    throw new Error(
      "TimeMachine sub-components must be rendered within <TimeMachine>.",
    );
  }
  return ctx;
}
