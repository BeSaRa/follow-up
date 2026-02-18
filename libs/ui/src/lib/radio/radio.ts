import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export type RadioSize = 'sm' | 'md'
export type RadioLabelPosition = 'before' | 'after'
export type RadioOrientation = 'horizontal' | 'vertical'

let nextGroupId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '(click)': 'select()',
    '(keydown.space)': '$event.preventDefault(); select()',
    '(keydown.enter)': 'select()',
  },
  template: `
    <span
      role="radio"
      [tabindex]="tabIndex()"
      [class]="circleClasses()"
      [attr.aria-checked]="isSelected()"
      [attr.aria-disabled]="isDisabled() || null"
    >
      @if (isSelected()) {
        <span [class]="dotClasses()"></span>
      }
    </span>
    <span class="text-sm text-foreground select-none"><ng-content /></span>
  `,
})
export class UiRadioButton {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = input.required<any>()
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly size = input<RadioSize>('md')
  readonly labelPosition = input<RadioLabelPosition>('after')

  private readonly group = inject(forwardRef(() => UiRadioGroup))
  private readonly el = inject(ElementRef)

  readonly isSelected = computed(() => this.group.value() === this.value())

  readonly isDisabled = computed(() => this.disabled() || this.group.disabled())

  readonly tabIndex = computed(() => {
    if (this.isDisabled()) return -1
    const groupValue = this.group.value()
    const radios = this.group.enabledRadios()
    if (groupValue != null) {
      return this.isSelected() ? 0 : -1
    }
    return radios.length > 0 && radios[0] === this ? 0 : -1
  })

  protected readonly hostClasses = computed(() => {
    const base = 'inline-flex items-center gap-2 cursor-pointer'
    const disabledClass = this.isDisabled() ? ' pointer-events-none opacity-50' : ''
    const reverseClass = this.labelPosition() === 'before' ? ' flex-row-reverse' : ''
    return `${base}${disabledClass}${reverseClass}`
  })

  protected readonly circleClasses = computed(() => {
    const s = this.size()
    const selected = this.isSelected()

    const base = 'inline-flex items-center justify-center shrink-0 rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
    const sizeClass = s === 'sm' ? 'size-4' : 'size-5'
    const colorClass = selected
      ? 'border-2 border-primary bg-transparent'
      : 'border-2 border-border bg-transparent'

    return `${base} ${sizeClass} ${colorClass}`
  })

  protected readonly dotClasses = computed(() => {
    const s = this.size()
    return `block rounded-full bg-primary ${s === 'sm' ? 'size-2' : 'size-2.5'}`
  })

  select() {
    if (this.isDisabled()) return
    this.group.selectValue(this.value())
  }

  focus() {
    this.el.nativeElement.querySelector('[role="radio"]')?.focus()
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRadioGroup),
      multi: true,
    },
  ],
  host: {
    role: 'radiogroup',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '(keydown)': 'onKeydown($event)',
  },
  template: `<ng-content />`,
})
export class UiRadioGroup implements ControlValueAccessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(null)
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly name = input(`ui-radio-group-${nextGroupId++}`)
  readonly orientation = input<RadioOrientation>('vertical')

  readonly radios = contentChildren(UiRadioButton)

  private readonly cvaTouched = signal(false)
  private onChange: (value: unknown) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

  readonly enabledRadios = computed(() =>
    this.radios().filter(r => !r.isDisabled()),
  )

  protected readonly hostClasses = computed(() => {
    const o = this.orientation()
    return o === 'horizontal'
      ? 'inline-flex flex-wrap items-center gap-4'
      : 'flex flex-col gap-2'
  })

  selectValue(val: unknown) {
    this.value.set(val)
    this.onChange(val)
    if (!this.cvaTouched()) {
      this.onTouched()
      this.cvaTouched.set(true)
    }
  }

  protected onKeydown(event: KeyboardEvent) {
    const enabled = this.enabledRadios()
    if (!enabled.length) return

    let delta = 0
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        delta = 1
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        delta = -1
        break
      default:
        return
    }

    event.preventDefault()

    const currentIdx = enabled.findIndex(r => r.isSelected())
    let nextIdx: number
    if (currentIdx === -1) {
      nextIdx = delta === 1 ? 0 : enabled.length - 1
    } else {
      nextIdx = currentIdx + delta
      if (nextIdx < 0) nextIdx = enabled.length - 1
      if (nextIdx >= enabled.length) nextIdx = 0
    }

    enabled[nextIdx].select()
    enabled[nextIdx].focus()
  }

  writeValue(value: unknown) {
    this.value.set(value)
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
