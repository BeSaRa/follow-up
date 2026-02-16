# 23 — Chip Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

An interactive tag/chip component for displaying selected items, filters, or categories. Unlike badges (which are purely visual), chips are interactive — they can be removed, selected, or clicked. Supports a remove button, selected state, disabled state, and color variants.

## API Design

### `UiChip` (component, selector: `ui-chip`)

**Inputs:**
- `variant: 'primary' | 'secondary' | 'accent' | 'outline'` — color variant (default: `'secondary'`)
- `size: 'sm' | 'md'` — chip size (default: `'md'`)
- `removable: boolean` — shows remove (×) button (default: `false`)
- `selected: boolean` — selected/active state (two-way via `model()`, default: `false`)
- `disabled: boolean` — disables the chip (default: `false`)

**Outputs:**
- `removed` — emitted when the remove button is clicked

**Behavior:**
- Inline pill shape with label text via content projection
- Optional remove button (× icon) at the end
- Selected state toggles on click (when not disabled)
- Remove button click emits `removed` and stops propagation (doesn't toggle selected)
- Keyboard: Enter/Space to toggle selected, Delete/Backspace to trigger remove
- RTL-aware: remove button uses logical end positioning

## Visual Layout

```
[ Label ]     [ Label  × ]     [ ✓ Label ]     [ Label ]
  basic         removable        selected       disabled (faded)
```

## Deliverables

- [ ] `UiChip` component in `libs/ui/src/lib/chip/chip.ts`
- [ ] Color variants (`primary`, `secondary`, `accent`, `outline`)
- [ ] Size variants (`sm`, `md`)
- [ ] Removable mode with × button and `removed` output
- [ ] Selectable mode with `selected` two-way model
- [ ] Disabled state
- [ ] Keyboard: Enter/Space to select, Delete/Backspace to remove
- [ ] RTL support (logical positioning for remove button)
- [ ] Export `UiChip`, `ChipVariant`, `ChipSize` from `@follow-up/ui`
- [ ] Add to showcase page with variants, removable, selectable, disabled, and chip list demos
