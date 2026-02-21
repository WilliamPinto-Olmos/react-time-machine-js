import React from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    const finalClass = className ? `tm-select ${className}` : "tm-select";
    return <select ref={ref} className={finalClass} {...props} />;
  },
);

Select.displayName = "UI.Select";
