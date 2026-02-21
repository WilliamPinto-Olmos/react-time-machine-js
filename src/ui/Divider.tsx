import React from "react";

export type DividerProps = React.HTMLAttributes<HTMLHRElement>;

export const Divider: React.FC<DividerProps> = ({ className, ...props }) => {
  const finalClass = className ? `tm-divider ${className}` : "tm-divider";
  return <hr className={finalClass} {...props} />;
};

Divider.displayName = "UI.Divider";
