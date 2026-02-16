# 26 — Toast Service

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A global notification service for showing temporary toast messages. Toasts appear in a fixed corner of the viewport, stack vertically, auto-dismiss after a configurable duration, and can be manually dismissed. Supports multiple variants (success, error, warning, info), optional titles, and an action button. Uses Angular CDK overlay or a simple fixed-position container.

## API Design

### `ToastService` (injectable, `providedIn: 'root'`)

**Methods:**
- `success(message: string, options?: ToastOptions): ToastRef`
- `error(message: string, options?: ToastOptions): ToastRef`
- `warning(message: string, options?: ToastOptions): ToastRef`
- `info(message: string, options?: ToastOptions): ToastRef`
- `show(config: ToastConfig): ToastRef`
- `dismissAll(): void`

### `ToastOptions` (interface)

- `title?: string` — optional bold title above the message
- `duration?: number` — auto-dismiss delay in ms (default: `5000`; `0` = persistent)
- `dismissible?: boolean` — shows close button (default: `true`)
- `action?: { label: string; callback: () => void }` — optional action button
- `position?: ToastPosition` — override global position for this toast

### `ToastConfig` (interface)

Extends `ToastOptions` with:
- `message: string` — toast body text
- `variant: ToastVariant` — `'success' | 'error' | 'warning' | 'info'`

### `ToastRef` (class)

- `dismiss(): void` — manually dismiss this toast
- `afterDismissed: Observable<void>` — emits when the toast is removed

### `ToastPosition` (type)

`'top-end' | 'top-start' | 'top-center' | 'bottom-end' | 'bottom-start' | 'bottom-center'`

Default: `'bottom-end'`

### `provideToastDefaults(config: Partial<ToastDefaults>)` (provider function)

Allows apps to set global defaults (position, duration, etc.) via `provideToastDefaults()` in app config.

### `ToastDefaults` (interface)

- `position: ToastPosition` — default: `'bottom-end'`
- `duration: number` — default: `5000`

## Architecture

```
ToastService (root singleton)
  └─ manages a signal<ToastData[]> of active toasts
  └─ creates/removes toast entries

UiToastContainer (component, rendered once via service)
  └─ fixed-position container at chosen corner
  └─ @for loop over active toasts
  └─ renders UiToast for each entry

UiToast (component)
  └─ individual toast card with icon, title, message, close button, action
  └─ variant-colored left border or icon
  └─ enter/leave animation (CSS transition)
  └─ auto-dismiss timer (pausable on hover)
```

## Visual Layout

```
                              ┌───────────────────────────┐
                              │ ✓  Title (optional)     × │
                              │    Message text here...    │
                              │              [Action]      │
                              └───────────────────────────┘
                              ┌───────────────────────────┐
                              │ ✕  Error occurred        × │
                              │    Something went wrong.   │
                              └───────────────────────────┘

Position: bottom-end (default)
Stacks vertically, newest on top or bottom
```

## Deliverables

- [x] `ToastService` in `libs/ui/src/lib/toast/toast.ts` with `success()`, `error()`, `warning()`, `info()`, `show()`, `dismissAll()`
- [x] `ToastRef` with `dismiss()` and `afterDismissed` observable
- [x] `UiToastContainer` component for fixed-position stacking
- [x] `UiToast` component with variant styling (icon + colored accent)
- [x] Auto-dismiss with configurable duration (pause on hover)
- [x] Manual dismiss via close button
- [x] Optional title and action button
- [x] Position variants (`top-end`, `top-start`, `top-center`, `bottom-end`, `bottom-start`, `bottom-center`) with RTL support via logical properties
- [x] Enter/leave CSS animation (slide + fade)
- [x] `provideToastDefaults()` for global configuration
- [x] Export `ToastService`, `ToastRef`, `ToastOptions`, `ToastConfig`, `ToastPosition`, `ToastVariant`, `provideToastDefaults` from `@follow-up/ui`
- [x] Add to showcase page with buttons triggering each variant, persistent toast, action toast, and position demos
