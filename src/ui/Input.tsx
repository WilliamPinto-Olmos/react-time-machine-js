import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const finalClass = className ? `tm-input ${className}` : "tm-input";
    return <input ref={ref} className={finalClass} {...props} />;
  },
);

Input.displayName = "UI.Input";
