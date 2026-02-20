import React, { useState, useEffect } from 'react';
import { travel, returnToPresent, getOffset, isActive, save, restore, TimeMachineMode, getMode } from 'time-machine-js';
import './TimeMachine.css';

export interface TimeMachineProps {
  /**
   * Position of the widget on the screen.
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /**
   * The localStorage key used to persist the time machine state.
   * @default '__timeMachine__'
   */
  storageKey?: string;
  /**
   * Callback fired when a new time/mode is activated.
   */
  onTravel?: (timestamp: number, mode: 'flowing' | 'frozen') => void;
  /**
   * Callback fired when the time machine is reset.
   */
  onReturnToPresent?: () => void;
}

let isRestored = false;

export const TimeMachine: React.FC<TimeMachineProps> = ({
  position = 'bottom-right',
  storageKey = '__timeMachine__',
  onTravel,
  onReturnToPresent,
}) => {
  if (!isRestored) {
    restore(storageKey);
    isRestored = true;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState(isActive());
  const [displayTime, setDisplayTime] = useState(Date.now());
  const [mode, setMode] = useState<TimeMachineMode>('flowing');
  const [inputTime, setInputTime] = useState('');

  useEffect(() => {
    const update = () => {
      setActive(isActive());
      setDisplayTime(Date.now());
    };

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      returnToPresent();
    };
  }, []);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const localStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setInputTime(localStr);
      const currentMode = getMode();
      if (currentMode) {
        setMode(currentMode);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const handleActivate = () => {
    const timestamp = new Date(inputTime).getTime();
    if (isNaN(timestamp)) return;

    travel(timestamp, mode);
    save(storageKey);
    setActive(true);
    if (onTravel) onTravel(timestamp, mode);
  };

  const handleReset = () => {
    returnToPresent();
    localStorage.removeItem(storageKey);
    setActive(false);
    if (onReturnToPresent) onReturnToPresent();
  };

  const getStatusText = () => {
    if (!active) return '● Real time';
    const dateStr = new Date(displayTime).toLocaleString();
    return `● ${mode.charAt(0).toUpperCase() + mode.slice(1)}: ${dateStr}`;
  };

  return (
    <div className={`time-machine-widget position-${position}`}>
      <div className="time-machine-status-bar" onClick={handleToggleExpand}>
        <span className={active ? 'time-machine-status-bar-active' : 'time-machine-status-bar-inactive'}>
          {getStatusText()}
        </span>
      </div>
      
      <div className={`time-machine-panel ${!isExpanded ? 'time-machine-panel-hidden' : ''}`}>
        <div className="time-machine-input-group">
          <label>Target Date/Time:</label>
          <input 
            type="datetime-local" 
            className="time-machine-input"
            value={inputTime} 
            onChange={(e) => setInputTime(e.target.value)}
          />
        </div>

        <div className="time-machine-input-group">
          <label>Mode:</label>
          <div className="time-machine-toggle">
            <div 
              className={`time-machine-toggle-option ${mode === 'flowing' ? 'time-machine-toggle-option-active' : ''}`}
              onClick={() => setMode('flowing')}
            >
              Flowing
            </div>
            <div 
              className={`time-machine-toggle-option ${mode === 'frozen' ? 'time-machine-toggle-option-active' : ''}`}
              onClick={() => setMode('frozen')}
            >
              Frozen
            </div>
          </div>
        </div>

        <button className="time-machine-button" onClick={handleActivate}>
          Activate
        </button>

        {active && (
          <button className="time-machine-button time-machine-button-reset" onClick={handleReset}>
            Reset to Present
          </button>
        )}
      </div>
    </div>
  );
};
