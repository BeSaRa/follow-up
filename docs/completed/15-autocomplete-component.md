# 15 — Autocomplete Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A self-contained dropdown component with an editable text input for filtering suggestions. As the user types, matching options are displayed in an overlay panel below the trigger. Styled identically to the `UiSelect` component — same bordered trigger container, chevron icon, size variants, and dropdown panel. Supports keyboard navigation, custom display functions, option templates, and form integration via `ControlValueAccessor`. Uses CDK Overlay for positioning.

## API Design

### `UiAutocomplete` (component, selector: `ui-autocomplete`)

Self-contained component with a built-in trigger (input + chevron icon) and dropdown panel. Implements `ControlValueAccessor` for form integration.

**Inputs:**
- `displayWith: (value: T) => string` — function to transform the selected value into the display string shown in the input (default: identity/toString)
- `placeholder: string` — placeholder text for the input (default: `'Search...'`)
- `disabled: boolean` — disables the component (default: `false`)
- `size: 'sm' | 'md'` — trigger height variant (default: `'md'`)

**Two-way:**
- `value` — the selected value (via `model()`)

**Outputs:**
- `searchChange: string` — emits the current input text on each keystroke, for consumer-side filtering

**Behavior:**
- Opens the panel on input focus or typing
- Closes the panel on outside click, Escape, Tab, or when an option is selected
- Filtering is driven by the consumer — the component emits `searchChange`, the consumer filters the projected options
- Trigger styled identically to `UiSelect` trigger: bordered container with input + chevron icon, `focus-within` ring, size variants

### `UiAutocompleteOption` (component, selector: `ui-autocomplete-option`)

A single option inside the autocomplete panel.

**Inputs:**
- `value: T` — the value associated with this option
- `disabled: boolean` — disables the option (default: `false`)

**Behavior:**
- Highlighted on keyboard navigation or mouse hover (`isActive` signal)
- Shows `font-medium` when selected (`isSelected` signal)
- Emits selection on click or Enter

## Visual Layout

```
[ Search users...        ⌄ ]    ← styled trigger (matches UiSelect)
┌──────────────────────────┐
│  Alice Johnson           │
│  ▸ Bob Smith             │  ← highlighted
│  Charlie Brown           │
└──────────────────────────┘
```

## Deliverables

- [x] `UiAutocomplete` self-contained component in `libs/ui/src/lib/autocomplete/autocomplete.ts`
- [x] `UiAutocompleteOption` component with `value`, `disabled`, `isActive`, `isSelected`, and `getLabel()`
- [x] Built-in trigger with editable input + chevron icon (matching `UiSelect` styling)
- [x] `size` input for trigger height variants (`'sm' | 'md'`)
- [x] `placeholder` and `disabled` inputs
- [x] `searchChange` output for consumer-side filtering
- [x] CDK Overlay for panel positioning (below trigger, matching trigger width)
- [x] `ControlValueAccessor` on the component for reactive and template-driven forms
- [x] `displayWith` input for custom value-to-string transformation
- [x] Keyboard navigation: ArrowUp/ArrowDown to navigate, Enter to select, Escape to close
- [x] `role="combobox"` on input, `role="listbox"` on panel, `role="option"` on options, `aria-activedescendant`
- [x] Close on outside click, Escape, and Tab
- [x] Export from `@follow-up/ui` (removed `UiAutocompleteTrigger`, added `AutocompleteSize` type)
- [x] Showcase page updated with self-contained usage (basic string list, object list with displayWith)
