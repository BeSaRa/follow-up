# 31 — Sidebar / Drawer Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A sliding panel (drawer) that emerges from the edge of the viewport. Commonly used for side navigation, filters, or detail panels. Supports left and right placement, push or overlay modes, backdrop, and keyboard dismissal. Uses CDK Overlay for the backdrop and portal rendering.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiDrawer` | `ui-drawer` | Component | The sliding panel — projects consumer content |
| `UiDrawerHeader` | `ui-drawer-header` | Component | Optional header section with title and close button |
| `UiDrawerContent` | `ui-drawer-content` | Component | Scrollable body area |
| `UiDrawerFooter` | `ui-drawer-footer` | Component | Optional sticky footer for actions |
| `UiDrawerClose` | `[uiDrawerClose]` | Directive | Placed on any element to close the drawer on click |

### Inputs & Outputs

**UiDrawer**
- `open: ModelSignal<boolean>` — two-way binding to control open/close state
- `position: InputSignal<DrawerPosition>` — which edge the drawer slides from (`'start'` default)
- `mode: InputSignal<DrawerMode>` — `'overlay'` (default) or `'push'`
- `hasBackdrop: InputSignal<boolean>` — show a backdrop when open (default `true`, only in overlay mode)
- `closeOnBackdropClick: InputSignal<boolean>` — close when backdrop is clicked (default `true`)
- `closeOnEscape: InputSignal<boolean>` — close on Escape key (default `true`)
- `opened: OutputEmitterRef<void>` — emits after open animation completes
- `closed: OutputEmitterRef<void>` — emits after close animation completes

### Types

```ts
type DrawerPosition = 'start' | 'end'
type DrawerMode = 'overlay' | 'push'
```

### Usage Examples

```html
<!-- Basic side navigation drawer -->
<button uiButton (click)="drawerOpen.set(true)">Open Menu</button>

<ui-drawer [(open)]="drawerOpen">
  <ui-drawer-header>
    <h3>Navigation</h3>
  </ui-drawer-header>
  <ui-drawer-content>
    <nav>
      <a href="/home">Home</a>
      <a href="/settings">Settings</a>
    </nav>
  </ui-drawer-content>
</ui-drawer>

<!-- Right-side detail panel -->
<ui-drawer [(open)]="detailOpen" position="end">
  <ui-drawer-header>
    <h3>Item Details</h3>
  </ui-drawer-header>
  <ui-drawer-content>
    <p>Detail content here...</p>
  </ui-drawer-content>
  <ui-drawer-footer>
    <button uiButton variant="primary">Save</button>
    <button uiButton variant="ghost" uiDrawerClose>Cancel</button>
  </ui-drawer-footer>
</ui-drawer>
```

## Behavior

### Opening / Closing

| Trigger | Action |
|---|---|
| Set `open` to `true` | Slide panel in from edge |
| Set `open` to `false` | Slide panel out |
| Click backdrop | Close drawer (if `closeOnBackdropClick` is true) |
| Escape key | Close drawer (if `closeOnEscape` is true) |
| Click `[uiDrawerClose]` | Close drawer |

### Focus Management

- When opened, focus moves to the first focusable element inside the drawer (or the drawer itself)
- Focus is trapped inside the drawer while open (overlay mode only)
- When closed, focus returns to the element that was focused before opening

### Animation

- Slide in/out from the chosen edge via CSS `transform: translateX()`
- Backdrop fades in/out
- Duration: 200ms ease-out (open), 150ms ease-in (close)

## Accessibility

- Drawer panel: `role="dialog"`, `aria-modal="true"` (overlay mode), `aria-label` or `aria-labelledby`
- Focus trap via `cdkTrapFocus` (overlay mode)
- Focus restoration on close
- Backdrop: `aria-hidden="true"`

## Styling

- Panel: `fixed top-0 bottom-0 w-80 bg-surface-raised border-e border-border shadow-lg` (start position)
- Backdrop: `fixed inset-0 bg-black/50`
- Header: `flex items-center justify-between px-4 py-3 border-b border-border`
- Content: `flex-1 overflow-y-auto px-4 py-3`
- Footer: `px-4 py-3 border-t border-border`

## File Structure

```
libs/ui/src/lib/drawer/
  drawer.ts            # UiDrawer, UiDrawerHeader, UiDrawerContent, UiDrawerFooter, UiDrawerClose
  drawer.spec.ts       # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [x]Create `UiDrawer` component with slide animation and backdrop
- [x]Create `UiDrawerHeader`, `UiDrawerContent`, `UiDrawerFooter` sub-components
- [x]Create `UiDrawerClose` directive
- [x]Support `start` and `end` positions with RTL-aware sliding
- [x]Support `overlay` and `push` modes
- [x]Implement focus trap (overlay mode) and focus restoration
- [x]Implement close on Escape and backdrop click
- [x]Add open/close CSS animations (slide + backdrop fade)
- [x]Add ARIA attributes (`role="dialog"`, `aria-modal`, `aria-label`)
- [x]Write unit tests
- [x]Export all public APIs from `libs/ui/src/index.ts`
- [x]Add drawer demo section to the showcase app
