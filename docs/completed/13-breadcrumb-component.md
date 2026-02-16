# 13 — Breadcrumb Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A navigation breadcrumb component that shows the user's current location within a hierarchy. Built with semantic `<nav>` and `<ol>` elements for accessibility. Supports links, a current page indicator, and a customizable separator.

## API Design

### `UiBreadcrumb` (component, selector: `ui-breadcrumb`)

Wrapper `<nav>` with `aria-label="Breadcrumb"`. Projects breadcrumb items inside an `<ol>`.

### `UiBreadcrumbItem` (component, selector: `ui-breadcrumb-item`)

A single breadcrumb entry rendered as an `<li>`. Displays the separator before each item (except the first).

**Inputs:**
- `active: boolean` — marks the current/last item (default: `false`). Sets `aria-current="page"` and applies muted styling.

### `UiBreadcrumbSeparator` (directive, selector: `[uiBreadcrumbSeparator]`)

Optional directive to customize the separator character. Applied to an element inside `UiBreadcrumb` that replaces the default `/` separator.

## Visual Layout

```
Home  /  Products  /  Electronics  /  Laptops
 ↑         ↑             ↑            ↑
link      link          link       active (no link, muted)
```

## Deliverables

- [x]`UiBreadcrumb` component in `libs/ui/src/lib/breadcrumb/breadcrumb.ts`
- [x]`UiBreadcrumbItem` component with `active` input
- [x]`UiBreadcrumbSeparator` directive for custom separators
- [x]Default `/` separator between items
- [x]`aria-label="Breadcrumb"` on nav, `aria-current="page"` on active item
- [x]Export from `@follow-up/ui`
- [x]Add to showcase page with basic, custom separator, and inside-card demos
