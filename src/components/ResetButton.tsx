import React from "react";
import { useTimeMachine } from "../context.js";
import { Slot } from "../Slot.js";

export interface ResetButtonProps {
  /** Render as the single child element instead of a <button> */
  asChild?: boolean;
  children?: React.ReactNode;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  asChild = false,
  children,
}) => {
  const { active, handleReset, translations } = useTimeMachine();

  if (!active) return null;

  if (asChild) {
    return (
      <Slot
        className="time-machine-button time-machine-button-reset"
        onClick={handleReset as unknown as React.MouseEventHandler}
      >
        {React.Children.only(children) as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button
      className="time-machine-button time-machine-button-reset"
      onClick={handleReset}
    >
      {children ?? translations.returnToPresent}
    </button>
  );
};

ResetButton.displayName = "TimeMachine.ResetButton";
