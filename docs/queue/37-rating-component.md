# 37 — Rating Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A Rating component for the Angular UI library that allows users to select a star-based rating value. Supports interactive and read-only modes, half-star precision, configurable maximum stars, custom icon support, hover preview, and full Reactive Forms integration via ControlValueAccessor. Built with signal-based APIs (`input()`, `output()`, `model()`), `ChangeDetectionStrategy.OnPush`, and comprehensive keyboard navigation.

## API Design

### Components & Directives

| Name       | Type      | Selector    | Description                                      |
|------------|-----------|-------------|--------------------------------------------------|
| `UiRating` | Component | `ui-rating` | Star-based rating component with CVA integration |

### Inputs & Outputs

| Member        | Kind     | Type                   | Default | Description                                                  |
|---------------|----------|------------------------|---------|--------------------------------------------------------------|
| `max`         | `input`  | `number`               | `5`     | Maximum number of stars                                      |
| `size`        | `input`  | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant of the rating stars                             |
| `readonly`    | `input`  | `boolean`              | `false` | When true, disables interaction and removes hover preview    |
| `allowHalf`   | `input`  | `boolean`              | `false` | When true, allows half-star precision (0.5 increments)       |
| `value`       | `model`  | `number`               | `0`     | Two-way bound rating value                                   |
| `valueChange` | `output` | `number`               | —       | Emitted when the rating value changes (implicit from model)  |

### Types

```typescript
type RatingSize = 'sm' | 'md' | 'lg'

interface RatingIcon {
  filled: string   // SVG path or template for a filled star
  half: string     // SVG path or template for a half-filled star
  empty: string    // SVG path or template for an empty star
}
```

### Usage Examples

**Basic usage:**

```html
<ui-rating [(value)]="rating" />
```

**Read-only with half-star precision:**

```html
<ui-rating [value]="3.5" [readonly]="true" [allowHalf]="true" />
```

**Custom max and size:**

```html
<ui-rating [(value)]="rating" [max]="10" size="lg" />
```

**With Reactive Forms:**

```html
<ui-rating [formControl]="ratingControl" [allowHalf]="true" />
```

```typescript
ratingControl = new FormControl(3)
```

**In a form group:**

```html
<form [formGroup]="form">
  <ui-rating formControlName="rating" size="sm" />
</form>
```

## Behavior

### Interaction
- Clicking a star sets the value to that star's position (1-indexed)
- When `allowHalf` is true, clicking on the left half of a star sets a `.5` value, and the right half sets the full value
- Hovering over stars shows a preview highlight up to the hovered position
- Moving the mouse away from the component restores the actual value display
- When `readonly` is true, no hover preview is shown and clicks are ignored
- Clicking the current value again resets it to 0 (toggle-off behavior)

### Keyboard Navigation
- **ArrowRight / ArrowUp**: Increment value by 1 (or 0.5 if `allowHalf` is true)
- **ArrowLeft / ArrowDown**: Decrement value by 1 (or 0.5 if `allowHalf` is true)
- **Home**: Set value to 0
- **End**: Set value to `max`
- Value is clamped between 0 and `max`

### ControlValueAccessor
- Implements `ControlValueAccessor` to integrate with Angular Reactive Forms and Template-driven Forms
- Responds to `setDisabledState` by treating disabled as equivalent to readonly
- Calls `onChange` and `onTouched` callbacks appropriately
- Marks as touched on blur

## Accessibility

- The component uses `role="slider"` to convey its purpose to assistive technologies
- `aria-valuemin="0"`, `aria-valuemax` bound to `max`, `aria-valuenow` bound to current value
- `aria-valuetext` provides a human-readable description (e.g., "3 out of 5 stars")
- `aria-label` defaults to "Rating" and can be overridden via `attr.aria-label`
- `aria-readonly="true"` is set when in readonly mode
- `aria-disabled="true"` is set when the form control is disabled
- `tabindex="0"` when interactive, `tabindex="-1"` when disabled
- Individual stars are `aria-hidden="true"` since the slider role on the host handles the semantics
- Focus is visible with a clear outline ring
- Must pass all AXE checks and meet WCAG AA minimums for color contrast and focus management

## Styling

### CSS Custom Properties

| Property                        | Default          | Description                              |
|---------------------------------|------------------|------------------------------------------|
| `--ui-rating-color-filled`      | `#f59e0b`        | Color of filled stars (amber)            |
| `--ui-rating-color-empty`       | `#d1d5db`        | Color of empty stars (gray-300)          |
| `--ui-rating-color-hover`       | `#fbbf24`        | Color of stars during hover preview      |
| `--ui-rating-color-disabled`    | `#9ca3af`        | Color of stars when disabled/readonly    |
| `--ui-rating-gap`               | `0.25rem`        | Gap between stars                        |
| `--ui-rating-transition`        | `150ms ease`     | Transition duration for color changes    |

### Size Variants

| Size | Star Dimension |
|------|----------------|
| `sm` | `1rem` (16px)  |
| `md` | `1.5rem` (24px)|
| `lg` | `2rem` (32px)  |

### Host Styles
- Uses `:host` display `inline-flex` with `align-items: center`
- Cursor is `pointer` when interactive, `default` when readonly/disabled
- Focus outline uses a visible ring on `:host(:focus-visible)`

## File Structure

```
libs/ui/src/lib/rating/
├── rating.ts          # Component, types, and CVA implementation (single file)
└── rating.spec.ts     # Unit tests

libs/ui/src/index.ts   # Re-export UiRating
```

## Deliverables

- [ ] Create `UiRating` component in `libs/ui/src/lib/rating/rating.ts` with signal-based inputs, model signal, OnPush change detection, and inline template/styles
- [ ] Implement ControlValueAccessor for Reactive Forms integration
- [ ] Implement half-star precision support via `allowHalf` input
- [ ] Implement hover preview with highlight up to hovered star position
- [ ] Implement keyboard navigation (Arrow keys, Home, End)
- [ ] Implement size variants (`sm`, `md`, `lg`) with CSS custom properties for color customization
- [ ] Implement readonly and disabled states
- [ ] Implement default filled/empty/half star SVG icons
- [ ] Add ARIA attributes (`role="slider"`, `aria-valuenow`, `aria-valuetext`, etc.) and ensure AXE/WCAG AA compliance
- [ ] Write unit tests in `libs/ui/src/lib/rating/rating.spec.ts`
- [ ] Export `UiRating` from `libs/ui/src/index.ts`
- [ ] Add logger statement in `libs/core/src/index.ts` if core library is modified
