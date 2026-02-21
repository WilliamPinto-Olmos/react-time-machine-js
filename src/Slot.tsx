import React from "react";

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined | null)[]
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref != null)
        (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

function composeHandlers(
  a?: (...args: unknown[]) => void,
  b?: (...args: unknown[]) => void,
): ((...args: unknown[]) => void) | undefined {
  if (!a) return b;
  if (!b) return a;
  return (...args) => {
    a(...args);
    b(...args);
  };
}

export interface SlotProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Merges its own props onto its single child element.
 * Used to implement the `asChild` pattern.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      throw new Error(
        "<Slot> expects a single valid React element as its child.",
      );
    }

    const child = children as React.ReactElement<AnyProps>;
    const childProps = child.props as AnyProps;
    const merged: AnyProps = { ...slotProps };

    for (const key in childProps) {
      if (key === "className") continue;
      if (key.startsWith("on") && typeof childProps[key] === "function") {
        merged[key] = composeHandlers(
          slotProps[key] as ((...a: unknown[]) => void) | undefined,
          childProps[key] as (...a: unknown[]) => void,
        );
      } else {
        merged[key] = childProps[key];
      }
    }

    const classes = [
      slotProps.className as string | undefined,
      childProps.className as string | undefined,
    ]
      .filter(Boolean)
      .join(" ");
    if (classes) merged.className = classes;

    const childRef = (child as unknown as { ref?: React.Ref<unknown> }).ref;
    if (childRef || forwardedRef) {
      merged.ref = mergeRefs(forwardedRef, childRef as React.Ref<HTMLElement>);
    }

    return React.cloneElement(child, merged);
  },
);

Slot.displayName = "Slot";
