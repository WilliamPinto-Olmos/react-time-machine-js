import type React from "react";

export interface TimeMachinePlugin {
  /** Unique identifier and tab label */
  name: string;
  /** Optional icon shown in the tab bar */
  icon?: React.ReactNode;
  /**
   * If provided, the plugin appears as a named tab with this panel content.
   * Omit to create a headless plugin that only uses lifecycle hooks.
   */
  panel?: () => React.ReactNode;
  /** Called when time travel is activated */
  onTravel?: (timestamp: number, mode: "flowing" | "frozen") => void;
  /** Called when the machine is reset to the present */
  onReturnToPresent?: () => void;
  /** Called every second with the current simulated timestamp */
  onTick?: (timestamp: number) => void;
}
