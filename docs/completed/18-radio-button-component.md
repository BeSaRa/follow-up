# 18 — Radio Button Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A radio button group for selecting a single value from a set of options. Consists of two components: `UiRadioGroup` (the container that manages selection state and form integration) and `UiRadioButton` (individual radio options). Follows the same visual patterns as `UiCheckbox` — circular indicator with fill state, label positioning, size variants, and keyboard navigation. The group implements `ControlValueAccessor` for reactive form integration.

## API Design

### `UiRadioGroup` (component, selector: `ui-radio-group`)

Container that manages selection and provides `ControlValueAccessor`.

**Inputs:**
- `value` — the currently selected value (two-way via `model()`)
- `disabled: boolean` — disables all radio buttons in the group (default: `false`)
- `name: string` — group name for accessibility (auto-generated if not provided)
- `orientation: 'horizontal' | 'vertical'` — layout direction (default: `'vertical'`)

**Behavior:**
- Sets `role="radiogroup"` on host
- Tracks which child `UiRadioButton` is selected via value matching
- Implements `ControlValueAccessor` for `[formControl]` and `formControlName`
- Keyboard: ArrowDown/ArrowRight to move to next, ArrowUp/ArrowLeft to move to previous (wraps around)
- RTL-aware: uses logical Tailwind classes

### `UiRadioButton` (component, selector: `ui-radio-button`)

Individual radio option within a group.

**Inputs:**
- `value: T` — the value this option represents (required)
- `disabled: boolean` — disables this specific option (default: `false`)
- `size: 'sm' | 'md'` — radio circle size (default: `'md'`)
- `labelPosition: 'before' | 'after'` — label placement (default: `'after'`)

**Behavior:**
- Renders a circular indicator that fills when selected
- Uses `role="radio"` with `aria-checked`
- Clickable host that selects the radio
- Keyboard: Space/Enter to select
- Inherits `disabled` from parent group (group disabled overrides individual)

## Visual Layout

```
Vertical (default):            Horizontal:
( ) Option A                   ( ) Option A   (●) Option B   ( ) Option C
(●) Option B  ← selected
( ) Option C

Size sm: ○ 16px circle        Size md: ○ 20px circle
```

## Accessibility

- `UiRadioGroup`: `role="radiogroup"`, optional `aria-label`
- `UiRadioButton`: `role="radio"`, `aria-checked`, `aria-disabled`
- Only the selected (or first) radio has `tabindex="0"`, others have `tabindex="-1"` (roving tabindex)
- ArrowUp/ArrowLeft → previous option, ArrowDown/ArrowRight → next option (wraps)
- Space/Enter selects the focused option

## Deliverables

- [x] `UiRadioGroup` component in `libs/ui/src/lib/radio/radio.ts`
- [x] `UiRadioButton` component with `value`, `disabled`, `size`, `labelPosition` inputs
- [x] `ControlValueAccessor` on `UiRadioGroup` for reactive form support
- [x] Two-way `value` binding via `model()`
- [x] `orientation` input for horizontal/vertical layout
- [x] Size variants (`sm`, `md`) matching checkbox sizing
- [x] Label positioning (`before`, `after`)
- [x] Roving tabindex keyboard navigation (Arrow keys wrap around)
- [x] Group-level `disabled` that overrides individual radio buttons
- [x] RTL support (logical CSS properties)
- [x] ARIA: `role="radiogroup"`, `role="radio"`, `aria-checked`, roving `tabindex`
- [x] Export `UiRadioGroup`, `UiRadioButton`, `RadioSize`, `RadioLabelPosition`, `RadioOrientation` from `@follow-up/ui`
- [x] Add to showcase page with basic, horizontal, sizes, disabled, and reactive form demos
