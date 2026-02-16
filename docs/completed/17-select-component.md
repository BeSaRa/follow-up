# 17 — Select Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

Create a `UiSelect` component for the UI library. The select is a form control that lets users pick a single value from a dropdown list of predefined options. It uses CDK Overlay for the dropdown panel (same approach as `UiAutocomplete`) and implements `ControlValueAccessor` for Reactive Forms integration.

Unlike `UiAutocomplete`, the select does not allow free-text input — it is a closed list. The trigger displays the currently selected option's label.

## Components

### `UiSelectOption`

Individual option within the select panel.

**Selector:** `ui-select-option`

| Input      | Type       | Default | Description                    |
|------------|------------|---------|--------------------------------|
| `value`    | `input.required<any>` | —  | The option's value             |
| `disabled` | `input<boolean>` | `false` | Disables this option           |

Content projection provides the display label.

### `UiSelect`

The main select component containing the trigger button and overlay panel.

**Selector:** `ui-select`

| Input         | Type                  | Default      | Description                              |
|---------------|-----------------------|--------------|------------------------------------------|
| `value`       | `model<any>`          | `null`       | Two-way binding for selected value       |
| `disabled`    | `input<boolean>`      | `false`      | Disables the select                      |
| `placeholder` | `input<string>`       | `'Select...'`| Placeholder when nothing is selected     |
| `size`        | `input<SelectSize>`   | `'md'`       | Size variant: `'sm'` or `'md'`           |

### Exported Types

- `SelectSize = 'sm' | 'md'`

## Usage

```html
<ui-select [(value)]="selectedRole" placeholder="Choose a role">
  <ui-select-option value="admin">Admin</ui-select-option>
  <ui-select-option value="editor">Editor</ui-select-option>
  <ui-select-option value="viewer" disabled>Viewer</ui-select-option>
</ui-select>
```

## Behavior

- Clicking the trigger or pressing Space/Enter/ArrowDown opens the dropdown panel.
- ArrowDown/ArrowUp navigates options, Enter selects, Escape/Tab closes.
- Selecting an option updates the `value` model, displays the option's label in the trigger, and closes the panel.
- Clicking outside the panel closes it.
- Implements `ControlValueAccessor` for Reactive Forms.
- `writeValue` finds the matching option and displays its label.

## Accessibility

- Trigger has `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`.
- Panel has `role="listbox"`.
- Options have `role="option"`, `aria-selected`, `aria-disabled`.
- `aria-activedescendant` tracks the focused option.
- `tabindex="0"` on trigger for keyboard focus.
- Focus ring via `focus-visible:ring-2 focus-visible:ring-ring`.

## Visual Design (Tailwind)

- **Trigger:** Styled like `UiInput` — bordered, rounded, with a chevron icon on the right. Displays selected label or placeholder.
- **Panel:** Same styling as Autocomplete panel — `bg-surface-raised`, `border border-border`, `rounded-md`, `shadow-md`, max height with scroll.
- **Options:** Same styling as `UiAutocompleteOption` — hover highlight, active highlight, disabled state.
- **Sizes:**
  - `sm` — `h-8 text-sm px-2`
  - `md` — `h-10 text-sm px-3`

## File Structure

```
libs/ui/src/lib/select/select.ts
```

Single-file component following the project convention (inline template, CDK Overlay for dropdown).

## Deliverables

- [x] Create `libs/ui/src/lib/select/select.ts` with `UiSelect` and `UiSelectOption`
- [x] CDK Overlay for dropdown positioning
- [x] Keyboard navigation (ArrowDown/Up, Enter, Escape, Tab)
- [x] Implement `ControlValueAccessor` for Reactive Forms support
- [x] Add exports to `libs/ui/src/index.ts`
- [x] Add to showcase page with demos (basic, disabled, placeholder, reactive form)
- [x] Verify lint passes (`nx lint ui`)
