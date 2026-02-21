import React, { useState, useEffect, useCallback } from "react";
import {
  travel,
  returnToPresent,
  isActive,
  save,
  restore,
  getMode,
} from "time-machine-js";
import "./TimeMachine.css";

import { TimeMachineContext } from "./context.js";
import type { TimeMachineMode } from "./context.js";
import type { TimeMachinePlugin } from "./plugins.js";
import { formatDate, parseDate } from "./utils/dateFormat.js";
import { StatusBar } from "./components/StatusBar.js";
import { Panel } from "./components/Panel.js";
import { Input } from "./components/Input.js";
import { ModeToggle } from "./components/ModeToggle.js";
import { ActivateButton } from "./components/ActivateButton.js";
import { ResetButton } from "./components/ResetButton.js";
import { Tabs } from "./components/Tabs.js";

export interface TimeMachineProps {
  /**
   * Position of the floating widget on the screen.
   * Ignored when `static` is true.
   * @default 'bottom-right'
   */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /**
   * The localStorage key used to persist the time machine state.
   * @default '__timeMachine__'
   */
  storageKey?: string;
  /**
   * Plugins to register. Plugins with a `panel` appear as tabs;
   * headless plugins only fire lifecycle hooks.
   */
  plugins?: TimeMachinePlugin[];
  /**
   * Render the widget as a static in-flow element instead of a fixed overlay.
   * @default false
   */
  static?: boolean;
  /**
   * Format string for date display and input.
   * Supports tokens: yyyy, MM, dd, HH, mm
   * @default 'yyyy/MM/dd HH:mm'
   */
  dateFormat?: string;
  /**
   * Callback fired when a new time/mode is activated.
   */
  onTravel?: (timestamp: number, mode: "flowing" | "frozen") => void;
  /**
   * Callback fired when the time machine is reset.
   */
  onReturnToPresent?: () => void;
  /**
   * Children for compound-component usage.
   * When omitted the default layout is rendered automatically.
   */
  children?: React.ReactNode;
}

const CORE_TAB = "Core";
const DEFAULT_DATE_FORMAT = "yyyy/MM/dd HH:mm";

let isRestored = false;

type TimeMachineComposite = React.FC<TimeMachineProps> & {
  StatusBar: typeof StatusBar;
  Panel: typeof Panel;
  Input: typeof Input;
  ModeToggle: typeof ModeToggle;
  ActivateButton: typeof ActivateButton;
  ResetButton: typeof ResetButton;
};

export const TimeMachine: TimeMachineComposite = ({
  position = "bottom-right",
  storageKey = "__timeMachine__",
  plugins = [],
  static: isStatic = false,
  dateFormat = DEFAULT_DATE_FORMAT,
  onTravel,
  onReturnToPresent,
  children,
}) => {
  if (!isRestored) {
    restore(storageKey);
    isRestored = true;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState(isActive());
  const [displayTime, setDisplayTime] = useState(Date.now());
  const [mode, setMode] = useState<TimeMachineMode>("flowing");
  const [inputTime, setInputTime] = useState("");
  const [activeTab, setActiveTab] = useState(CORE_TAB);

  useEffect(() => {
    const update = () => {
      setActive(isActive());
      setDisplayTime(Date.now());
      plugins.forEach((p) => p.onTick?.(Date.now()));
    };
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [plugins]);

  useEffect(() => {
    return () => {
      returnToPresent();
    };
  }, []);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      if (!prev) {
        setInputTime(formatDate(Date.now(), dateFormat));
        const currentMode = getMode();
        if (currentMode) setMode(currentMode as TimeMachineMode);
      }
      return !prev;
    });
  }, [dateFormat]);

  const handleActivate = useCallback(() => {
    const timestamp = parseDate(inputTime, dateFormat);
    if (isNaN(timestamp)) return;
    travel(timestamp, mode);
    save(storageKey);
    setActive(true);
    onTravel?.(timestamp, mode);
    plugins.forEach((p) => p.onTravel?.(timestamp, mode));
  }, [inputTime, dateFormat, mode, storageKey, onTravel, plugins]);

  const handleReset = useCallback(() => {
    returnToPresent();
    localStorage.removeItem(storageKey);
    setActive(false);
    setActiveTab(CORE_TAB);
    onReturnToPresent?.();
    plugins.forEach((p) => p.onReturnToPresent?.());
  }, [storageKey, onReturnToPresent, plugins]);

  const containerClass = [
    "time-machine-widget",
    isStatic ? "time-machine-static" : `position-${position}`,
  ].join(" ");

  const ctxValue = {
    active,
    displayTime,
    mode,
    inputTime,
    isExpanded,
    plugins,
    activeTab,
    dateFormat,
    setInputTime,
    setMode,
    setActiveTab,
    handleToggleExpand,
    handleActivate,
    handleReset,
  };

  const defaultLayout = (
    <>
      <StatusBar />
      <Panel>
        <Tabs />
        {activeTab === CORE_TAB ? (
          <>
            <Input />
            <ModeToggle />
            <ActivateButton />
            <ResetButton />
          </>
        ) : (
          plugins.find((p) => p.name === activeTab)?.panel?.()
        )}
      </Panel>
    </>
  );

  return (
    <TimeMachineContext.Provider value={ctxValue}>
      <div className={containerClass}>{children ?? defaultLayout}</div>
    </TimeMachineContext.Provider>
  );
};

TimeMachine.StatusBar = StatusBar;
TimeMachine.Panel = Panel;
TimeMachine.Input = Input;
TimeMachine.ModeToggle = ModeToggle;
TimeMachine.ActivateButton = ActivateButton;
TimeMachine.ResetButton = ResetButton;
