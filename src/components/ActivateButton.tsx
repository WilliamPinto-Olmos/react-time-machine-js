import React from "react";
import { useTimeMachine } from "../context.js";
import { Slot } from "../Slot.js";

export interface ActivateButtonProps {
  /** Render as the single child element instead of a <button> */
  asChild?: boolean;
  children?: React.ReactNode;
}

export const ActivateButton: React.FC<ActivateButtonProps> = ({
  asChild = false,
  children,
}) => {
  const { handleActivate } = useTimeMachine();

  if (asChild) {
    return (
      <Slot
        className="time-machine-button"
        onClick={handleActivate as unknown as React.MouseEventHandler}
      >
        {React.Children.only(children) as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button className="time-machine-button" onClick={handleActivate}>
      {children ?? "Activate"}
    </button>
  );
};

ActivateButton.displayName = "TimeMachine.ActivateButton";
