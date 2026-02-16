# 22 — Accordion Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A collapsible content panel system for organizing information into expandable sections. Consists of an `UiAccordion` container and `UiAccordionItem` children. Supports single-expand mode (only one item open at a time) or multi-expand mode. Each item has a header/trigger and a collapsible content body with smooth height animation.

## API Design

### `UiAccordion` (component, selector: `ui-accordion`)

**Inputs:**
- `multi: boolean` — allow multiple items open simultaneously (default: `false`)

**Behavior:**
- Container that coordinates child items
- In single mode, opening one item closes the others
- `class="flex flex-col"` layout

### `UiAccordionItem` (component, selector: `ui-accordion-item`)

**Inputs:**
- `expanded: boolean` — whether the item is open (two-way via `model()`, default: `false`)
- `disabled: boolean` — prevents toggling (default: `false`)

**Outputs:**
- `expandedChange` — emitted when expanded state changes (implicit from model)

**Behavior:**
- Header/trigger area with chevron icon that rotates on expand
- Content body with animated height (CSS `grid-template-rows` trick for smooth expand/collapse)
- Clickable header toggles expanded state
- Keyboard: Enter/Space to toggle
- Border between items

## Visual Layout

```
┌──────────────────────────────────┐
│ Section 1                      ▾ │  ← header (chevron rotates)
├──────────────────────────────────┤
│ Content for section 1...         │  ← collapsible body
│                                  │
├──────────────────────────────────┤
│ Section 2                      ▸ │  ← collapsed
├──────────────────────────────────┤
│ Section 3                      ▸ │  ← collapsed
└──────────────────────────────────┘
```

## Deliverables

- [ ] `UiAccordion` component in `libs/ui/src/lib/accordion/accordion.ts`
- [ ] `UiAccordionItem` component with `expanded` model and `disabled` input
- [ ] Single-expand mode (default) and multi-expand mode
- [ ] Smooth expand/collapse animation (CSS grid-rows or max-height transition)
- [ ] Chevron icon that rotates on expand
- [ ] Keyboard accessible: Enter/Space to toggle, focus management
- [ ] `aria-expanded` on trigger, `role="region"` on content, `aria-controls`/`aria-labelledby` linking
- [ ] RTL support (chevron uses logical positioning)
- [ ] Export `UiAccordion`, `UiAccordionItem` from `@follow-up/ui`
- [ ] Add to showcase page with single-expand, multi-expand, disabled item, and nested content demos
