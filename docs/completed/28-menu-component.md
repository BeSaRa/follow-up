# 28 — Multi-Level Menu Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | 2026-02-16 |
| Completed | 2026-02-16 |

---

## Description

A multi-level menu component that supports nested submenus with keyboard navigation, accessibility, and CDK Overlay positioning. The menu reuses the existing dropdown panel style and follows the same composite-component pattern used by `UiDropdownMenu`.

Unlike the existing dropdown (which is a single-level menu), this component supports arbitrary nesting — each menu item can optionally open a child submenu on hover or keyboard interaction.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiMenu` | `ui-menu` | Component | Root menu panel — manages overlay, positions, keyboard nav |
| `UiMenuItem` | `ui-menu-item` | Component | A single item inside a menu — supports text, icon slot, disabled state |
| `UiMenuTrigger` | `[uiMenuTrigger]` | Directive | Attaches to any element to open a top-level menu on click |
| `UiSubMenuTrigger` | `[uiSubMenuTrigger]` | Directive | Placed on a `ui-menu-item` to open a child submenu on hover / ArrowRight |

### Inputs & Outputs

**UiMenu**
- No public inputs needed (position is determined by trigger context)

**UiMenuItem**
- `disabled: InputSignalWithTransform<boolean, BooleanInput>` — disable the item
- `selected: OutputEmitterRef<void>` — emits when item is activated

**UiMenuTrigger**
- `uiMenuTrigger: InputSignal<UiMenu>` (required) — reference to the menu to open
- `menuPosition: InputSignal<MenuPosition>` — preferred position (`'below-start'` default)

**UiSubMenuTrigger**
- `uiSubMenuTrigger: InputSignal<UiMenu>` (required) — reference to the child submenu

### Types

```ts
type MenuPosition =
  | 'below-start'
  | 'below-end'
  | 'above-start'
  | 'above-end'
```

### Usage Example

```html
<!-- Basic menu -->
<button [uiMenuTrigger]="fileMenu">File</button>

<ui-menu #fileMenu>
  <ui-menu-item (selected)="onNew()">New</ui-menu-item>
  <ui-menu-item (selected)="onOpen()">Open</ui-menu-item>
  <ui-menu-item [uiSubMenuTrigger]="exportMenu">
    Export
  </ui-menu-item>
  <ui-menu-item disabled (selected)="onPrint()">Print</ui-menu-item>
</ui-menu>

<!-- Nested submenu -->
<ui-menu #exportMenu>
  <ui-menu-item (selected)="onExportPdf()">PDF</ui-menu-item>
  <ui-menu-item (selected)="onExportCsv()">CSV</ui-menu-item>
  <ui-menu-item [uiSubMenuTrigger]="imageMenu">
    Image
  </ui-menu-item>
</ui-menu>

<!-- Deeply nested submenu -->
<ui-menu #imageMenu>
  <ui-menu-item (selected)="onPng()">PNG</ui-menu-item>
  <ui-menu-item (selected)="onJpg()">JPG</ui-menu-item>
</ui-menu>
```

## Behavior

### Opening / Closing

| Trigger | Action |
|---|---|
| Click on `[uiMenuTrigger]` | Toggle root menu |
| Hover on `[uiSubMenuTrigger]` item (with delay ~150ms) | Open child submenu |
| ArrowRight on `[uiSubMenuTrigger]` item | Open child submenu immediately, focus first item |
| ArrowLeft inside a submenu | Close submenu, restore focus to parent trigger item |
| Escape | Close innermost open menu |
| Click outside all menus | Close entire menu tree |
| Click on an enabled item (no submenu) | Emit `selected`, close entire menu tree |
| Tab | Close entire menu tree |

### Keyboard Navigation

| Key | Action |
|---|---|
| ArrowDown | Focus next enabled item |
| ArrowUp | Focus previous enabled item |
| ArrowRight | Open submenu (if item has one) |
| ArrowLeft | Close current submenu, return to parent |
| Enter / Space | Activate item or open submenu |
| Home | Focus first enabled item |
| End | Focus last enabled item |
| Escape | Close innermost menu |

### Overlay Positioning

- **Root menu:** Positioned relative to trigger element using `CdkConnectedOverlay` with `menuPosition` input and fallbacks
- **Submenus:** Positioned to the right of the parent item (`end-start`), with fallback to the left (`start-start`) and vertical fallbacks
- Offset: 4px vertical gap for root, 0px vertical / 0px horizontal for submenus (overlap slightly for seamless hover)

## Accessibility

- Root menu panel: `role="menu"`
- Menu items: `role="menuitem"`, `aria-disabled` when disabled
- Sub-menu trigger items: `aria-haspopup="menu"`, `aria-expanded`
- Trigger element: `aria-haspopup="menu"`, `aria-expanded`
- Focus is trapped within the currently active menu level
- Focus restored to trigger on close

## Styling

- Panel: matches existing dropdown — `min-w-[8rem] rounded-md border border-border bg-surface-raised py-1 shadow-md`
- Item: matches existing dropdown item — `px-3 py-2 text-sm text-foreground hover:bg-surface-hover focus-visible:bg-surface-hover`
- Sub-menu trigger item: shows a chevron-right icon on the trailing edge
- Disabled items: `opacity-50 pointer-events-none`

## File Structure

```
libs/ui/src/lib/menu/
  menu.ts            # UiMenu, UiMenuItem, UiMenuTrigger, UiSubMenuTrigger
  menu.spec.ts       # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [x]Create `UiMenu` component with CDK Overlay positioning
- [x]Create `UiMenuItem` component with disabled state and selected output
- [x]Create `UiMenuTrigger` directive for root-level trigger
- [x]Create `UiSubMenuTrigger` directive for nested submenus with hover + delay logic
- [x]Implement full keyboard navigation (Arrow keys, Enter, Space, Escape, Home, End)
- [x]Implement close-entire-tree logic when an item is selected or user clicks outside
- [x]Add ARIA attributes for full accessibility
- [x]Write unit tests covering open/close, keyboard nav, nested submenus, disabled items
- [x]Export all public APIs from `libs/ui/src/index.ts`
