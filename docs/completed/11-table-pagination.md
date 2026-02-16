# 11 — Table Pagination

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

Add a standalone pagination component to the UI library that integrates with the existing table component. The paginator displays page navigation controls (first, previous, next, last), a page size selector, and a summary of the current range (e.g. "1–10 of 95"). It is designed to work alongside `UiTable` but is decoupled enough to be used independently with any list-based UI.

## API Design

### `UiPagination` (component, selector: `ui-pagination`)

**Inputs:**
- `totalItems: number` — total number of items in the dataset
- `pageSize: number` — current number of items per page (default: `10`)
- `pageIndex: number` — current zero-based page index (default: `0`)
- `pageSizeOptions: number[]` — options for the page-size dropdown (default: `[5, 10, 25, 50]`)
- `showFirstLastButtons: boolean` — show first/last page buttons (default: `true`)
- `showPageSizeSelector: boolean` — show the page-size dropdown (default: `true`)

**Outputs:**
- `pageChange: { pageIndex: number, pageSize: number }` — emitted when page index or page size changes

### Computed state (internal)
- `totalPages` — derived from `totalItems` and `pageSize`
- `rangeStart` / `rangeEnd` — 1-based range labels for the summary text
- `isFirstPage` / `isLastPage` — disable first/prev and next/last buttons

## Visual Layout

```
Rows per page: [10 ▾]    1–10 of 95    [«] [‹] [›] [»]
```

- Left: page-size selector (optional)
- Center: range summary
- Right: navigation buttons with SVG icons

## Deliverables

- [x]`UiPagination` component in `libs/ui/src/lib/pagination/pagination.ts`
- [x]Inputs: `totalItems`, `pageSize`, `pageIndex`, `pageSizeOptions`, `showFirstLastButtons`, `showPageSizeSelector`
- [x]Output: `pageChange` emitting `{ pageIndex, pageSize }`
- [x]Page-size dropdown using native `<select>` (keeps it simple, accessible)
- [x]First / Previous / Next / Last navigation buttons with SVG chevron icons
- [x]Range summary text (e.g. "1–10 of 95")
- [x]Buttons disabled at boundaries (first/last page)
- [x]Reset `pageIndex` to 0 when `pageSize` changes
- [x]Keyboard accessible (all controls focusable, operable with Enter/Space)
- [x]Export from `@follow-up/ui` barrel
- [x]Add pagination demo to the showcase page below the existing table demos
