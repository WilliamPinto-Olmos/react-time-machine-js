export { Button } from "./Button.js";
export type { ButtonProps } from "./Button.js";
export { Input } from "./Input.js";
export type { InputProps } from "./Input.js";
export { Label } from "./Label.js";
export type { LabelProps } from "./Label.js";
export { Select } from "./Select.js";
export type { SelectProps } from "./Select.js";
export { Divider } from "./Divider.js";
export type { DividerProps } from "./Divider.js";

import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { Label } from "./Label.js";
import { Select } from "./Select.js";
import { Divider } from "./Divider.js";

/**
 * Shared UI primitives for building plugin panels.
 * Use these to keep your plugin UI consistent with the core widget.
 *
 * @example
 * import { UI } from 'react-time-machine-js';
 * <UI.Label>My label</UI.Label>
 * <UI.Input type="text" />
 * <UI.Button variant="primary">Go</UI.Button>
 */
export const UI = { Button, Input, Label, Select, Divider };
