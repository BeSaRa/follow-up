# 09 — Table Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-15 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

Styled data table for displaying tabular data. Uses native HTML table elements with attribute selectors for proper semantics and accessibility. Supports sorting, striped rows, sticky headers, column resizing, and hover highlighting.

## Deliverables

- [x] `UiTable` directive — attribute on `<table>`, striped + stickyHeader inputs
- [x] `UiTableHeader` directive — attribute on `<thead>`
- [x] `UiTableBody` directive — attribute on `<tbody>`
- [x] `UiTableFooter` directive — attribute on `<tfoot>`
- [x] `UiTableRow` directive — attribute on `<tr>`, hover highlighting
- [x] `UiTableHead` component — attribute on `<th>`, sorting + resizing
- [x] `UiTableCell` directive — attribute on `<td>`
- [x] Sorting — clickable headers with direction indicators and sortChange output
- [x] Striped rows — alternating even-row backgrounds
- [x] Sticky header — fixed header in scrollable container
- [x] Column resizing — draggable resize handles on header cells
- [x] Export from `@follow-up/ui`
- [x] Add to showcase page with sorting, striped, sticky, and resize demos
