import React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const finalClass = className ? `tm-label ${className}` : "tm-label";
    return <label ref={ref} className={finalClass} {...props} />;
  },
);

Label.displayName = "UI.Label";
