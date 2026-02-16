# 24 — Textarea Auto-Resize Directive

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A directive that makes a `<textarea>` automatically grow or shrink in height to fit its content, eliminating the need for manual scrolling. Applied alongside the existing `uiInput` directive. Supports an optional max height to cap growth and show a scrollbar beyond that point.

## API Design

### `UiTextareaAutoResize` (directive, selector: `textarea[uiAutoResize]`)

**Inputs:**
- `uiAutoResizeMaxRows: number` — maximum rows before scrollbar appears (default: unlimited)
- `uiAutoResizeMinRows: number` — minimum rows (default: `2`)

**Behavior:**
- On initialization, input events, and programmatic value changes, recalculates the textarea height
- Sets `overflow: hidden` while below max height, `overflow: auto` when at max
- Height calculation: resets height to `0`, reads `scrollHeight`, sets height
- Listens for `input` event and runs resize
- Supports reactive form value changes via `ngModelChange` / `valueChanges` (or uses `MutationObserver` / `ResizeObserver` as needed)
- Works alongside `uiInput` directive (does not conflict with its styling)

## Usage

```html
<textarea uiInput uiAutoResize placeholder="Type here..."></textarea>
<textarea uiInput uiAutoResize [uiAutoResizeMaxRows]="5" placeholder="Max 5 rows"></textarea>
```

## Deliverables

- [ ] `UiTextareaAutoResize` directive in `libs/ui/src/lib/textarea-auto-resize/textarea-auto-resize.ts`
- [ ] Auto-grow height on input
- [ ] Auto-shrink when content is deleted
- [ ] `uiAutoResizeMinRows` for minimum height
- [ ] `uiAutoResizeMaxRows` for capped height with scrollbar
- [ ] Works with reactive forms (programmatic value changes trigger resize)
- [ ] Compatible with existing `uiInput` directive
- [ ] Export `UiTextareaAutoResize` from `@follow-up/ui`
- [ ] Add to showcase page with basic auto-resize, max rows, and reactive form demos
