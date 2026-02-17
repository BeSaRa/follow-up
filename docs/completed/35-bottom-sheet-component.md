# 35 — Bottom Sheet Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-17 |
| Completed | 2026-02-17 |

---

## Description

A bottom sheet component that slides up from the bottom of the viewport. Used for contextual actions, confirmations, or supplementary content — especially on mobile-friendly layouts. Supports multiple snap points (peek, half, full), swipe-to-dismiss gesture, backdrop, and focus trapping. Rendered via CDK Overlay/portal.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiBottomSheet` | `ui-bottom-sheet` | Component | The sheet panel — slides up from viewport bottom |
| `UiBottomSheetHeader` | `ui-bottom-sheet-header` | Component | Optional header with drag handle indicator and title |
| `UiBottomSheetContent` | `ui-bottom-sheet-content` | Component | Scrollable content area |
| `UiBottomSheetClose` | `[uiBottomSheetClose]` | Directive | Placed on any element inside the sheet to close it |
| `BottomSheetService` | — | Service | Imperative API to open/close bottom sheets |

### Inputs & Outputs

**UiBottomSheet**
- `open: ModelSignal<boolean>` — two-way binding to control visibility
- `snapPoints: InputSignal<BottomSheetSnapPoint[]>` — height stops (default `['half', 'full']`)
- `initialSnap: InputSignal<BottomSheetSnapPoint>` — starting snap point (default `'half'`)
- `swipeToDismiss: InputSignal<boolean>` — enable swipe-down gesture to close (default `true`)
- `hasBackdrop: InputSignal<boolean>` — show backdrop (default `true`)
- `closeOnBackdropClick: InputSignal<boolean>` — close when backdrop is clicked (default `true`)
- `opened: OutputEmitterRef<void>` — emits after sheet opens
- `closed: OutputEmitterRef<void>` — emits after sheet closes
- `snapChanged: OutputEmitterRef<BottomSheetSnapPoint>` — emits when snap point changes

**BottomSheetService**
- `open<T>(component: ComponentType<T>, config?: BottomSheetConfig): BottomSheetRef<T>` — open a bottom sheet with a component
- `open(templateRef: TemplateRef<any>, config?: BottomSheetConfig): BottomSheetRef<void>` — open with a template

### Types

```ts
type BottomSheetSnapPoint = 'peek' | 'half' | 'full'

interface BottomSheetConfig {
  snapPoints?: BottomSheetSnapPoint[]
  initialSnap?: BottomSheetSnapPoint
  swipeToDismiss?: boolean
  hasBackdrop?: boolean
  data?: unknown
}

class BottomSheetRef<T> {
  close(result?: unknown): void
  afterClosed(): Observable<unknown>
  snap(point: BottomSheetSnapPoint): void
}
```

### Snap Point Heights

| Snap Point | Height |
|---|---|
| `peek` | 25vh |
| `half` | 50vh |
| `full` | calc(100vh - 2rem) |

### Usage Examples

```html
<!-- Template-driven bottom sheet -->
<button uiButton (click)="sheetOpen.set(true)">Open Sheet</button>

<ui-bottom-sheet [(open)]="sheetOpen" [snapPoints]="['peek', 'half', 'full']">
  <ui-bottom-sheet-header>
    <h3>Actions</h3>
  </ui-bottom-sheet-header>
  <ui-bottom-sheet-content>
    <button uiButton variant="ghost" class="w-full justify-start" uiBottomSheetClose>
      Share
    </button>
    <button uiButton variant="ghost" class="w-full justify-start" uiBottomSheetClose>
      Copy Link
    </button>
    <button uiButton variant="ghost" class="w-full justify-start text-error" uiBottomSheetClose>
      Delete
    </button>
  </ui-bottom-sheet-content>
</ui-bottom-sheet>
```

```ts
// Imperative via service
const ref = this.bottomSheet.open(ShareSheetComponent, {
  snapPoints: ['half', 'full'],
  data: { itemId: 42 },
})

ref.afterClosed().subscribe(result => {
  console.log('Sheet closed with:', result)
})
```

## Behavior

### Opening / Closing

| Trigger | Action |
|---|---|
| Set `open` to `true` or call `service.open()` | Slide sheet up to `initialSnap` position |
| Set `open` to `false` or click `[uiBottomSheetClose]` | Slide sheet down and close |
| Click backdrop | Close sheet (if `closeOnBackdropClick` is true) |
| Escape key | Close sheet |
| Swipe down past threshold | Close sheet (if `swipeToDismiss` is true) |

### Snapping

- Dragging the header (or swiping the sheet) moves between snap points
- On release, the sheet snaps to the nearest snap point
- If dragged below the lowest snap point by > 30%, it dismisses

### Focus Management

- When opened, focus moves to the first focusable element inside the sheet
- Focus is trapped inside the sheet via `cdkTrapFocus`
- When closed, focus returns to the previously focused element

## Accessibility

- Sheet panel: `role="dialog"`, `aria-modal="true"`, `aria-label` or `aria-labelledby`
- Drag handle: `role="slider"`, `aria-label="Resize sheet"`, `aria-valuetext` (current snap)
- Focus trap via `cdkTrapFocus`
- Focus restoration on close
- Backdrop: `aria-hidden="true"`

## Styling

- Sheet panel: `fixed bottom-0 inset-x-0 rounded-t-xl bg-surface-raised border-t border-border shadow-2xl`
- Drag handle indicator: `w-10 h-1 rounded-full bg-border mx-auto my-2`
- Backdrop: `fixed inset-0 bg-black/50`
- Content: `overflow-y-auto px-4 pb-4`
- Transition: `transform 200ms ease-out` (snap animation)

## File Structure

```
libs/ui/src/lib/bottom-sheet/
  bottom-sheet.ts        # UiBottomSheet, UiBottomSheetHeader, UiBottomSheetContent, UiBottomSheetClose, BottomSheetService, BottomSheetRef
  bottom-sheet.spec.ts   # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [x] Create `UiBottomSheet` component with snap points and slide animation
- [x] Create `UiBottomSheetHeader`, `UiBottomSheetContent` sub-components
- [x] Create `UiBottomSheetClose` directive
- [x] Create `BottomSheetService` for imperative open/close with `BottomSheetRef`
- [x] Implement snap-point system (`peek`, `half`, `full`) with drag behavior
- [x] Implement swipe-to-dismiss gesture
- [x] Implement backdrop with close-on-click
- [x] Add focus trap and focus restoration
- [x] Add ARIA attributes (`role="dialog"`, `aria-modal`, drag handle `role="slider"`)
- [x] Write unit tests
- [x] Export all public APIs from `libs/ui/src/index.ts`
- [x] Add bottom sheet demo section to the showcase app
