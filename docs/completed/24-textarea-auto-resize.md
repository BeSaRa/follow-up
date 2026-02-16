# 24 — Textarea Auto-Resize Directive

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A directive that makes a `<textarea>` automatically grow or shrink in height to fit its content, eliminating the need for manual scrolling. Applied alongside the existing `uiInput` directive. Supports an optional max height to cap growth and show a scrollbar beyond that point.

## Deliverables

- [x] `UiTextareaAutoResize` directive in `libs/ui/src/lib/textarea-auto-resize/textarea-auto-resize.ts`
- [x] Auto-grow height on input
- [x] Auto-shrink when content is deleted
- [x] `uiAutoResizeMinRows` for minimum height
- [x] `uiAutoResizeMaxRows` for capped height with scrollbar
- [x] Works with reactive forms (programmatic value changes trigger resize)
- [x] Compatible with existing `uiInput` directive
- [x] Export `UiTextareaAutoResize` from `@follow-up/ui`
- [x] Add to showcase page with basic auto-resize, max rows, and reactive form demos
