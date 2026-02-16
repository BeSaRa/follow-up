# 33 — Tree View Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-16 |
| Started   | —          |
| Completed | —          |

---

## Description

A hierarchical tree view component for displaying nested data structures. Supports expand/collapse, single and multi-selection, keyboard navigation, lazy loading of children, and drag-and-drop reordering (optional). Uses the CDK Tree (`CdkTree`) as the foundation.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiTree` | `ui-tree` | Component | The tree container — wraps `CdkTree`, manages data and selection state |
| `UiTreeNode` | `ui-tree-node` | Component | A single node — renders toggle, icon, and label via content projection |
| `UiTreeNodeToggle` | `[uiTreeNodeToggle]` | Directive | Expand/collapse toggle for a node with children |
| `UiTreeNodePadding` | `[uiTreeNodePadding]` | Directive | Applies left padding based on depth level |

### Inputs & Outputs

**UiTree**
- `data: InputSignal<T[]>` — root-level array of tree nodes
- `childrenAccessor: InputSignal<(node: T) => T[] | Observable<T[]> | undefined>` — function to retrieve child nodes
- `trackBy: InputSignal<TrackByFunction<T>>` — track-by function for performance
- `selectionMode: InputSignal<TreeSelectionMode>` — `'none'` (default), `'single'`, or `'multi'`
- `selectionChange: OutputEmitterRef<T[]>` — emits when selection changes

**UiTreeNode**
- `node: InputSignal<T>` (required) — the data node this tree node represents
- `expandable: InputSignal<boolean>` — whether this node can be expanded
- `expanded: ModelSignal<boolean>` — current expanded state

**UiTreeNodePadding**
- `level: InputSignal<number>` — depth level, used to compute padding
- `indent: InputSignal<number>` — pixels per level (default `24`)

### Types

```ts
type TreeSelectionMode = 'none' | 'single' | 'multi'

interface FlatTreeNode<T> {
  data: T
  level: number
  expandable: boolean
  expanded: boolean
}
```

### Usage Examples

```html
<!-- Basic tree -->
<ui-tree [data]="files" [childrenAccessor]="getChildren">
  <ui-tree-node *cdkTreeNodeDef="let node" [node]="node">
    <button uiTreeNodeToggle [style.visibility]="node.expandable ? 'visible' : 'hidden'">
      <svg><!-- chevron icon --></svg>
    </button>
    <span>{{ node.name }}</span>
  </ui-tree-node>
</ui-tree>

<!-- With selection -->
<ui-tree
  [data]="items"
  [childrenAccessor]="getChildren"
  selectionMode="multi"
  (selectionChange)="onSelect($event)"
>
  <ui-tree-node *cdkTreeNodeDef="let node" [node]="node">
    <button uiTreeNodeToggle>
      <svg><!-- chevron --></svg>
    </button>
    <ui-checkbox [checked]="node.selected" />
    <span>{{ node.name }}</span>
  </ui-tree-node>
</ui-tree>
```

## Behavior

### Expand / Collapse

| Trigger | Action |
|---|---|
| Click toggle button | Toggle node expanded state |
| ArrowRight on collapsed node | Expand node |
| ArrowRight on expanded node | Focus first child |
| ArrowLeft on expanded node | Collapse node |
| ArrowLeft on collapsed / leaf node | Focus parent node |

### Selection

| Mode | Behavior |
|---|---|
| `none` | No selection, nodes are just navigable |
| `single` | Click selects one node, deselects previous |
| `multi` | Click toggles selection on/off per node |

### Keyboard Navigation

| Key | Action |
|---|---|
| ArrowDown | Focus next visible node |
| ArrowUp | Focus previous visible node |
| ArrowRight | Expand or move to first child |
| ArrowLeft | Collapse or move to parent |
| Enter / Space | Toggle selection (if selectionMode is not `none`) |
| Home | Focus first node |
| End | Focus last visible node |
| * (asterisk) | Expand all siblings at current level |

## Accessibility

- Tree container: `role="tree"`
- Tree nodes: `role="treeitem"`, `aria-level`, `aria-setsize`, `aria-posinset`
- Expandable nodes: `aria-expanded`
- Selected nodes: `aria-selected`
- Multi-select tree: `aria-multiselectable="true"` on the tree
- Focus management via roving tabindex

## Styling

- Node row: `flex items-center gap-1 px-2 py-1.5 text-sm rounded-md hover:bg-surface-hover cursor-pointer`
- Selected node: `bg-primary/10 text-primary`
- Focused node: `outline-2 outline-offset-[-2px] outline-ring`
- Toggle icon: `size-4 text-foreground-muted transition-transform` (rotates 90° when expanded)
- Indent: `24px` per level (customizable)

## File Structure

```
libs/ui/src/lib/tree/
  tree.ts            # UiTree, UiTreeNode, UiTreeNodeToggle, UiTreeNodePadding
  tree.spec.ts       # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Create `UiTree` component built on `CdkTree`
- [ ] Create `UiTreeNode` component with expand/collapse toggle
- [ ] Create `UiTreeNodeToggle` directive
- [ ] Create `UiTreeNodePadding` directive for depth-based indentation
- [ ] Implement `single` and `multi` selection modes with `selectionChange` output
- [ ] Implement full keyboard navigation (Arrow keys, Enter, Space, Home, End, asterisk)
- [ ] Add ARIA attributes (`role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-selected`, etc.)
- [ ] Support lazy-loaded children via `Observable<T[]>` in `childrenAccessor`
- [ ] Write unit tests
- [ ] Export all public APIs from `libs/ui/src/index.ts`
- [ ] Add tree view demo section to the showcase app
