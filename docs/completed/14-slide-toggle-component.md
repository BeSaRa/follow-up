# 14 — Slide Toggle Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A toggle switch component that allows users to turn an option on or off. Works as a form control compatible with both reactive and template-driven forms via `ControlValueAccessor`. Supports labels, disabled state, and size variants.

## API Design

### `UiSlideToggle` (component, selector: `ui-slide-toggle`)

**Inputs:**
- `checked: boolean` — current toggle state (default: `false`)
- `disabled: boolean` — disables the toggle (default: `false`)
- `size: 'sm' | 'md'` — size variant (default: `'md'`)
- `labelPosition: 'before' | 'after'` — position of the projected label relative to the toggle (default: `'after'`)

**Outputs:**
- `checkedChange: boolean` — emitted when the toggle state changes

**Form integration:**
- Implements `ControlValueAccessor` for `ngModel` and `formControl` / `formControlName` binding

### Visual Layout

```
[  ○———]  Enable notifications       (unchecked, label after)
[———●  ]  Enable notifications       (checked, label after)
Enable notifications  [———●  ]       (checked, label before)
```

- Track: rounded pill, transitions between `bg-border` (off) and `bg-primary` (on)
- Thumb: white circle that slides left/right with a smooth transition

## Deliverables

- [x]`UiSlideToggle` component in `libs/ui/src/lib/slide-toggle/slide-toggle.ts`
- [x]Inputs: `checked`, `disabled`, `size`, `labelPosition`
- [x]Output: `checkedChange` with two-way binding support
- [x]`ControlValueAccessor` implementation for reactive and template-driven forms
- [x]Keyboard accessible (toggle with Space/Enter, focusable)
- [x]`role="switch"` with `aria-checked` attribute
- [x]Smooth thumb slide transition
- [x]Export from `@follow-up/ui`
- [x]Add to showcase page with basic, sizes, disabled, label positions, and reactive form demos
