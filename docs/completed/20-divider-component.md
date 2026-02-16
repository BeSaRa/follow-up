# 20 — Divider Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A simple separator line component for visually dividing content sections. Supports horizontal and vertical orientations, optional inset (indented start), and an optional text label centered on the line. Renders a semantic `<hr>` equivalent with proper ARIA.

## API Design

### `UiDivider` (component, selector: `ui-divider`)

**Inputs:**
- `orientation: 'horizontal' | 'vertical'` — line direction (default: `'horizontal'`)
- `inset: boolean` — indents the start edge by 1rem (default: `false`)

**Behavior:**
- Horizontal: full-width `border-top` line with optional text label via content projection
- Vertical: full-height `border-start` line, inline layout
- When text content is projected, the line splits around the label (flexbox with `::before`/`::after` pseudo lines or child divs)
- `role="separator"` with `aria-orientation`
- RTL-aware: inset uses `ms-4` (margin-inline-start)

## Visual Layout

```
Horizontal:          Horizontal with label:       Vertical:
─────────────        ────── Label ──────          │
                                                  │
Inset:                                            │
    ─────────
```

## Deliverables

- [x] `UiDivider` component in `libs/ui/src/lib/divider/divider.ts`
- [x] Horizontal and vertical orientations
- [x] Optional text label (content projection) with split-line styling
- [x] Inset variant (indented start edge)
- [x] `role="separator"` with `aria-orientation`
- [x] RTL support (logical properties for inset)
- [x] Export `UiDivider`, `DividerOrientation` from `@follow-up/ui`
- [x] Add to showcase page with horizontal, vertical, labeled, and inset demos
