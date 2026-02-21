# react-time-machine-js

A React component package that provides a ready-to-drop-in dev widget for any React app, powered by [time-machine-js](https://www.npmjs.com/package/time-machine-js).

Control the global `Date.now()` patch directly from a floating widget — with support for plugins, compound components, and full UI customisation.

## Installation

```bash
npm install react-time-machine-js
```

## Basic Usage

Drop the component anywhere in your app, ideally gated behind a dev check:

```tsx
import { TimeMachine } from "react-time-machine-js";

function App() {
  return <div>{process.env.NODE_ENV === "development" && <TimeMachine />}</div>;
}
```

## API

### `<TimeMachine>` Props

| Prop                | Type                                                           | Default              | Description                                                                |
| :------------------ | :------------------------------------------------------------- | :------------------- | :------------------------------------------------------------------------- |
| `position`          | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'`     | Floating widget corner. Ignored when `static` is set.                      |
| `static`            | `boolean`                                                      | `false`              | Render as an in-flow element instead of a fixed overlay.                   |
| `storageKey`        | `string`                                                       | `'__timeMachine__'`  | Key used for `store` state persistence.                                    |
| `dateFormat`        | `string`                                                       | `'yyyy/MM/dd HH:mm'` | Format for date display and input. Tokens: `yyyy`, `MM`, `dd`, `HH`, `mm`. |
| `translations`      | `Partial<TimeMachineTranslations>`                             | —                    | Override default English widget texts seamlessly.                          |
| `plugins`           | `TimeMachinePlugin[]`                                          | `[]`                 | Plugins to register (see below).                                           |
| `onTravel`          | `(timestamp: number, mode: 'flowing' \| 'frozen') => void`     | —                    | Fired on activation.                                                       |
| `onReturnToPresent` | `() => void`                                                   | —                    | Fired on reset.                                                            |
| `children`          | `ReactNode`                                                    | —                    | Enables compound-component mode (see below).                               |

---

## Plugins

Plugins hook into lifecycle events and can optionally add a tab to the widget panel.

```ts
import type { TimeMachinePlugin } from "react-time-machine-js";

interface TimeMachinePlugin {
  name: string; // unique id + tab label
  icon?: React.ReactNode; // optional tab icon
  panel?: () => React.ReactNode; // if provided, adds a tab to the widget
  onTravel?: (timestamp: number, mode: "flowing" | "frozen") => void;
  onReturnToPresent?: () => void;
  onTick?: (timestamp: number) => void; // called every second
}
```

### Headless plugin (hooks only, no tab)

```tsx
const loggerPlugin: TimeMachinePlugin = {
  name: "logger",
  onTravel: (ts, mode) =>
    console.log("[TimeMachine] jumped to", new Date(ts), mode),
  onReturnToPresent: () => console.log("[TimeMachine] reset"),
};

<TimeMachine plugins={[loggerPlugin]} />;
```

### Plugin with a panel tab

When any plugin provides a `panel`, a tab bar appears in the widget. The built-in controls move to a **Core** tab.

```tsx
import { TimeMachine, UI } from "react-time-machine-js";
import { travel } from "time-machine-js";

const scenariosPlugin: TimeMachinePlugin = {
  name: "Scenarios",
  panel: () => (
    <div>
      <UI.Label>Jump to scenario</UI.Label>
      <UI.Button onClick={() => travel(Date.parse("2020-01-01"), "frozen")}>
        Y2K20
      </UI.Button>
      <UI.Button onClick={() => travel(Date.parse("2038-01-19"), "frozen")}>
        Y2K38
      </UI.Button>
    </div>
  ),
};

<TimeMachine plugins={[scenariosPlugin]} />;
```

---

## UI Primitives

Plugin authors can import the same UI primitives used by the core widget to keep consistent styling:

```tsx
import { UI } from 'react-time-machine-js';

// Available: UI.Button, UI.Input, UI.Label, UI.Select, UI.Divider
<UI.Button variant="primary">Go</UI.Button>
<UI.Button variant="danger">Delete</UI.Button>
<UI.Input type="text" placeholder="value" />
<UI.Label>My label</UI.Label>
<UI.Select>...</UI.Select>
<UI.Divider />
```

All primitives can also be imported individually:

```tsx
import { Button, Input, Label, Select, Divider } from "react-time-machine-js";
```

---

## Compound Components

For full layout control, pass children to `<TimeMachine>`. All sub-components read from context automatically.

```tsx
<TimeMachine static dateFormat="MM-dd-yyyy HH:mm">
  <TimeMachine.StatusBar />
  <TimeMachine.Panel>
    <TimeMachine.Input />
    <TimeMachine.ModeToggle />
    <TimeMachine.ActivateButton />
    <TimeMachine.ResetButton />
  </TimeMachine.Panel>
</TimeMachine>
```

### `asChild`

`ActivateButton`, `ResetButton`, and `Panel` support `asChild`, which merges the component's behaviour onto its single child element (similar to Radix UI):

```tsx
<TimeMachine.ActivateButton asChild>
  <MyButton variant="primary" />
</TimeMachine.ActivateButton>
```

### Available sub-components

| Component                    | Description                                                |
| :--------------------------- | :--------------------------------------------------------- |
| `TimeMachine.StatusBar`      | Clickable status pill                                      |
| `TimeMachine.Panel`          | Collapsible content container                              |
| `TimeMachine.Input`          | Date/time text input (uses `dateFormat`)                   |
| `TimeMachine.ModeToggle`     | Flowing / Frozen toggle                                    |
| `TimeMachine.ActivateButton` | Activate button (supports `asChild`)                       |
| `TimeMachine.ResetButton`    | Reset button — hidden when not active (supports `asChild`) |

---

## Advanced — Context Hook

Access widget state from any component rendered inside `<TimeMachine>`:

```tsx
import { useTimeMachine } from "react-time-machine-js";

function MyPanel() {
  const { active, displayTime, handleReset, store } = useTimeMachine();

  const saveState = () => store.set("my-state", "foo");

  return <div>{active ? new Date(displayTime).toISOString() : "idle"}</div>;
}
```

---

## Store API

The package exposes a `store` object to safely abstract `localStorage` operations.

When accessed securely via `useTimeMachine().store`, the `storageKey` prefix is automatically prepended to prevent collisions with other local storage data.

```typescript
import { useTimeMachine, store } from "react-time-machine-js";

// Accessing the scoped store from within the TimeMachine context
const { store: scopedStore } = useTimeMachine();
scopedStore.set("my-plugin-data", { key: "value" });

// Accessing the global store anywhere else
store.set("app-data", "value");
```

---

## Behavior

- **Auto-Restore**: On mount, saved state is restored from `localStorage`.
- **Auto-Cleanup**: On unmount, `returnToPresent()` is called automatically.
- **Persistence**: Clicking "Activate" saves state; "Return to Present" clears it.
- **Sync**: Widget polls every second to keep the status display current.

## Styling

Styles are fully self-contained in `TimeMachine.css`. Import it alongside the component:

```tsx
import "react-time-machine-js/dist/TimeMachine.css";
```

The widget uses `z-index: 9999` to stay on top in floating mode.

## License

MIT
