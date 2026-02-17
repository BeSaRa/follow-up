# 39 — OTP Input Component

| Status    | Date       |
|-----------|------------|
| Created   | 2026-02-17 |
| Started   | —          |
| Completed | —          |

---

## Description

A one-time password (OTP) input component that renders a configurable number of individual input fields. Each field accepts a single character, and the component auto-advances focus as the user types. It supports paste distribution, backspace navigation, numeric-only and alphanumeric modes, masked display, and integrates with Angular Reactive Forms via `ControlValueAccessor`. When all fields are filled, the component emits the complete OTP string through a `completed` output.

## API Design

### Components & Directives

| Name           | Type      | Selector        | Description                                      |
|----------------|-----------|-----------------|--------------------------------------------------|
| `UiOtpInput`   | Component | `ui-otp-input`  | OTP input with configurable digit fields and CVA  |

### Inputs & Outputs

| Name        | Kind     | Type                          | Default     | Description                                              |
|-------------|----------|-------------------------------|-------------|----------------------------------------------------------|
| `length`    | `input`  | `number`                      | `6`         | Number of OTP character fields to render                 |
| `type`      | `input`  | `'numeric' \| 'alphanumeric'` | `'numeric'` | Restricts input to digits only or allows letters too     |
| `masked`    | `input`  | `boolean`                     | `false`     | When true, displays dots instead of entered characters   |
| `disabled`  | `input`  | `boolean`                     | `false`     | Disables all input fields                                |
| `value`     | `model`  | `string`                      | `''`        | Two-way bound OTP value (combined string of all fields)  |
| `completed` | `output` | `string`                      | —           | Emits the full OTP string when all fields are filled     |

### Types

```typescript
type OtpInputType = 'numeric' | 'alphanumeric'
```

### Usage Examples

**Basic numeric OTP (6 digits):**

```html
<ui-otp-input />
```

**Custom length with alphanumeric mode:**

```html
<ui-otp-input [length]="4" type="alphanumeric" />
```

**Masked mode with completion handler:**

```html
<ui-otp-input [masked]="true" (completed)="onOtpComplete($event)" />
```

**With Reactive Forms:**

```typescript
@Component({
  template: `
    <form [formGroup]="form">
      <ui-otp-input formControlName="otp" [length]="6" (completed)="submit()" />
    </form>
  `,
})
export class VerificationComponent {
  form = inject(FormBuilder).group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  })

  submit() {
    console.log(this.form.value.otp)
  }
}
```

**Two-way binding with model:**

```html
<ui-otp-input [(value)]="otpCode" />
```

**Disabled and error states:**

```html
<ui-otp-input [disabled]="isLoading()" [class.ui-otp-input--error]="hasError()" />
```

## Behavior

- **Auto-advance:** When a character is entered in a field, focus automatically moves to the next empty field.
- **Backspace navigation:** Pressing Backspace in an empty field moves focus to the previous field and clears it. Pressing Backspace in a field with a value clears that field.
- **Delete key:** Clears the current field without moving focus.
- **Arrow keys:** Left/Right arrow keys move focus between fields without altering values.
- **Paste support:** Pasting a string distributes characters across fields starting from the currently focused field. Excess characters are ignored. Characters that do not match the current `type` mode are filtered out.
- **Input filtering:** In `numeric` mode, only digits (`0-9`) are accepted. In `alphanumeric` mode, digits and letters (`a-z`, `A-Z`, `0-9`) are accepted. Invalid characters are silently rejected.
- **Completion:** When all fields are filled, the `completed` output emits the full OTP string. This fires each time the OTP becomes fully filled (not on every keystroke).
- **CVA integration:** The combined string of all fields is the form control value. An empty or partially filled OTP produces a partial string. `setDisabledState` toggles the `disabled` input. `writeValue` distributes incoming string characters across fields.
- **Masked mode:** When `masked` is true, each field uses `type="password"` so characters are displayed as dots or bullets by the browser.
- **Focus management:** Clicking on the component focuses the first empty field, or the last field if all are filled.

## Accessibility

- Each individual input field has `aria-label="OTP digit N of M"` (e.g., "OTP digit 3 of 6").
- The component wrapper has `role="group"` with `aria-label="One-time password input"`.
- The `inputmode` attribute is set to `"numeric"` when `type` is `'numeric'`, and `"text"` when `type` is `'alphanumeric'`.
- The `autocomplete` attribute is set to `"one-time-code"` on the first field.
- Disabled fields have the native `disabled` attribute applied.
- Error state is communicated via `aria-invalid="true"` on each field when the form control is invalid and touched.
- Focus is clearly visible with a focus ring on the active field.
- Must pass all AXE checks and meet WCAG AA requirements for focus management and color contrast.

## Styling

- BEM naming: `ui-otp-input` (block), `ui-otp-input__field` (element), `ui-otp-input--error` / `ui-otp-input--disabled` / `ui-otp-input--masked` (modifiers).
- Fields are rendered in a horizontal row with consistent gap spacing.
- Each field is a square box with centered text.
- Focus state: visible outline or border change on the active field.
- Error state: border color changes to indicate error (applied via host class or form control state).
- Disabled state: reduced opacity and `cursor: not-allowed`.
- The component uses CSS custom properties for theming:
  - `--ui-otp-field-size` — width and height of each field (default `48px`)
  - `--ui-otp-gap` — gap between fields (default `8px`)
  - `--ui-otp-border-color` — default border color
  - `--ui-otp-focus-border-color` — border color on focus
  - `--ui-otp-error-border-color` — border color on error
  - `--ui-otp-font-size` — font size of input characters
  - `--ui-otp-border-radius` — border radius of each field

## File Structure

```
libs/ui/src/lib/otp-input/
├── otp-input.ts          # UiOtpInput component (single-file: template, styles, logic)
└── otp-input.spec.ts     # Unit tests

libs/ui/src/index.ts       # Public API — add UiOtpInput export
```

## Deliverables

- [ ] Create `UiOtpInput` component in `libs/ui/src/lib/otp-input/otp-input.ts`
- [ ] Implement configurable `length` input with default of 6 fields
- [ ] Implement `numeric` and `alphanumeric` input type modes
- [ ] Implement auto-advance focus on character entry
- [ ] Implement backspace navigation to previous field
- [ ] Implement paste support with character distribution across fields
- [ ] Implement `ControlValueAccessor` for Reactive Forms integration
- [ ] Implement `model()` two-way binding for `value`
- [ ] Implement `completed` output that emits when all fields are filled
- [ ] Implement masked mode (show dots instead of characters)
- [ ] Implement disabled state
- [ ] Implement error state styling
- [ ] Add accessibility attributes (`role`, `aria-label`, `inputmode`, `autocomplete`)
- [ ] Style with BEM conventions and CSS custom properties
- [ ] Write unit tests in `libs/ui/src/lib/otp-input/otp-input.spec.ts`
- [ ] Export `UiOtpInput` from `libs/ui/src/index.ts`
- [ ] Verify lint passes with `nx lint ui`
- [ ] Verify tests pass with `nx test ui`
