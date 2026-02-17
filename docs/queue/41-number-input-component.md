# 41 — Number Input Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A numeric input component that provides increment/decrement buttons, keyboard controls, hold-to-repeat acceleration, and formatted display. The component implements `ControlValueAccessor` for seamless integration with Angular Reactive Forms. It supports configurable min/max/step bounds, multiple sizes, disabled and readonly states, prefix/suffix text, value clamping on blur, and an optional thousands separator.

## API Design

### Components & Directives

| Name            | Type      | Selector          | Description                                      |
|-----------------|-----------|-------------------|--------------------------------------------------|
| `UiNumberInput` | Component | `ui-number-input` | Numeric input with increment/decrement controls   |

### Inputs & Outputs

| Name          | Kind       | Type                   | Default     | Description                                         |
|---------------|------------|------------------------|-------------|-----------------------------------------------------|
| `value`       | `model()`  | `number \| null`       | `null`      | Two-way bound numeric value                         |
| `min`         | `input()`  | `number`               | `-Infinity` | Minimum allowed value                               |
| `max`         | `input()`  | `number`               | `Infinity`  | Maximum allowed value                               |
| `step`        | `input()`  | `number`               | `1`         | Increment/decrement step size                       |
| `size`        | `input()`  | `'sm' \| 'md' \| 'lg'` | `'md'`      | Component size variant                              |
| `placeholder` | `input()`  | `string`               | `''`        | Placeholder text for the input                      |
| `disabled`    | `input()`  | `boolean`              | `false`     | Whether the input is disabled                       |
| `readonly`    | `input()`  | `boolean`              | `false`     | Whether the input is readonly (no buttons shown)    |
| `prefix`      | `input()`  | `string`               | `''`        | Prefix text displayed before the input value        |
| `suffix`      | `input()`  | `string`               | `''`        | Suffix text displayed after the input value         |
| `formatThousands` | `input()` | `boolean`           | `false`     | Whether to format value with thousands separators   |

### Types

```typescript
type NumberInputSize = 'sm' | 'md' | 'lg'
```

### Usage Examples

#### Basic usage

```html
<ui-number-input [(value)]="quantity" />
```

#### With min, max, and step

```html
<ui-number-input
  [(value)]="quantity"
  [min]="0"
  [max]="100"
  [step]="5"
/>
```

#### With Reactive Forms

```html
<ui-number-input
  [formControl]="priceControl"
  [min]="0"
  [max]="9999"
  [step]="0.01"
  prefix="$"
  [formatThousands]="true"
/>
```

#### Different sizes

```html
<ui-number-input [(value)]="small" size="sm" />
<ui-number-input [(value)]="medium" size="md" />
<ui-number-input [(value)]="large" size="lg" />
```

#### With prefix and suffix

```html
<ui-number-input [(value)]="weight" suffix="kg" />
<ui-number-input [(value)]="price" prefix="$" suffix="USD" />
```

#### Disabled and readonly

```html
<ui-number-input [(value)]="locked" [disabled]="true" />
<ui-number-input [(value)]="display" [readonly]="true" />
```

## Behavior

### Increment / Decrement

- Clicking the **+** button increments the value by `step`
- Clicking the **−** button decrements the value by `step`
- If the resulting value would exceed `max` or go below `min`, clamp to the boundary
- Buttons are visually disabled when the value is at the corresponding boundary

### Hold-to-Repeat

- Pressing and holding a button triggers repeated increment/decrement
- Initial delay: 400ms before repeating starts
- Repeat interval starts at 150ms and accelerates to 50ms over successive repeats
- Releasing the button (mouseup / mouseleave / touchend) stops repeating

### Keyboard

- **ArrowUp**: increment by `step`
- **ArrowDown**: decrement by `step`
- **Home**: set value to `min` (if finite)
- **End**: set value to `max` (if finite)
- Direct typing is allowed; non-numeric characters (except `-` and `.`) are rejected

### Blur Clamping

- On blur, clamp the current value to `[min, max]`
- If the input is empty, set value to `null`
- If the input contains an invalid number, revert to the previous valid value

### Formatted Display

- When `formatThousands` is `true`, the displayed value uses locale-appropriate thousands separators (e.g., `1,234,567`)
- The raw numeric value is preserved internally and emitted through the form control
- While the input is focused, formatting is removed to allow easy editing

### Disabled State

- All user interaction is blocked (buttons, keyboard, typing)
- The component receives `ui-number-input--disabled` CSS class

### Readonly State

- Increment/decrement buttons are hidden
- Keyboard shortcuts are disabled
- The input displays the value but does not allow editing

## Accessibility

- The inner `<input>` has `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes
- Increment button has `aria-label="Increase value"`
- Decrement button has `aria-label="Decrease value"`
- When disabled, `aria-disabled="true"` is set on the host
- When readonly, `aria-readonly="true"` is set on the input
- Focus is managed so the inner input receives focus when the host is clicked
- Buttons are `tabindex="-1"` to keep a single tab stop on the input
- Color contrast meets WCAG AA minimums for all size variants
- Must pass all AXE checks

## Styling

- Host element uses `display: inline-flex` layout
- CSS custom properties for theming:
  - `--ui-number-input-border-color`
  - `--ui-number-input-border-radius`
  - `--ui-number-input-bg`
  - `--ui-number-input-text-color`
  - `--ui-number-input-button-bg`
  - `--ui-number-input-button-hover-bg`
  - `--ui-number-input-focus-ring-color`
  - `--ui-number-input-disabled-opacity`
- Size variants control height, font-size, and button dimensions:
  - `sm`: compact (height ~28px)
  - `md`: default (height ~36px)
  - `lg`: large (height ~44px)
- Buttons are placed on the right side of the input (stacked vertically: increment on top, decrement on bottom)
- Prefix and suffix text are rendered inline within the input container with muted styling

## File Structure

```
libs/ui/src/lib/number-input/
├── number-input.ts          # Component, types, CVA logic (single file)
└── number-input.spec.ts     # Unit tests
```

Exported from `libs/ui/src/index.ts`.

## Deliverables

- [ ] Create `UiNumberInput` component in `libs/ui/src/lib/number-input/number-input.ts`
- [ ] Implement signal-based inputs (`input()`, `model()`) with `ChangeDetectionStrategy.OnPush`
- [ ] Implement `ControlValueAccessor` for Reactive Forms integration
- [ ] Add increment/decrement buttons with min/max boundary enforcement
- [ ] Implement hold-to-repeat with accelerating interval
- [ ] Add keyboard support (ArrowUp, ArrowDown, Home, End)
- [ ] Support `size` variants (`sm`, `md`, `lg`)
- [ ] Support `disabled` and `readonly` states
- [ ] Support `prefix` and `suffix` text
- [ ] Implement value clamping on blur
- [ ] Implement optional thousands separator formatting (`formatThousands`)
- [ ] Add accessibility attributes (`role="spinbutton"`, ARIA labels, focus management)
- [ ] Write unit tests in `libs/ui/src/lib/number-input/number-input.spec.ts`
- [ ] Export component from `libs/ui/src/index.ts`
