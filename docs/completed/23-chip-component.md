# 23 — Chip Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

An interactive tag/chip component for displaying selected items, filters, or categories. Unlike badges (which are purely visual), chips are interactive — they can be removed, selected, or clicked. Supports a remove button, selected state, disabled state, and color variants.

## Deliverables

- [x] `UiChip` component in `libs/ui/src/lib/chip/chip.ts`
- [x] Color variants (`primary`, `secondary`, `accent`, `outline`)
- [x] Size variants (`sm`, `md`)
- [x] Removable mode with × button and `removed` output
- [x] Selectable mode with `selected` two-way model
- [x] Disabled state
- [x] Keyboard: Enter/Space to select, Delete/Backspace to remove
- [x] RTL support (logical positioning for remove button)
- [x] Export `UiChip`, `ChipVariant`, `ChipSize` from `@follow-up/ui`
- [x] Add to showcase page with variants, removable, selectable, disabled, and chip list demos
