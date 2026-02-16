# 21 — Progress Bar Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A linear progress indicator for showing task completion or indeterminate loading. Supports determinate mode (0-100 value), indeterminate mode (animated loop), color variants, and size variants. Uses `role="progressbar"` with proper ARIA attributes.

## Deliverables

- [x] `UiProgressBar` component in `libs/ui/src/lib/progress-bar/progress-bar.ts`
- [x] Determinate mode with value binding (0–100)
- [x] Indeterminate mode with CSS animation
- [x] Color variants (`primary`, `accent`, `success`, `warning`, `error`)
- [x] Size variants (`sm`, `md`)
- [x] `role="progressbar"` with `aria-valuenow/min/max`
- [x] RTL support (fill direction via logical properties)
- [x] Export `UiProgressBar`, `ProgressBarVariant`, `ProgressBarSize`, `ProgressBarMode` from `@follow-up/ui`
- [x] Add to showcase page with determinate, indeterminate, variants, and sizes demos
