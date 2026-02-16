import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'

import { UiCalendar } from './calendar'
import { formatDate, parseDate } from './date-utils'

const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
]

let nextId = 0

// ── UiDatePickerInput ─────────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiDatePickerInput]',
  host: {
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'pickerRef?.isOpen()',
    '[attr.aria-controls]': 'pickerRef?.isOpen() ? pickerRef?.panelId : null',
    '[class]': 'hostClasses',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiDatePickerInput {
  readonly el: HTMLInputElement = inject(ElementRef).nativeElement

  // Injected by parent UiDatePicker after content init
  pickerRef: InstanceType<typeof UiDatePicker> | null = null

  protected readonly hostClasses =
    'flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm ' +
    'text-foreground placeholder:text-foreground-muted ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

  formatAndDisplay(date: Date | null) {
    this.el.value = formatDate(date)
  }

  protected onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value
    const parsed = parseDate(text)
    this.pickerRef?.onInputParsed(parsed)
  }

  protected onBlur() {
    const parsed = parseDate(this.el.value)
    this.formatAndDisplay(parsed)
    this.pickerRef?.markTouched()
  }

  protected onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault()
      this.pickerRef?.open()
    }
    if (event.key === 'Escape' && this.pickerRef?.isOpen()) {
      event.preventDefault()
      event.stopPropagation()
      this.pickerRef?.close()
    }
  }
}

// ── UiDatePickerToggle ────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-date-picker-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center',
  },
  template: `
    <button
      type="button"
      class="inline-flex size-9 items-center justify-center rounded-md text-foreground-muted
             hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
      [disabled]="disabled()"
      aria-label="Toggle calendar"
      (click)="onClick()"
    >
      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </button>
  `,
})
export class UiDatePickerToggle {
  readonly disabled = input(false, { transform: booleanAttribute })

  // Set by parent picker via contentChild
  pickerRef: { toggle(): void } | null = null

  protected onClick() {
    this.pickerRef?.toggle()
  }
}

// ── UiDatePicker ──────────────────────────────────────────────────────

@Component({
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, UiCalendar],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePicker),
      multi: true,
    },
  ],
  host: {
    class: 'inline-block',
  },
  template: `
    <div
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="relative inline-flex items-center"
    >
      <ng-content select="input[uiDatePickerInput]" />
      <ng-content select="ui-date-picker-toggle" />
    </div>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayOffsetY]="4"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onOverlayKeydown($event)"
      (detach)="close()"
    >
      <div
        role="dialog"
        [id]="panelId"
        aria-modal="true"
        aria-label="Choose date"
        class="rounded-md border border-border bg-surface-raised p-3 shadow-md ui-datepicker-panel"
      >
        <ui-calendar
          [selected]="value()"
          [min]="min()"
          [max]="max()"
          [dateFilter]="dateFilter()"
          [startAt]="startAt()"
          (selectedChange)="onDateSelected($event)"
        />
      </div>
    </ng-template>
  `,
  styles: `
    .ui-datepicker-panel {
      animation: ui-datepicker-enter 100ms ease-out;
    }
    @keyframes ui-datepicker-enter {
      from { opacity: 0; transform: scale(0.95); }
    }
  `,
})
export class UiDatePicker implements ControlValueAccessor {
  readonly value = model<Date | null>(null)
  readonly placeholder = input('MM/DD/YYYY')
  readonly min = input<Date | null>(null)
  readonly max = input<Date | null>(null)
  readonly dateFilter = input<((date: Date) => boolean) | null>(null)
  readonly startAt = input<Date | null>(null)
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly panelId = `ui-datepicker-panel-${nextId++}`
  readonly isOpen = signal(false)

  protected readonly positions = PANEL_POSITIONS

  private readonly triggerRef = viewChild<CdkOverlayOrigin>('trigger')
  private readonly inputDirective = contentChild(UiDatePickerInput)
  private readonly toggleDirective = contentChild(UiDatePickerToggle)

  private onChange: (value: Date | null) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private cvaTouched = false

  constructor() {
    // Wire the input directive to this picker
    effect(() => {
      const inputDir = this.inputDirective()
      if (inputDir) {
        inputDir.pickerRef = this
      }
    })

    // Wire the toggle to this picker
    effect(() => {
      const toggle = this.toggleDirective()
      if (toggle) {
        toggle.pickerRef = this
      }
    })

    // Sync display when value changes
    effect(() => {
      const val = this.value()
      const inputDir = this.inputDirective()
      inputDir?.formatAndDisplay(val)
    })
  }

  open() {
    if (this.disabled()) return
    this.isOpen.set(true)
  }

  close() {
    this.isOpen.set(false)
    this.markTouched()
    // Restore focus to input
    requestAnimationFrame(() => {
      this.inputDirective()?.el.focus()
    })
  }

  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  markTouched() {
    if (!this.cvaTouched) {
      this.onTouched()
      this.cvaTouched = true
    }
  }

  onInputParsed(date: Date | null) {
    this.value.set(date)
    this.onChange(date)
  }

  protected onDateSelected(date: Date | null) {
    if (!date) return
    this.value.set(date)
    this.onChange(date)
    this.close()
  }

  protected onOutsideClick(event: MouseEvent) {
    const triggerEl = this.triggerRef()?.elementRef?.nativeElement
    if (triggerEl?.contains(event.target as Node)) return
    this.close()
  }

  protected onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      this.close()
    }
  }

  // ── ControlValueAccessor ────────────────────────────────────────────

  writeValue(value: Date | null) {
    this.value.set(value)
  }

  registerOnChange(fn: (value: Date | null) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
