import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export type CheckboxSize = 'sm' | 'md'
export type CheckboxLabelPosition = 'before' | 'after'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckbox),
      multi: true,
    },
  ],
  host: {
    class: 'inline-flex items-center gap-2 cursor-pointer',
    '[class.pointer-events-none]': 'disabled()',
    '[class.opacity-50]': 'disabled()',
    '[class.flex-row-reverse]': 'labelPosition() === "before"',
    '(click)': 'toggle()',
    '(keydown.space)': '$event.preventDefault(); toggle()',
    '(keydown.enter)': 'toggle()',
  },
  template: `
    <span
      role="checkbox"
      tabindex="0"
      [class]="boxClasses()"
      [attr.aria-checked]="ariaChecked()"
      [attr.aria-disabled]="disabled() || null"
    >
      @if (indeterminate()) {
        <svg class="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      } @else if (checked()) {
        <svg class="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4,12 10,18 20,6" />
        </svg>
      }
    </span>
    <span class="text-sm text-foreground select-none"><ng-content /></span>
  `,
})
export class UiCheckbox implements ControlValueAccessor {
  readonly checked = model(false)
  readonly indeterminate = model(false)
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly size = input<CheckboxSize>('md')
  readonly labelPosition = input<CheckboxLabelPosition>('after')

  private readonly cvaTouched = signal(false)
  private onChange: (value: boolean) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

  protected readonly ariaChecked = computed(() => {
    if (this.indeterminate()) return 'mixed'
    return this.checked() ? 'true' : 'false'
  })

  protected readonly boxClasses = computed(() => {
    const isOn = this.checked()
    const isIndeterminate = this.indeterminate()
    const s = this.size()
    const filled = isOn || isIndeterminate

    const base = 'inline-flex items-center justify-center shrink-0 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    const sizeClass = s === 'sm' ? 'size-4' : 'size-5'
    const colorClass = filled
      ? 'bg-primary border-primary'
      : 'border-2 border-border bg-transparent'

    return `${base} ${sizeClass} ${colorClass}`
  })

  toggle() {
    if (this.disabled()) return

    if (this.indeterminate()) {
      this.indeterminate.set(false)
    }

    const next = !this.checked()
    this.checked.set(next)
    this.onChange(next)

    if (!this.cvaTouched()) {
      this.onTouched()
      this.cvaTouched.set(true)
    }
  }

  writeValue(value: boolean) {
    this.checked.set(!!value)
    this.indeterminate.set(false)
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
