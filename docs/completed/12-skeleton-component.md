# 12 — Skeleton Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A loading placeholder component that displays animated shimmer shapes to indicate content is being loaded. Supports common shapes (line, circle, rectangle) and can be composed to build skeleton screens for cards, tables, profiles, etc.

## API Design

### `UiSkeleton` (component, selector: `ui-skeleton`)

**Inputs:**
- `variant: 'line' | 'circle' | 'rect'` — shape of the skeleton (default: `'line'`)
- `width: string` — CSS width (default: `'100%'`). Ignored when variant is `'circle'`.
- `height: string` — CSS height (default: `'1rem'` for line, matches width for circle, `'8rem'` for rect)

**Host styling:**
- Renders as a `block` element with `rounded` corners (full rounding for circle)
- Animated shimmer/pulse effect via Tailwind `animate-pulse`
- Uses `bg-surface-hover` as the placeholder color (works in both light/dark mode)

## Visual Examples

```
Line:    [████████████████████████████]   (full-width bar, 1rem tall)
Circle:  (●)                              (square aspect, fully rounded)
Rect:    [██████████████████]             (block area, e.g. image placeholder)
         [██████████████████]
```

## Deliverables

- [x]`UiSkeleton` component in `libs/ui/src/lib/skeleton/skeleton.ts`
- [x]Inputs: `variant`, `width`, `height`
- [x]Variants: `line` (default), `circle`, `rect`
- [x]Animated pulse effect
- [x]Export from `@follow-up/ui`
- [x]Add to showcase page with standalone shapes and composed skeleton screens (card skeleton, table row skeleton, profile skeleton)
