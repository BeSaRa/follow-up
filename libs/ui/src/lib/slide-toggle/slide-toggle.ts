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

export type SlideToggleSize = 'sm' | 'md'
export type SlideToggleLabelPosition = 'before' | 'after'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-slide-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSlideToggle),
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
      role="switch"
      tabindex="0"
      [class]="trackClasses()"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="disabled() || null"
    >
      <span [class]="thumbClasses()"></span>
    </span>
    <span class="text-sm text-foreground select-none"><ng-content /></span>
  `,
})
export class UiSlideToggle implements ControlValueAccessor {
  readonly checked = model(false)
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly size = input<SlideToggleSize>('md')
  readonly labelPosition = input<SlideToggleLabelPosition>('after')

  private readonly cvaTouched = signal(false)
  private onChange: (value: boolean) => void = () => {
    /* empty */
  }
  private onTouched: () => void = () => {
    /* empty */
  }

  protected readonly trackClasses = computed(() => {
    const isOn = this.checked()
    const s = this.size()

    const base = 'relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    const sizeClass = s === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
    const colorClass = isOn ? 'bg-primary' : 'bg-border'

    return `${base} ${sizeClass} ${colorClass}`
  })

  protected readonly thumbClasses = computed(() => {
    const isOn = this.checked()
    const s = this.size()

    const base = 'pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform duration-200'
    const sizeClass = s === 'sm' ? 'size-4' : 'size-5'
    const margin = 'mt-0.5 ms-0.5'

    let translate: string
    if (s === 'sm') {
      translate = isOn ? 'ltr:translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
    } else {
      translate = isOn ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
    }

    return `${base} ${sizeClass} ${margin} ${translate}`
  })

  toggle() {
    if (this.disabled()) return
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
  }

  registerOnChange(fn: (value: boolean) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
