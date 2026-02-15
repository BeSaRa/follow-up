# 07 — Dialog Service

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-15 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

DialogService wrapping Angular Material Dialog for confirmations, alerts, and custom dialogs. Provides convenience methods for common dialog variants.

## Deliverables

- [x] `DialogService` with `open`, `confirm`, `error`, `success`, `info`, `warning` methods
- [x] `DialogServiceContract` interface
- [x] `DialogComponent` for variant dialogs (error, success, info, warning) with icons and default titles
- [x] `ConfirmDialogComponent` with optional custom accept/reject button text
- [x] Backdrop click to close (via Material Dialog)
- [x] Escape key to close (via Material Dialog)
- [x] Focus trap for accessibility (via Material Dialog)
- [x] Export from `@follow-up/ui`
- [x] Add to showcase page
