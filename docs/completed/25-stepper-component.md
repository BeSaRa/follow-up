# 25 — Stepper Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A multi-step wizard/stepper component for guiding users through a sequential flow (e.g. checkout, onboarding, form wizards). Consists of a `UiStepper` container and `UiStep` children. Supports linear mode (must complete each step before proceeding) and free navigation mode.

## Deliverables

- [x] `UiStepper` component in `libs/ui/src/lib/stepper/stepper.ts`
- [x] `UiStep` component with `label`, `completed`, `optional` inputs
- [x] Step header with numbered circles, labels, and connecting lines
- [x] Active step content rendering
- [x] Completed step checkmark icon
- [x] Linear mode (sequential enforcement)
- [x] Free navigation mode (click any step header)
- [x] `next()` and `previous()` methods
- [x] Horizontal and vertical orientations
- [x] Keyboard navigation (Arrow keys between step headers)
- [x] ARIA: `role="tablist"` on header, `role="tab"` on step triggers, `role="tabpanel"` on content
- [x] RTL support (horizontal connector direction, logical positioning)
- [x] Export `UiStepper`, `UiStep`, `StepperOrientation` from `@follow-up/ui`
- [x] Add to showcase page with basic, linear, vertical, and completed-steps demos
