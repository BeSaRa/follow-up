# 40 — Segmented Control Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A Segmented Control component that allows users to choose one option from a set of mutually exclusive segments. It functions similarly to a radio group but is presented as a horizontal row of connected buttons with an animated sliding indicator on the active segment. The component integrates with Angular Reactive Forms via `ControlValueAccessor` and supports multiple sizes, full-width layout, disabled states, and icon-only or icon+text segments.

## API Design

### Components & Directives

| Name                   | Type      | Selector                 | Purpose                                          |
|------------------------|-----------|--------------------------|--------------------------------------------------|
| `UiSegmentedControl`   | Component | `ui-segmented-control`   | Container that manages selection and indicator    |
| `UiSegment`            | Component | `ui-segment`             | Individual segment button within the control      |

### Inputs & Outputs

#### `UiSegmentedControl`

| Name        | Kind      | Type                   | Default | Description                                      |
|-------------|-----------|------------------------|---------|--------------------------------------------------|
| `value`     | `model()` | `string \| null`       | `null`  | The currently selected segment value              |
| `size`      | `input()` | `'sm' \| 'md' \| 'lg'`| `'md'`  | Size variant for all segments                     |
| `fullWidth` | `input()` | `boolean`              | `false` | Whether segments stretch to fill container width  |
| `disabled`  | `input()` | `boolean`              | `false` | Disables the entire segmented control             |

The component implements `ControlValueAccessor` so it can be used with `formControl`, `formControlName`, and `ngModel`.

#### `UiSegment`

| Name       | Kind      | Type      | Default | Description                                    |
|------------|-----------|-----------|---------|------------------------------------------------|
| `value`    | `input()` | `string`  | —       | **Required.** The value this segment represents|
| `disabled` | `input()` | `boolean` | `false` | Disables this individual segment               |

Content projection is used for the segment label. Supports text, icons, or both.

### Types

```typescript
type SegmentedControlSize = 'sm' | 'md' | 'lg'
```

### Usage Examples

#### Basic usage

```html
<ui-segmented-control [(value)]="view">
  <ui-segment value="day">Day</ui-segment>
  <ui-segment value="week">Week</ui-segment>
  <ui-segment value="month">Month</ui-segment>
</ui-segmented-control>
```

#### Reactive Forms

```html
<ui-segmented-control formControlName="period" size="lg" [fullWidth]="true">
  <ui-segment value="daily">Daily</ui-segment>
  <ui-segment value="weekly">Weekly</ui-segment>
  <ui-segment value="monthly">Monthly</ui-segment>
</ui-segmented-control>
```

#### Icon-only segments

```html
<ui-segmented-control [(value)]="layout">
  <ui-segment value="grid" aria-label="Grid view">
    <svg><!-- grid icon --></svg>
  </ui-segment>
  <ui-segment value="list" aria-label="List view">
    <svg><!-- list icon --></svg>
  </ui-segment>
</ui-segmented-control>
```

#### Icon + text segments

```html
<ui-segmented-control [(value)]="mode" size="sm">
  <ui-segment value="edit">
    <svg><!-- edit icon --></svg>
    Edit
  </ui-segment>
  <ui-segment value="preview">
    <svg><!-- preview icon --></svg>
    Preview
  </ui-segment>
</ui-segmented-control>
```

#### Disabled states

```html
<ui-segmented-control [(value)]="option" [disabled]="true">
  <ui-segment value="a">A</ui-segment>
  <ui-segment value="b">B</ui-segment>
</ui-segmented-control>

<ui-segmented-control [(value)]="option">
  <ui-segment value="a">A</ui-segment>
  <ui-segment value="b" [disabled]="true">B</ui-segment>
  <ui-segment value="c">C</ui-segment>
</ui-segmented-control>
```

## Behavior

- **Single selection**: Exactly one segment is active at a time. Clicking a non-disabled segment selects it and deselects the previously active one.
- **Animated indicator**: A sliding indicator (background highlight) animates from the previously active segment to the newly selected one. The indicator position and width are calculated from the DOM dimensions of the active `UiSegment` element.
- **Indicator positioning**: On initialization and when the value changes, the indicator's `transform: translateX()` and `width` are updated. Uses `afterNextRender` or `effect()` to measure segment positions after the DOM settles.
- **Disabled control**: When the entire control is disabled (via input or form control), all segments become non-interactive and the control receives a `ui-segmented-control--disabled` class.
- **Disabled segment**: An individually disabled segment cannot be selected. It is skipped during keyboard navigation.
- **No value**: If no segment matches the current value, no indicator is shown.
- **Dynamic segments**: If segments are added or removed dynamically, the indicator repositions accordingly using `contentChildren` signals.

## Accessibility

- The container has `role="radiogroup"` with an optional `aria-label` passthrough.
- Each segment has `role="radio"`, `aria-checked` reflecting selection state, and `aria-disabled` when disabled.
- `tabindex` management: Only the currently selected segment (or the first non-disabled segment if none is selected) has `tabindex="0"`. All others have `tabindex="-1"` (roving tabindex pattern).
- **Keyboard navigation**:
  - `ArrowRight` / `ArrowLeft` — Move focus to the next/previous non-disabled segment (wraps around).
  - `Home` — Move focus to the first non-disabled segment.
  - `End` — Move focus to the last non-disabled segment.
  - `Space` / `Enter` — Select the focused segment.
- Focus is visible via a focus ring on the active segment button.
- Disabled segments are skipped during arrow key navigation.
- Must pass AXE checks and meet WCAG AA requirements for color contrast and focus indicators.

## Styling

- **BEM naming**: Block `ui-segmented-control`, elements `__segments`, `__indicator`, `__segment`.
- **CSS custom properties** for theming:
  - `--ui-segmented-control-bg` — track background color
  - `--ui-segmented-control-indicator-bg` — active indicator background
  - `--ui-segmented-control-text` — default text color
  - `--ui-segmented-control-text-active` — active segment text color
  - `--ui-segmented-control-border-radius` — border radius of track and indicator
  - `--ui-segmented-control-gap` — gap between segments
  - `--ui-segmented-control-padding` — inner padding of the track
- **Size variants** (`sm`, `md`, `lg`) control height and font-size via `:host` class bindings.
- **Full-width mode**: When `fullWidth` is true, segments flex equally to fill the container width.
- The indicator uses `position: absolute` within the segments track and transitions `transform` and `width` for smooth animation.
- RTL support: Arrow keys reverse direction. Indicator animation respects `direction: rtl`.

## File Structure

```
libs/ui/src/lib/segmented-control/
├── segmented-control.ts          # UiSegmentedControl and UiSegment components
└── segmented-control.spec.ts     # Unit tests

libs/ui/src/index.ts              # Re-export added here
```

## Deliverables

- [ ] Create `UiSegment` component with `value` and `disabled` inputs, content projection, and `role="radio"` accessibility
- [ ] Create `UiSegmentedControl` component with `size`, `fullWidth`, `disabled` inputs and `value` model
- [ ] Implement `ControlValueAccessor` on `UiSegmentedControl` for Reactive Forms integration
- [ ] Implement animated sliding indicator that tracks the active segment position and width
- [ ] Implement roving tabindex keyboard navigation (ArrowLeft, ArrowRight, Home, End, Space, Enter)
- [ ] Support disabled state for the entire control and for individual segments
- [ ] Support size variants (`sm`, `md`, `lg`) and full-width mode
- [ ] Add CSS custom properties for theming and RTL support
- [ ] Write unit tests covering selection, CVA, keyboard navigation, disabled states, and indicator positioning
- [ ] Export components from `libs/ui/src/index.ts`
