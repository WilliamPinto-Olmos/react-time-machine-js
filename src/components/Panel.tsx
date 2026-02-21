import React from "react";
import { useTimeMachine } from "../context.js";
import { Slot } from "../Slot.js";

export interface PanelProps {
  /** Render as the single child element instead of a <div> */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  asChild = false,
  children,
  className,
}) => {
  const { isExpanded } = useTimeMachine();

  const classes = [
    "time-machine-panel",
    !isExpanded ? "time-machine-panel-hidden" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (asChild) {
    return (
      <Slot className={classes}>
        {React.Children.only(children) as React.ReactElement}
      </Slot>
    );
  }

  return <div className={classes}>{children}</div>;
};

Panel.displayName = "TimeMachine.Panel";
