# react-time-machine-js

A React component package that provides a ready-to-drop-in dev widget for any React app, powered by [time-machine-js](https://www.npmjs.com/package/time-machine-js).

It provides a minimal UI to control the global `Date.now()` patch, allowing you to simulate different points in time (flowing or frozen) during development.

## Installation

```bash
npm install react-time-machine-js
```

> [!NOTE]
> `react` (>=17) is a peer dependency and must be provided by the consumer.

## Usage

Render the `<TimeMachine />` component anywhere in your app. It is recommended to wrap it in a development guard.

```tsx
import { TimeMachine } from 'react-time-machine-js';

function App() {
  return (
    <div>
      {/* ... your app ... */}
      
      {process.env.NODE_ENV === 'development' && <TimeMachine />}
    </div>
  );
}
```

## API

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Widget corner position. |
| `storageKey` | `string` | `'__timeMachine__'` | LocalStorage key for persistence. |
| `onTravel` | `(timestamp: number, mode: 'flowing' | 'frozen') => void` | - | Callback on activation. |
| `onReturnToPresent` | `() => void` | - | Callback on reset. |

## Behavior

- **Auto-Restore**: On mount, the component automatically restores any saved state from `localStorage`.
- **Auto-Cleanup**: On unmount, the component calls `returnToPresent()` to restore the native `Date.now()`.
- **Persistence**: Clicking "Activate" saves the state to `localStorage`. Clicking "Reset" clears the saved state.
- **Sync**: The widget polls the current simulated time every second to keep the status display in sync.

## Styling

Styles are fully self-contained using inline CSS. No external stylesheets or configuration required. The widget uses a high z-index (`9999`) to stay on top of your application.

## License

MIT
