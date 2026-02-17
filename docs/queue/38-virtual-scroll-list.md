# 38 — Virtual Scroll List

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A Virtual Scroll List component that wraps Angular CDK's virtual scrolling infrastructure to efficiently render large lists by only materializing visible items in the DOM. Supports fixed and auto-size item height strategies, custom item templates via a structural directive, scroll-to-index API, infinite scroll via a `loadMore` output, track-by function support, and placeholder/skeleton rendering while items load.

## API Design

### Components & Directives

| Name                    | Type      | Selector                  | Description                                                        |
|-------------------------|-----------|---------------------------|--------------------------------------------------------------------|
| `UiVirtualScrollList`   | Component | `ui-virtual-scroll-list`  | Wrapper around `cdk-virtual-scroll-viewport` for virtual scrolling |
| `UiVirtualScrollItem`   | Directive | `[uiVirtualScrollItem]`   | Structural directive providing the item template                   |

### Inputs & Outputs

#### `UiVirtualScrollList`

| Name         | Kind     | Type                              | Default | Description                                                                 |
|--------------|----------|-----------------------------------|---------|-----------------------------------------------------------------------------|
| `items`      | `input`  | `T[]`                             | `[]`    | The data array to render virtually                                          |
| `itemSize`   | `input`  | `number`                          | `48`    | Fixed item height in pixels (used by `FixedSizeVirtualScrollStrategy`)      |
| `autoSize`   | `input`  | `boolean`                         | `false` | When `true`, uses `AutoSizeVirtualScrollStrategy` instead of fixed size     |
| `trackBy`    | `input`  | `TrackByFunction<T>`              | —       | Optional track-by function passed to `*cdkVirtualFor`                       |
| `bufferSize` | `input`  | `number`                          | `5`     | Number of extra items rendered outside the visible area                     |
| `loading`    | `input`  | `boolean`                         | `false` | When `true`, displays a loading indicator at the bottom of the list         |
| `loadMore`   | `output` | `EventEmitter<void>`              | —       | Emits when the user scrolls near the end of the list (infinite scroll)      |

### Types

```typescript
import { TrackByFunction } from '@angular/core'

/**
 * Context provided to the UiVirtualScrollItem structural directive template.
 */
export interface UiVirtualScrollItemContext<T> {
  /** Implicit value — the current item. */
  $implicit: T
  /** The index of the current item in the data source. */
  index: number
}
```

### Usage Examples

#### Basic fixed-size list

```html
<ui-virtual-scroll-list [items]="users()" [itemSize]="56">
  <ng-template uiVirtualScrollItem let-user let-i="index">
    <div class="user-row">{{ i + 1 }}. {{ user.name }}</div>
  </ng-template>
</ui-virtual-scroll-list>
```

#### Auto-size with infinite scroll

```html
<ui-virtual-scroll-list
  [items]="messages()"
  [autoSize]="true"
  [loading]="isLoading()"
  (loadMore)="onLoadMore()"
>
  <ng-template uiVirtualScrollItem let-message>
    <app-message-card [message]="message" />
  </ng-template>
</ui-virtual-scroll-list>
```

#### With track-by function

```typescript
readonly trackById: TrackByFunction<Product> = (index, item) => item.id
```

```html
<ui-virtual-scroll-list
  [items]="products()"
  [itemSize]="72"
  [trackBy]="trackById"
  [bufferSize]="10"
>
  <ng-template uiVirtualScrollItem let-product>
    <app-product-tile [product]="product" />
  </ng-template>
</ui-virtual-scroll-list>
```

#### Scroll-to-index (programmatic)

```typescript
@ViewChild —— use viewChild signal instead:
list = viewChild<UiVirtualScrollList>('scrollList')

scrollToItem() {
  this.list()?.scrollToIndex(42, 'smooth')
}
```

```html
<ui-virtual-scroll-list #scrollList [items]="items()" [itemSize]="48">
  ...
</ui-virtual-scroll-list>
<button (click)="scrollToItem()">Jump to item 42</button>
```

## Behavior

- **Rendering**: Only items within the visible viewport plus the `bufferSize` buffer are rendered in the DOM. All other items are virtualized.
- **Fixed size strategy**: When `autoSize` is `false` (default), uses `FixedSizeVirtualScrollStrategy` with the provided `itemSize` value. Each item occupies exactly `itemSize` pixels in height.
- **Auto size strategy**: When `autoSize` is `true`, uses CDK's `AutoSizeVirtualScrollStrategy`, allowing items of varying heights.
- **Scroll-to-index**: The component exposes a public `scrollToIndex(index: number, behavior?: ScrollBehavior)` method that delegates to the CDK viewport's `scrollToIndex`.
- **Infinite scroll / load more**: The component listens to the viewport's `scrolledIndexChange` observable. When the rendered range approaches the end of the data set (within `bufferSize` items), it emits the `loadMore` output. A `loading` input controls whether a spinner/skeleton is shown at the bottom.
- **Placeholder / skeleton**: While `loading` is `true`, a skeleton placeholder row is rendered below the last item to indicate more data is being fetched.
- **Track-by**: The optional `trackBy` input is forwarded directly to `*cdkVirtualFor` for efficient DOM recycling.
- **Template context**: The `UiVirtualScrollItem` structural directive provides the item as the implicit context (`$implicit`) and the item index as `index`.

## Accessibility

- The virtual scroll container uses `role="list"` and each rendered item uses `role="listitem"`.
- `aria-rowcount` is set on the container to reflect the total number of items (not just those rendered).
- Keyboard navigation: the container is focusable and supports `ArrowUp` / `ArrowDown` to move between items, `Home` / `End` to jump to first/last item.
- The loading indicator has `aria-live="polite"` and `role="status"` so screen readers announce when more items are loading.
- Focus is preserved when items are recycled during scroll — the focused element index is tracked and restored.
- All interactive content inside item templates remains reachable via `Tab`.
- Color contrast and focus indicators meet WCAG AA requirements.

## Styling

- The component uses a `:host` block to set `display: block` and a default height of `400px` (overridable by the consumer).
- The CDK viewport is styled to fill the host element (`height: 100%`, `width: 100%`).
- A CSS custom property `--ui-virtual-scroll-item-gap` (default `0`) controls spacing between items.
- The loading indicator / skeleton row uses a pulsing animation via `@keyframes` defined in the component styles.
- No global styles are emitted; all styles are encapsulated via `ViewEncapsulation.None` scoped with a host class or via `encapsulation: ViewEncapsulation.Emulated` (default).
- Consumers can override the viewport height via CSS on the `ui-virtual-scroll-list` selector.

## File Structure

```
libs/ui/src/lib/virtual-scroll/
  virtual-scroll.ts          # UiVirtualScrollList component + UiVirtualScrollItem directive + types
  virtual-scroll.spec.ts     # Unit tests

libs/ui/src/index.ts          # Public API — re-exports component, directive, and types
```

## Deliverables

- [ ] Create `UiVirtualScrollList` component with CDK virtual scroll viewport integration
- [ ] Create `UiVirtualScrollItem` structural directive for custom item templates
- [ ] Implement fixed-size and auto-size item height strategies
- [ ] Implement `scrollToIndex` public API method
- [ ] Implement `loadMore` output with infinite scroll detection
- [ ] Implement `trackBy` forwarding to `*cdkVirtualFor`
- [ ] Implement loading indicator / skeleton placeholder
- [ ] Add `role="list"` / `role="listitem"` and `aria-rowcount` for accessibility
- [ ] Add keyboard navigation (ArrowUp/Down, Home/End)
- [ ] Add unit tests covering rendering, scroll-to-index, loadMore emission, and accessibility
- [ ] Export component, directive, and types from `libs/ui/src/index.ts`
- [ ] Add logger entry in core library index if core changes are needed
