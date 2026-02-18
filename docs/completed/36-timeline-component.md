# 36 — Timeline Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | 2026-02-17 |
| Completed | 2026-02-18 |

---

## Description

A flexible Timeline component for displaying chronological sequences of events. The timeline supports vertical and horizontal orientations, multiple alignment strategies, per-item status indicators, custom icons, optional timestamps, and connectors between items. All content is projected, giving consumers full control over item bodies while the component handles layout, connectors, and state styling.

## API Design

### Components & Directives

| Name                  | Selector              | Type      | Description                                      |
|-----------------------|-----------------------|-----------|--------------------------------------------------|
| `UiTimeline`          | `ui-timeline`         | Component | Container that arranges items along a timeline   |
| `UiTimelineItem`      | `ui-timeline-item`    | Component | Individual event entry in the timeline           |
| `UiTimelineDot`       | `ui-timeline-dot`     | Component | Custom dot or icon indicator for a timeline item |
| `UiTimelineContent`   | `ui-timeline-content` | Directive | Marks the projected content area of an item      |
| `UiTimelineConnector` | `ui-timeline-connector` | Component | Line connector between consecutive items       |

### Inputs & Outputs

#### `UiTimeline`

| Name          | Type                                      | Default      | Description                                                        |
|---------------|-------------------------------------------|--------------|--------------------------------------------------------------------|
| `orientation` | `input<'vertical' \| 'horizontal'>()`     | `'vertical'` | Layout direction of the timeline                                   |
| `align`       | `input<'start' \| 'end' \| 'alternate'>()` | `'start'`    | Alignment of items relative to the axis (vertical orientation only) |

#### `UiTimelineItem`

| Name        | Type                                                  | Default     | Description                                  |
|-------------|-------------------------------------------------------|-------------|----------------------------------------------|
| `status`    | `input<'completed' \| 'active' \| 'pending'>()`       | `'pending'` | Visual state of the item                     |
| `icon`      | `input<string \| undefined>()`                        | `undefined` | Icon identifier rendered inside the dot      |
| `timestamp` | `input<string \| undefined>()`                        | `undefined` | Optional timestamp label displayed near item |

#### `UiTimelineDot`

| Name    | Type                                             | Default     | Description                             |
|---------|--------------------------------------------------|-------------|-----------------------------------------|
| `status`| `input<'completed' \| 'active' \| 'pending'>()` | `'pending'` | Inherited or overridden status for styling |

#### `UiTimelineConnector`

| Name     | Type                  | Default | Description                          |
|----------|-----------------------|---------|--------------------------------------|
| `active` | `input<boolean>()`    | `false` | Whether the connector line is active |

### Types

```typescript
type TimelineOrientation = 'vertical' | 'horizontal'
type TimelineAlign = 'start' | 'end' | 'alternate'
type TimelineItemStatus = 'completed' | 'active' | 'pending'
```

### Usage Examples

#### Basic vertical timeline (start-aligned)

```html
<ui-timeline>
  <ui-timeline-item status="completed" timestamp="Jan 2026">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>
      <h3>Project Kickoff</h3>
      <p>Initial planning and requirements gathering.</p>
    </ui-timeline-content>
  </ui-timeline-item>

  <ui-timeline-item status="active" timestamp="Feb 2026">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>
      <h3>Development</h3>
      <p>Core feature implementation in progress.</p>
    </ui-timeline-content>
  </ui-timeline-item>

  <ui-timeline-item status="pending" timestamp="Mar 2026">
    <ui-timeline-dot />
    <ui-timeline-content>
      <h3>Release</h3>
      <p>Production deployment.</p>
    </ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>
```

#### Alternate alignment

```html
<ui-timeline align="alternate">
  <ui-timeline-item status="completed" timestamp="Week 1">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>
      <p>First milestone reached.</p>
    </ui-timeline-content>
  </ui-timeline-item>

  <ui-timeline-item status="active" timestamp="Week 2">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>
      <p>Second milestone in progress.</p>
    </ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>
```

#### Horizontal timeline

```html
<ui-timeline orientation="horizontal">
  <ui-timeline-item status="completed">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Step 1</ui-timeline-content>
  </ui-timeline-item>

  <ui-timeline-item status="active">
    <ui-timeline-dot />
    <ui-timeline-connector />
    <ui-timeline-content>Step 2</ui-timeline-content>
  </ui-timeline-item>

  <ui-timeline-item status="pending">
    <ui-timeline-dot />
    <ui-timeline-content>Step 3</ui-timeline-content>
  </ui-timeline-item>
</ui-timeline>
```

#### Custom icon in dot

```html
<ui-timeline-item status="completed">
  <ui-timeline-dot>
    <span class="material-icons">check</span>
  </ui-timeline-dot>
  <ui-timeline-connector />
  <ui-timeline-content>
    <p>Task completed successfully.</p>
  </ui-timeline-content>
</ui-timeline-item>
```

## Behavior

- **Orientation**: `vertical` renders items top-to-bottom; `horizontal` renders items left-to-right.
- **Alignment (vertical only)**:
  - `start` — all items on the end side of the axis (content to the right in LTR).
  - `end` — all items on the start side of the axis (content to the left in LTR).
  - `alternate` — items alternate sides; odd items on the end side, even items on the start side.
- **Connectors**: `UiTimelineConnector` renders a line from the current item toward the next. The last item in the timeline typically omits the connector.
- **Dot indicator**: `UiTimelineDot` renders a circular indicator on the axis. If no content is projected into it and an `icon` input is provided on the parent `UiTimelineItem`, the icon is rendered inside the dot. If content is projected (e.g., a custom icon element), the projected content takes precedence.
- **Status styling**: Each `UiTimelineItem` exposes its `status` as a CSS host class (`ui-timeline-item--completed`, `ui-timeline-item--active`, `ui-timeline-item--pending`). The dot and connector inherit the status for their own styling.
- **Timestamp**: When the `timestamp` input is set, it is rendered in a dedicated label area near the dot. In alternate mode, the timestamp appears on the opposite side of the content.
- **Responsive behavior**: In horizontal orientation on narrow viewports (below a configurable breakpoint), the timeline collapses to vertical orientation automatically. CSS custom properties allow consumers to override the breakpoint.
- **RTL support**: The component respects `dir="rtl"` and mirrors alignment accordingly.
- **Item index tracking**: `UiTimeline` queries its content children (`UiTimelineItem`) and provides each item with its index so alternate alignment can determine placement.

## Accessibility

- The timeline container uses `role="list"` and each `UiTimelineItem` uses `role="listitem"` to convey the sequential relationship.
- Status is communicated via `aria-label` on each `UiTimelineItem` (e.g., `aria-label="Step 2: active"`).
- The `UiTimelineDot` is decorative when no interactive behavior is attached; it uses `aria-hidden="true"`.
- Timestamps are rendered as visible text and are also included in the item's `aria-label` for screen reader context.
- Connectors are purely decorative and use `aria-hidden="true"`.
- Color is never the sole indicator of status; icons and/or text labels reinforce each state.
- Focus management: timeline items are not focusable by default. If consumers add interactive content inside `UiTimelineContent`, standard focus order applies.
- All text meets WCAG AA contrast minimums against the timeline background.

## Styling

- **CSS custom properties** for theming:
  - `--ui-timeline-line-color` — connector line color
  - `--ui-timeline-line-width` — connector line thickness
  - `--ui-timeline-dot-size` — diameter of the dot indicator
  - `--ui-timeline-dot-color-completed` — dot color for completed status
  - `--ui-timeline-dot-color-active` — dot color for active status
  - `--ui-timeline-dot-color-pending` — dot color for pending status
  - `--ui-timeline-gap` — spacing between items
  - `--ui-timeline-content-gap` — spacing between dot and content
  - `--ui-timeline-horizontal-breakpoint` — viewport width below which horizontal collapses to vertical
- Host classes are applied based on orientation and alignment: `ui-timeline--vertical`, `ui-timeline--horizontal`, `ui-timeline--align-start`, `ui-timeline--align-end`, `ui-timeline--align-alternate`.
- Item-level host classes for status: `ui-timeline-item--completed`, `ui-timeline-item--active`, `ui-timeline-item--pending`.
- Connector uses a CSS pseudo-element or a styled `<div>` depending on orientation.
- Alternate layout uses CSS Grid or Flexbox with `order` manipulation to position content and timestamps on opposite sides.

## File Structure

```
libs/ui/src/lib/timeline/
  timeline.ts          # All components and directives (UiTimeline, UiTimelineItem, UiTimelineDot, UiTimelineContent, UiTimelineConnector)
  timeline.spec.ts     # Unit tests

libs/ui/src/index.ts   # Re-export all public symbols
```

## Deliverables

- [x] Create `UiTimeline` container component with `orientation` and `align` signal inputs
- [x] Create `UiTimelineItem` component with `status`, `icon`, and `timestamp` signal inputs
- [x] Create `UiTimelineDot` component with optional content projection and status styling
- [x] Create `UiTimelineContent` directive for content projection
- [x] Create `UiTimelineConnector` component with active state support
- [x] Implement vertical layout with start, end, and alternate alignment
- [x] Implement horizontal layout with responsive collapse to vertical
- [x] Apply status-based host classes and CSS custom properties for theming
- [x] Add ARIA roles, labels, and decorative markers for accessibility
- [x] Support RTL via directional-aware CSS
- [x] Write unit tests covering all orientations, alignments, statuses, and projected content
- [x] Export all public symbols from `libs/ui/src/index.ts`
- [x] Add logger entry in core library index if core changes are needed
