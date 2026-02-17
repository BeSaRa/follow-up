# 44 — Splitter Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A resizable Splitter component that divides a container into multiple panels separated by draggable gutters. Users can resize panels by dragging the gutter between them, collapse panels via double-click or keyboard interaction, and nest splitters for complex layouts. The component supports both horizontal and vertical orientations, per-panel min/max size constraints, and emits size changes for external persistence. RTL layout is fully supported with automatic directional awareness.

## API Design

### Components & Directives

| Name               | Selector             | Type      | Description                                                       |
|--------------------|----------------------|-----------|-------------------------------------------------------------------|
| `UiSplitter`       | `ui-splitter`        | Component | Container that arranges panels with draggable gutters between them |
| `UiSplitterPanel`  | `ui-splitter-panel`  | Component | Individual resizable panel within the splitter                     |
| `UiSplitterGutter` | (internal)           | Component | Auto-generated draggable divider between adjacent panels           |

### Inputs & Outputs

#### `UiSplitter`

| Name            | Type                                                  | Default        | Description                                             |
|-----------------|-------------------------------------------------------|----------------|---------------------------------------------------------|
| `orientation`   | `input<'horizontal' \| 'vertical'>()`                 | `'horizontal'` | Layout direction — horizontal splits left/right, vertical splits top/bottom |
| `gutterSize`    | `input<number>()`                                     | `8`            | Width (horizontal) or height (vertical) of the gutter in pixels |
| `sizeChange`    | `output<SplitterSizeChangeEvent>()`                   |                | Emits current panel sizes array after any resize completes — consumers can persist this |

#### `UiSplitterPanel`

| Name          | Type                      | Default     | Description                                                         |
|---------------|---------------------------|-------------|---------------------------------------------------------------------|
| `size`        | `input<number>()`         | (auto)      | Initial size as a percentage of the splitter container (0–100)      |
| `minSize`     | `input<number>()`         | `0`         | Minimum size as a percentage — panel cannot shrink below this       |
| `maxSize`     | `input<number>()`         | `100`       | Maximum size as a percentage — panel cannot grow beyond this        |
| `collapsible` | `input<boolean>()`        | `false`     | Whether the panel can be collapsed via double-click or keyboard     |
| `collapsed`   | `model<boolean>()`        | `false`     | Two-way binding for the collapsed state of the panel                |

### Types

```typescript
type SplitterOrientation = 'horizontal' | 'vertical'

interface SplitterSizeChangeEvent {
  sizes: number[]        // current percentage sizes of all panels
  gutterIndex: number    // index of the gutter that was dragged (or -1 for programmatic)
}

interface SplitterPanelState {
  size: number
  minSize: number
  maxSize: number
  collapsible: boolean
  collapsed: boolean
}
```

### Usage Examples

#### Basic two-panel horizontal splitter

```html
<ui-splitter>
  <ui-splitter-panel [size]="30" [minSize]="10">
    <nav>Sidebar content</nav>
  </ui-splitter-panel>
  <ui-splitter-panel [size]="70" [minSize]="20">
    <main>Main content</main>
  </ui-splitter-panel>
</ui-splitter>
```

#### Three-panel vertical splitter with collapsible panel

```html
<ui-splitter orientation="vertical" (sizeChange)="onSizeChange($event)">
  <ui-splitter-panel [size]="25" [minSize]="10" [collapsible]="true">
    <header>Top panel</header>
  </ui-splitter-panel>
  <ui-splitter-panel [size]="50" [minSize]="20">
    <section>Middle panel</section>
  </ui-splitter-panel>
  <ui-splitter-panel [size]="25" [minSize]="10">
    <footer>Bottom panel</footer>
  </ui-splitter-panel>
</ui-splitter>
```

#### Nested splitters

```html
<ui-splitter>
  <ui-splitter-panel [size]="25" [minSize]="15" [collapsible]="true">
    <aside>File tree</aside>
  </ui-splitter-panel>
  <ui-splitter-panel [size]="75">
    <ui-splitter orientation="vertical">
      <ui-splitter-panel [size]="70" [minSize]="30">
        <div>Editor</div>
      </ui-splitter-panel>
      <ui-splitter-panel [size]="30" [minSize]="10" [collapsible]="true">
        <div>Terminal</div>
      </ui-splitter-panel>
    </ui-splitter>
  </ui-splitter-panel>
</ui-splitter>
```

#### Persisting and restoring sizes

```typescript
// Save
onSizeChange(event: SplitterSizeChangeEvent) {
  localStorage.setItem('splitter-sizes', JSON.stringify(event.sizes))
}

// Restore
savedSizes = signal(JSON.parse(localStorage.getItem('splitter-sizes') ?? '[30, 70]'))
```

```html
<ui-splitter (sizeChange)="onSizeChange($event)">
  <ui-splitter-panel [size]="savedSizes()[0]">Panel A</ui-splitter-panel>
  <ui-splitter-panel [size]="savedSizes()[1]">Panel B</ui-splitter-panel>
</ui-splitter>
```

## Behavior

### Drag Resizing

| Trigger                  | Action                                                                   |
|--------------------------|--------------------------------------------------------------------------|
| Mousedown on gutter      | Begin tracking — add `grabbing` cursor to body                           |
| Mousemove while dragging | Recalculate adjacent panel sizes respecting min/max constraints           |
| Mouseup                  | End tracking — emit `sizeChange` with final sizes, remove grabbing cursor |
| Touch start/move/end     | Same as mouse events for touch devices                                   |

- During drag, panel sizes are updated in real time using CSS `flex-basis` percentages.
- The gutter distributes space only between its two adjacent panels. Other panels remain unchanged.
- If a panel reaches its `minSize` or `maxSize`, the gutter stops distributing space in that direction.

### Collapsing

| Trigger                       | Action                                                                  |
|-------------------------------|-------------------------------------------------------------------------|
| Double-click on gutter        | Collapse the smaller of the two adjacent panels (if `collapsible`)      |
| Double-click collapsed gutter | Expand the collapsed panel back to its previous size                    |
| Keyboard Enter on gutter      | Toggle collapse on the panel indicated by the arrow key direction       |
| Programmatic `collapsed` set  | Collapse or expand the panel, redistributing space to the sibling panel |

- When a panel collapses, its size becomes `0` and the adjacent panel absorbs the freed space.
- The previous size is stored internally so it can be restored on expand.
- The `collapsed` model emits the new state for two-way binding.

### Size Calculation

- If explicit `size` inputs are provided and they sum to 100, those values are used directly.
- If sizes do not sum to 100, they are normalized proportionally.
- If some panels omit `size`, the remaining space is distributed equally among them.
- Gutter size is subtracted from the total container size before percentage calculations.

### RTL Support

- In horizontal orientation with `dir="rtl"`, the drag direction is mirrored so that dragging the gutter left grows the right panel and vice versa.
- Keyboard arrow directions are also mirrored in RTL.
- Vertical orientation is unaffected by RTL.

## Accessibility

- Each gutter has `role="separator"` with `aria-orientation` matching the splitter orientation.
- Gutters are focusable with `tabindex="0"`.
- `aria-valuenow` reflects the size of the panel before the gutter (as a percentage).
- `aria-valuemin` and `aria-valuemax` reflect the `minSize` and `maxSize` of the panel before the gutter.
- `aria-label` on each gutter describes its function (e.g., `"Resize between panel 1 and panel 2"`).
- Keyboard interaction:
  - **Arrow Left / Arrow Up**: decrease the size of the panel before the gutter by a step (default 1%).
  - **Arrow Right / Arrow Down**: increase the size of the panel before the gutter by a step.
  - **Home**: collapse the panel before the gutter to its minimum size.
  - **End**: expand the panel before the gutter to its maximum size.
  - **Enter**: toggle collapse on the adjacent collapsible panel.
- Arrow keys respect RTL direction in horizontal orientation.
- Focus is visible with a distinct outline on the gutter.
- Color is not the sole indicator of state; the gutter cursor changes to `col-resize` or `row-resize`.

## Styling

- **CSS custom properties** for theming:
  - `--ui-splitter-gutter-color` — gutter background color
  - `--ui-splitter-gutter-color-hover` — gutter color on hover
  - `--ui-splitter-gutter-color-active` — gutter color while dragging
  - `--ui-splitter-gutter-size` — gutter width/height (overridable, default from `gutterSize` input)
  - `--ui-splitter-gutter-handle-size` — size of the visual drag handle indicator
  - `--ui-splitter-gutter-handle-color` — color of the drag handle dots/lines
  - `--ui-splitter-panel-transition` — transition duration for collapse/expand animations
- Host classes:
  - `ui-splitter--horizontal`, `ui-splitter--vertical` — orientation
  - `ui-splitter--dragging` — while a gutter is being dragged
- Panel host classes:
  - `ui-splitter-panel--collapsed` — when the panel is collapsed
- Gutter renders a small visual handle (three dots or lines) centered within it to indicate draggability.
- Gutter cursor: `col-resize` for horizontal, `row-resize` for vertical.
- Panels use `overflow: auto` by default so content scrolls when the panel is smaller than its content.
- Collapse/expand transitions use CSS transitions on `flex-basis` for smooth animation.

## File Structure

```
libs/ui/src/lib/splitter/
  splitter.ts          # UiSplitter, UiSplitterPanel, UiSplitterGutter
  splitter.spec.ts     # Unit tests

libs/ui/src/index.ts   # Re-export all public symbols
```

## Deliverables

- [ ] Create `UiSplitter` container component with `orientation` and `gutterSize` signal inputs
- [ ] Create `UiSplitterPanel` component with `size`, `minSize`, `maxSize`, `collapsible`, and `collapsed` inputs
- [ ] Create `UiSplitterGutter` internal component with drag handle rendering
- [ ] Implement mouse and touch drag resizing with real-time flex-basis updates
- [ ] Enforce min/max size constraints during drag
- [ ] Implement panel collapsing via double-click, keyboard, and programmatic two-way binding
- [ ] Store and restore previous panel size on collapse/expand
- [ ] Normalize panel sizes when inputs do not sum to 100
- [ ] Support multiple panels (not limited to two) with gutters auto-generated between each pair
- [ ] Support nested splitters (splitter inside a panel)
- [ ] Emit `sizeChange` output after resize completes for external persistence
- [ ] Add keyboard navigation (Arrow keys, Home, End, Enter) on gutters
- [ ] Add ARIA attributes (`role="separator"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`)
- [ ] Support RTL with mirrored drag and keyboard directions
- [ ] Apply CSS custom properties for theming and host classes for state
- [ ] Write unit tests covering drag, collapse, keyboard, constraints, multi-panel, nested, and RTL
- [ ] Export all public symbols from `libs/ui/src/index.ts`
