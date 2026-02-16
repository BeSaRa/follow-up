# 16 — Checkbox Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

Create a `UiCheckbox` component for the UI library. The checkbox is a fundamental form control that allows users to toggle a boolean value or select multiple options from a set. It follows the same patterns established by `UiSlideToggle` — single-file component, signal-based inputs, `ControlValueAccessor` integration, and Tailwind CSS styling.

## API

### Selector

`ui-checkbox`

### Inputs

| Input           | Type                     | Default   | Description                          |
|-----------------|--------------------------|-----------|--------------------------------------|
| `checked`       | `model<boolean>`         | `false`   | Two-way binding for checked state    |
| `indeterminate` | `model<boolean>`         | `false`   | Indeterminate (partial) state        |
| `disabled`      | `input<boolean>`         | `false`   | Disables the checkbox                |
| `size`          | `input<CheckboxSize>`    | `'md'`    | Size variant: `'sm'` or `'md'`       |
| `labelPosition` | `input<CheckboxLabelPosition>` | `'after'` | Label placement: `'before'` or `'after'` |

### Exported Types

- `CheckboxSize = 'sm' | 'md'`
- `CheckboxLabelPosition = 'before' | 'after'`

### Content Projection

Label text is projected via `<ng-content>`.

```html
<ui-checkbox [(checked)]="agreed">I agree to the terms</ui-checkbox>
```

## Behavior

- **Click / Space / Enter** toggles the checked state (unless disabled).
- When toggled while `indeterminate` is `true`, the checkbox becomes determinate (`indeterminate` resets to `false`) and `checked` toggles normally.
- Implements `ControlValueAccessor` for Reactive Forms integration.
- `writeValue` sets `checked` and resets `indeterminate` to `false`.

## Accessibility

- Uses a native-style approach with `role="checkbox"` on the visual box.
- `aria-checked` reflects `'true'`, `'false'`, or `'mixed'` (for indeterminate).
- `aria-disabled` set when disabled.
- `tabindex="0"` on the checkbox element for keyboard focus.
- Focus ring via `focus-visible:ring-2 focus-visible:ring-ring`.

## Visual Design (Tailwind)

- **Unchecked:** Bordered box (`border-2 border-border rounded`), transparent background.
- **Checked:** Primary background (`bg-primary`), white checkmark icon (inline SVG).
- **Indeterminate:** Primary background (`bg-primary`), white dash/minus icon (inline SVG).
- **Disabled:** `opacity-50`, `pointer-events-none`.
- **Sizes:**
  - `sm` — `size-4` box, smaller checkmark.
  - `md` — `size-5` box, standard checkmark.

## File Structure

```
libs/ui/src/lib/checkbox/checkbox.ts
```

Single-file component following the project convention (inline template, no separate spec/style files).

## Deliverables

- [x] Create `libs/ui/src/lib/checkbox/checkbox.ts` with `UiCheckbox` component
- [x] Implement `ControlValueAccessor` for Reactive Forms support
- [x] Support indeterminate state with `aria-checked="mixed"`
- [x] Add exports to `libs/ui/src/index.ts`
- [x] Verify lint passes (`nx lint ui`)
