# 22 — Accordion Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A collapsible content panel system for organizing information into expandable sections. Consists of an `UiAccordion` container and `UiAccordionItem` children. Supports single-expand mode (only one item open at a time) or multi-expand mode. Each item has a header/trigger and a collapsible content body with smooth height animation.

## Deliverables

- [x] `UiAccordion` component in `libs/ui/src/lib/accordion/accordion.ts`
- [x] `UiAccordionItem` component with `expanded` model and `disabled` input
- [x] Single-expand mode (default) and multi-expand mode
- [x] Smooth expand/collapse animation (CSS grid-rows transition)
- [x] Chevron icon that rotates on expand
- [x] Keyboard accessible: Enter/Space to toggle, focus management
- [x] `aria-expanded` on trigger, `role="region"` on content, `aria-controls`/`aria-labelledby` linking
- [x] RTL support (chevron uses logical positioning)
- [x] Export `UiAccordion`, `UiAccordionItem` from `@follow-up/ui`
- [x] Add to showcase page with single-expand, multi-expand, disabled item, and nested content demos
