# 25 — Stepper Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A multi-step wizard/stepper component for guiding users through a sequential flow (e.g. checkout, onboarding, form wizards). Consists of a `UiStepper` container, `UiStep` definitions, and an optional `UiStepHeader` for the progress indicator. Supports linear mode (must complete each step before proceeding) and free navigation mode.

## API Design

### `UiStepper` (component, selector: `ui-stepper`)

**Inputs:**
- `selectedIndex: number` — active step index (two-way via `model()`, default: `0`)
- `linear: boolean` — enforces sequential progression (default: `false`)
- `orientation: 'horizontal' | 'vertical'` — layout direction (default: `'horizontal'`)

**Behavior:**
- Renders a step header (numbered circles with labels connected by lines) and the active step's content
- In linear mode, cannot jump to a step unless all previous steps are completed
- Provides `next()` and `previous()` methods for programmatic navigation
- Keyboard: ArrowLeft/ArrowRight (horizontal) or ArrowUp/ArrowDown (vertical) to navigate step headers

### `UiStep` (component, selector: `ui-step`)

**Inputs:**
- `label: string` — step header label (required)
- `completed: boolean` — marks step as completed (default: `false`)
- `optional: boolean` — marks step as skippable in linear mode (default: `false`)

**Behavior:**
- Content projection for step body
- Completed steps show a checkmark icon in the header
- Optional steps show "(Optional)" sub-label

## Visual Layout

```
Horizontal:
  ①─────②─────③─────④
 Step 1  Step 2  Step 3  Step 4
┌──────────────────────────────┐
│ Step 2 content here...       │
│ [Previous]         [Next]    │
└──────────────────────────────┘

Vertical:
  ① Step 1
  │  Content...
  ② Step 2
  │  Content...
  ③ Step 3
```

## Deliverables

- [ ] `UiStepper` component in `libs/ui/src/lib/stepper/stepper.ts`
- [ ] `UiStep` component with `label`, `completed`, `optional` inputs
- [ ] Step header with numbered circles, labels, and connecting lines
- [ ] Active step content rendering
- [ ] Completed step checkmark icon
- [ ] Linear mode (sequential enforcement)
- [ ] Free navigation mode (click any step header)
- [ ] `next()` and `previous()` methods
- [ ] Horizontal and vertical orientations
- [ ] Keyboard navigation (Arrow keys between step headers)
- [ ] ARIA: `role="tablist"` on header, `role="tab"` on step triggers, `role="tabpanel"` on content
- [ ] RTL support (horizontal connector direction, logical positioning)
- [ ] Export `UiStepper`, `UiStep`, `StepperOrientation` from `@follow-up/ui`
- [ ] Add to showcase page with basic, linear, vertical, and completed-steps demos
