# 29 — Popover Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A Popover component for displaying rich interactive content in a floating panel anchored to a trigger element. Unlike tooltips (plain text, non-interactive, hover-triggered), popovers support arbitrary projected content, are opened on click, and allow user interaction inside the panel.

Uses CDK Overlay with `CdkConnectedOverlay` (template-based approach, consistent with dropdown and menu).

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiPopover` | `ui-popover` | Component | The floating panel — wraps projected content in a CDK overlay |
| `UiPopoverTrigger` | `[uiPopoverTrigger]` | Directive | Attaches to any element to toggle the popover on click |
| `UiPopoverClose` | `[uiPopoverClose]` | Directive | Optional — placed on any element inside the popover to close it on click |

### Inputs & Outputs

**UiPopover**
- `position: InputSignal<PopoverPosition>` — preferred position (`'below-start'` default)
- `opened: OutputEmitterRef<void>` — emits when popover opens
- `closed: OutputEmitterRef<void>` — emits when popover closes

**UiPopoverTrigger**
- `uiPopoverTrigger: InputSignal<UiPopover>` (required) — reference to the popover to toggle

**UiPopoverClose**
- No inputs — just closes the nearest ancestor `UiPopover` on click

### Types

```ts
type PopoverPosition =
  | 'above'
  | 'above-start'
  | 'above-end'
  | 'below'
  | 'below-start'
  | 'below-end'
  | 'start'
  | 'end'
```

### Usage Examples

```html
<!-- Basic popover -->
<button uiButton [uiPopoverTrigger]="infoPopover">Info</button>

<ui-popover #infoPopover>
  <div class="p-4 space-y-2">
    <h4 class="text-sm font-semibold">Details</h4>
    <p class="text-sm text-foreground-muted">
      This is a popover with rich content.
    </p>
  </div>
</ui-popover>

<!-- With close button -->
<button uiButton [uiPopoverTrigger]="confirmPopover">Delete</button>

<ui-popover #confirmPopover position="below-end">
  <div class="p-4 space-y-3">
    <p class="text-sm">Are you sure?</p>
    <div class="flex gap-2 justify-end">
      <button uiButton variant="ghost" size="sm" uiPopoverClose>Cancel</button>
      <button uiButton variant="destructive" size="sm" uiPopoverClose>Delete</button>
    </div>
  </div>
</ui-popover>

<!-- With form content -->
<button uiButton variant="outline" [uiPopoverTrigger]="editPopover">Edit Name</button>

<ui-popover #editPopover position="below-start">
  <div class="p-4 space-y-3">
    <ui-form-field>
      <label uiLabel for="popover-name">Name</label>
      <input uiInput id="popover-name" placeholder="Enter name" />
    </ui-form-field>
    <button uiButton variant="primary" size="sm" uiPopoverClose>Save</button>
  </div>
</ui-popover>
```

## Behavior

### Opening / Closing

| Trigger | Action |
|---|---|
| Click on `[uiPopoverTrigger]` | Toggle popover |
| Click on `[uiPopoverClose]` inside popover | Close popover |
| Click outside the popover | Close popover |
| Escape key | Close popover, restore focus to trigger |
| Tab out of popover | Close popover |
| Scroll (when content not scrollable) | Close popover (CDK scroll strategy) |

### Focus Management

- When opened, focus moves to the first focusable element inside the popover (if any)
- When closed via Escape, focus returns to the trigger element
- Focus is not trapped — Tab navigates out and closes the popover

### Overlay Positioning

- 8 named positions with automatic fallback repositioning
- 4px offset from trigger element
- Uses `CdkConnectedOverlay` with `flexibleConnectedTo`

## Accessibility

- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (pointing to popover id)
- Popover panel: `role="dialog"`, unique `id`
- Focus moves into the popover on open
- Focus returns to trigger on Escape

## Styling

- Panel: `rounded-md border border-border bg-surface-raised shadow-md` (matches dropdown/menu)
- No padding on the panel itself — consumers control padding via projected content
- Entry animation: subtle scale + fade (like tooltip)

## File Structure

```
libs/ui/src/lib/popover/
  popover.ts            # UiPopover, UiPopoverTrigger, UiPopoverClose
  popover.spec.ts       # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Create `UiPopover` component with CDK Overlay positioning and 8-position support
- [ ] Create `UiPopoverTrigger` directive for click-based toggle
- [ ] Create `UiPopoverClose` directive for closing from within the popover
- [ ] Implement focus management (move to content on open, restore on close)
- [ ] Implement close on outside click, Escape, and Tab-out
- [ ] Add entry animation (scale + fade)
- [ ] Add ARIA attributes (`role="dialog"`, `aria-haspopup`, `aria-expanded`, `aria-controls`)
- [ ] Add `opened` and `closed` outputs
- [ ] Write unit tests
- [ ] Export all public APIs from `libs/ui/src/index.ts`
- [ ] Add popover demo section to the showcase app (`app.ts` / `app.html`)
