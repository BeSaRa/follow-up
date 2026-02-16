# 21 — Progress Bar Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A linear progress indicator for showing task completion or indeterminate loading. Supports determinate mode (0-100 value), indeterminate mode (animated loop), color variants, and size variants. Uses `role="progressbar"` with proper ARIA attributes.

## API Design

### `UiProgressBar` (component, selector: `ui-progress-bar`)

**Inputs:**
- `value: number` — current progress 0–100 (default: `0`)
- `mode: 'determinate' | 'indeterminate'` — progress mode (default: `'determinate'`)
- `variant: 'primary' | 'accent' | 'success' | 'warning' | 'error'` — bar color (default: `'primary'`)
- `size: 'sm' | 'md'` — track height (default: `'md'`; sm=4px, md=8px)

**Behavior:**
- Determinate: bar width as percentage of value, clamped 0–100
- Indeterminate: CSS animation (sliding bar loop)
- Track uses `bg-border` background; fill uses variant color
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- RTL-aware: fill grows from inline-start

## Visual Layout

```
Determinate (60%):
[████████████░░░░░░░░]

Indeterminate:
[░░░███████░░░░░░░░░░]  ← animated sliding
```

## Deliverables

- [ ] `UiProgressBar` component in `libs/ui/src/lib/progress-bar/progress-bar.ts`
- [ ] Determinate mode with value binding (0–100)
- [ ] Indeterminate mode with CSS animation
- [ ] Color variants (`primary`, `accent`, `success`, `warning`, `error`)
- [ ] Size variants (`sm`, `md`)
- [ ] `role="progressbar"` with `aria-valuenow/min/max`
- [ ] RTL support (fill direction via logical properties)
- [ ] Export `UiProgressBar`, `ProgressBarVariant`, `ProgressBarSize`, `ProgressBarMode` from `@follow-up/ui`
- [ ] Add to showcase page with determinate, indeterminate, variants, and sizes demos
