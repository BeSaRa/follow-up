# 08 — Dropdown Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-15 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

Dropdown menu triggered by a button. Reusable for context menus, select alternatives, and action menus. Trigger is decoupled from the menu — can be placed anywhere. Uses CDK Overlay for viewport-aware positioning with configurable placement and auto-flipping.

## Deliverables

- [x] `UiDropdownTrigger` directive (attribute selector)
- [x] `UiDropdownMenu` panel component (CDK Overlay)
- [x] `UiDropdownItem` item component
- [x] Keyboard navigation (arrow keys, Enter, Escape)
- [x] Click outside to close
- [x] Configurable position with auto-flip (`below-start`, `below-end`, `below`, `above-start`, `above-end`, `above`)
- [x] Export from `@follow-up/ui`
- [x] Add to showcase page
