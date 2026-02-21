import React from "react";
import { Slot } from "../Slot.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "default" | "primary" | "danger";
  /** Render as the single child element instead of a <button> */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "default", asChild = false, className, children, ...props },
    ref,
  ) => {
    const variantClass =
      variant === "default" ? "tm-button" : `tm-button tm-button-${variant}`;
    const finalClass = className
      ? `${variantClass} ${className}`
      : variantClass;

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={finalClass}
          {...(props as Record<string, unknown>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} className={finalClass} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "UI.Button";
