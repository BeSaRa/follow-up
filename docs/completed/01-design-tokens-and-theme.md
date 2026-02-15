# 01 — Design Tokens & Theme System

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-15 |
| Started   | 2026-02-15 |
| Completed | 2026-02-15 |

---

## Description

Set up the design token system using CSS custom properties with light/dark mode support.
Dark mode is toggled via `.dark` class on `<html>` — no `dark:` prefix needed in components.

## Deliverables

- [x] Define color palette (brand, semantic, surfaces, borders, text, misc)
- [x] Light mode tokens in `:root`
- [x] Dark mode tokens in `.dark`
- [x] Tailwind `@theme` mapping (CSS vars → utility classes)
- [x] Extract theme into `theme.css`, imported from `styles.css`
- [x] Base body styles with transition
