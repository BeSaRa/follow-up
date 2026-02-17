# 42 — Transfer List Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A dual-list transfer component that allows users to move items between a source list and a target list. Supports selecting individual items or moving all items at once via arrow buttons. Each list can be filtered with a search input, items can be disabled, and a header displays the current item count. Supports custom item templates via a structural directive and drag-and-drop reordering/transfer using CDK DragDrop. Fully keyboard-navigable and accessible.

## API Design

### Components & Directives

| Class | Selector | Type | Role |
|---|---|---|---|
| `UiTransferList` | `ui-transfer-list` | Component | Container — renders two list panels with transfer action buttons between them |
| `UiTransferListItem` | `[uiTransferListItem]` | Directive | Structural directive for custom item template. Exposes `$implicit` (the item) and `index` via template context |

### Inputs & Outputs

**UiTransferList**

| Name | Type | Default | Description |
|---|---|---|---|
| `source` | `InputSignal<TransferItem<T>[]>` | `[]` | Items in the source (left) list |
| `target` | `InputSignal<TransferItem<T>[]>` | `[]` | Items in the target (right) list |
| `trackBy` | `InputSignal<TrackByFunction<T>>` | identity fn | Track-by function for `@for` loops |
| `filterable` | `InputSignal<boolean>` | `false` | Show search/filter input above each list |
| `sourceTitle` | `InputSignal<string>` | `'Available'` | Header title for the source list |
| `targetTitle` | `InputSignal<string>` | `'Selected'` | Header title for the target list |
| `disabled` | `InputSignal<boolean>` | `false` | Disable the entire component |
| `sourceChange` | `OutputEmitterRef<TransferItem<T>[]>` | — | Emits updated source list after a transfer |
| `targetChange` | `OutputEmitterRef<TransferItem<T>[]>` | — | Emits updated target list after a transfer |
| `transferred` | `OutputEmitterRef<TransferEvent<T>>` | — | Emits metadata about the transfer action |

### Types

```ts
interface TransferItem<T = unknown> {
  value: T
  label: string
  disabled?: boolean
}

interface TransferEvent<T = unknown> {
  items: TransferItem<T>[]
  from: 'source' | 'target'
  to: 'source' | 'target'
}

interface TransferListItemContext<T = unknown> {
  $implicit: TransferItem<T>
  index: number
}
```

### Usage Examples

```html
<!-- Basic usage -->
<ui-transfer-list
  [source]="availableUsers()"
  [target]="assignedUsers()"
  [filterable]="true"
  sourceTitle="Available Users"
  targetTitle="Assigned Users"
  (sourceChange)="availableUsers.set($event)"
  (targetChange)="assignedUsers.set($event)"
  (transferred)="onTransferred($event)"
/>
```

```html
<!-- Custom item template -->
<ui-transfer-list
  [source]="availableItems()"
  [target]="selectedItems()"
  [trackBy]="trackById"
>
  <ng-template uiTransferListItem let-item let-i="index">
    <div class="flex items-center gap-2">
      <ui-avatar [name]="item.label" size="sm" />
      <span>{{ item.label }}</span>
    </div>
  </ng-template>
</ui-transfer-list>
```

```html
<!-- With disabled items -->
<ui-transfer-list
  [source]="[
    { value: 1, label: 'Admin', disabled: true },
    { value: 2, label: 'Editor' },
    { value: 3, label: 'Viewer' }
  ]"
  [target]="[]"
/>
```

## Behavior

### Selection

| Trigger | Action |
|---|---|
| Click an item | Toggle selection on that item (if not disabled) |
| Ctrl + Click | Add/remove item from multi-selection |
| Shift + Click | Range-select from last selected item to clicked item |
| Click list header checkbox | Select/deselect all non-disabled items in that list |

### Transfer Actions

Four action buttons sit between the two lists:

| Button | Icon | Action |
|---|---|---|
| Move selected right | `>` | Move selected source items to target |
| Move all right | `>>` | Move all non-disabled source items to target |
| Move selected left | `<` | Move selected target items to source |
| Move all left | `<<` | Move all non-disabled target items to source |

- Buttons are disabled when there is nothing to move (e.g., no selection, or list is empty)
- After transfer, selection is cleared on both sides
- Each transfer emits `sourceChange`, `targetChange`, and `transferred`

### Filtering

When `filterable` is `true`:
- A text input appears above each list
- Typing filters items by `label` (case-insensitive substring match)
- Filtered-out items are hidden but not removed
- Selection state is preserved when filtering
- "Move all" only moves visible (filtered) non-disabled items

### Drag & Drop

- Items can be dragged from one list and dropped in the other using CDK `cdkDropList` and `cdkDrag`
- Dragging a selected item also moves all other selected items
- Disabled items cannot be dragged
- Drop indicator shows insertion point
- Reordering within the same list is supported

### Disabled Items

- Items with `disabled: true` cannot be selected, transferred, or dragged
- They render with reduced opacity and `pointer-events: none`
- "Move all" and "Select all" skip disabled items

## Accessibility

- Each list panel: `role="listbox"`, `aria-multiselectable="true"`, `aria-label` set to the list title
- Each item: `role="option"`, `aria-selected` reflects selection state, `aria-disabled` for disabled items
- Arrow buttons: `aria-label` describes the action (e.g., "Move selected items to target")
- Filter input: `aria-label="Filter <list title>"`, linked to listbox via `aria-controls`
- Header checkbox: `aria-label="Select all <list title> items"`
- Keyboard navigation:
  - `Tab` — move focus between filter, list, and action buttons
  - `ArrowUp` / `ArrowDown` — navigate within a list
  - `Space` — toggle selection of focused item
  - `Ctrl+A` — select all non-disabled items in focused list
  - `Enter` — transfer selected items in the direction of the focused action button
- Live region (`aria-live="polite"`) announces transfer results (e.g., "3 items moved to Selected")

## Styling

- Container: `flex items-center gap-4` (horizontal layout)
- List panel: `flex flex-col border border-border rounded-lg overflow-hidden w-64`
- Panel header: `flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border text-sm font-medium`
- Item count badge in header: `text-xs text-foreground-muted`
- Filter input: `px-3 py-1.5 border-b border-border text-sm w-full outline-none bg-transparent`
- List body: `overflow-y-auto max-h-64`
- Item row: `flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-muted/50 transition-colors`
- Item selected: `bg-primary/10 text-primary`
- Item disabled: `opacity-50 cursor-not-allowed`
- Item dragging: `opacity-50 shadow-lg`
- Action buttons column: `flex flex-col gap-1`
- Action button: `p-1.5 rounded border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed`

## File Structure

```
libs/ui/src/lib/transfer-list/
  transfer-list.ts       # UiTransferList, UiTransferListItem
  transfer-list.spec.ts  # Unit tests
```

Export from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Create `UiTransferList` component with dual-list layout and transfer action buttons
- [ ] Create `UiTransferListItem` directive for custom item templates
- [ ] Implement item selection (click, Ctrl+Click, Shift+Click, select all)
- [ ] Implement transfer actions (move selected, move all) with output emissions
- [ ] Implement filterable lists with search input
- [ ] Integrate CDK DragDrop for drag-and-drop between lists and reordering
- [ ] Support disabled items (skip in selection, transfer, and drag)
- [ ] Display header with title, item count, and select-all checkbox
- [ ] Add ARIA attributes (`role="listbox"`, `role="option"`, `aria-selected`, `aria-live`)
- [ ] Implement keyboard navigation (Arrow keys, Space, Ctrl+A, Tab)
- [ ] Write unit tests
- [ ] Export all public APIs from `libs/ui/src/index.ts`
