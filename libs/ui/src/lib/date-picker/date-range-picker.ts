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
  signal,
  viewChild,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay'

import { UiCalendar } from './calendar'
import { UiDatePickerToggle } from './date-picker'
import { formatDate, isDateBefore, parseDate } from './date-utils'

export interface DateRange {
  start: Date | null
  end: Date | null
}

const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
]

let nextId = 0

const INPUT_CLASSES =
  'flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm ' +
  'text-foreground placeholder:text-foreground-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

// ── UiDateRangeStartInput ─────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiDateRangeStart]',
  host: {
    '[class]': 'hostClasses',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiDateRangeStartInput {
  readonly el: HTMLInputElement = inject(ElementRef).nativeElement
  protected readonly hostClasses = INPUT_CLASSES

  pickerRef: InstanceType<typeof UiDateRangePicker> | null = null

  formatAndDisplay(date: Date | null) {
    this.el.value = formatDate(date)
  }

  protected onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value
    const parsed = parseDate(text)
    this.pickerRef?.onStartInputParsed(parsed)
  }

  protected onBlur() {
    const parsed = parseDate(this.el.value)
    this.formatAndDisplay(parsed)
    this.pickerRef?.markTouched()
  }

  protected onFocus() {
    this.pickerRef?.setActivePiece('start')
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

// ── UiDateRangeEndInput ───────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[uiDateRangeEnd]',
  host: {
    '[class]': 'hostClasses',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class UiDateRangeEndInput {
  readonly el: HTMLInputElement = inject(ElementRef).nativeElement
  protected readonly hostClasses = INPUT_CLASSES

  pickerRef: InstanceType<typeof UiDateRangePicker> | null = null

  formatAndDisplay(date: Date | null) {
    this.el.value = formatDate(date)
  }

  protected onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value
    const parsed = parseDate(text)
    this.pickerRef?.onEndInputParsed(parsed)
  }

  protected onBlur() {
    const parsed = parseDate(this.el.value)
    this.formatAndDisplay(parsed)
    this.pickerRef?.markTouched()
  }

  protected onFocus() {
    this.pickerRef?.setActivePiece('end')
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

// ── UiDateRangePicker ─────────────────────────────────────────────────

@Component({
  imports: [CdkConnectedOverlay, CdkOverlayOrigin, UiCalendar],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDateRangePicker),
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
      <ng-content select="input[uiDateRangeStart]" />
      <span class="px-1 text-foreground-muted text-sm">&ndash;</span>
      <ng-content select="input[uiDateRangeEnd]" />
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
        aria-label="Choose date range"
        class="rounded-md border border-border bg-surface-raised p-3 shadow-md ui-daterange-panel"
      >
        <ui-calendar
          [startDate]="rangeStart()"
          [endDate]="rangeEnd()"
          [min]="min()"
          [max]="max()"
          [dateFilter]="dateFilter()"
          (selectedChange)="onDateSelected($event)"
        />
      </div>
    </ng-template>
  `,
  styles: `
    .ui-daterange-panel {
      animation: ui-daterange-enter 100ms ease-out;
    }
    @keyframes ui-daterange-enter {
      from { opacity: 0; transform: scale(0.95); }
    }
  `,
})
export class UiDateRangePicker implements ControlValueAccessor {
  readonly min = input<Date | null>(null)
  readonly max = input<Date | null>(null)
  readonly dateFilter = input<((date: Date) => boolean) | null>(null)
  readonly disabled = input(false, { transform: booleanAttribute })

  readonly rangeStart = signal<Date | null>(null)
  readonly rangeEnd = signal<Date | null>(null)
  readonly activePiece = signal<'start' | 'end'>('start')
  readonly isOpen = signal(false)

  readonly panelId = `ui-daterange-panel-${nextId++}`
  protected readonly positions = PANEL_POSITIONS

  private readonly triggerRef = viewChild<CdkOverlayOrigin>('trigger')
  private readonly startInput = contentChild(UiDateRangeStartInput)
  private readonly endInput = contentChild(UiDateRangeEndInput)
  private readonly toggleDirective = contentChild(UiDatePickerToggle)

  private onChange: (value: DateRange | null) => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
  private cvaTouched = false

  constructor() {
    // Wire input directives to this picker
    effect(() => {
      const startDir = this.startInput()
      if (startDir) startDir.pickerRef = this
    })
    effect(() => {
      const endDir = this.endInput()
      if (endDir) endDir.pickerRef = this
    })
    // Wire toggle to this picker
    effect(() => {
      const toggle = this.toggleDirective()
      if (toggle) toggle.pickerRef = this
    })

    // Sync start input display
    effect(() => {
      const val = this.rangeStart()
      this.startInput()?.formatAndDisplay(val)
    })

    // Sync end input display
    effect(() => {
      const val = this.rangeEnd()
      this.endInput()?.formatAndDisplay(val)
    })
  }

  open() {
    if (this.disabled()) return
    this.isOpen.set(true)
  }

  close() {
    this.isOpen.set(false)
    this.markTouched()
    // Restore focus to start input
    requestAnimationFrame(() => {
      this.startInput()?.el.focus()
    })
  }

  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  setActivePiece(piece: 'start' | 'end') {
    this.activePiece.set(piece)
  }

  markTouched() {
    if (!this.cvaTouched) {
      this.onTouched()
      this.cvaTouched = true
    }
  }

  onStartInputParsed(date: Date | null) {
    this.rangeStart.set(date)
    this.emitValue()
  }

  onEndInputParsed(date: Date | null) {
    this.rangeEnd.set(date)
    this.emitValue()
  }

  protected onDateSelected(date: Date | null) {
    if (!date) return
    if (this.activePiece() === 'start') {
      this.rangeStart.set(date)
      this.rangeEnd.set(null)
      this.activePiece.set('end')
      // Stay open — user still needs to pick end
    } else {
      const start = this.rangeStart()
      if (start && isDateBefore(date, start)) {
        // Swap if end is before start
        this.rangeEnd.set(start)
        this.rangeStart.set(date)
      } else {
        this.rangeEnd.set(date)
      }
      this.activePiece.set('start')
      this.emitValue()
      this.close()
    }
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

  private emitValue() {
    this.onChange({
      start: this.rangeStart(),
      end: this.rangeEnd(),
    })
  }

  // ── ControlValueAccessor ────────────────────────────────────────────

  writeValue(value: DateRange | null) {
    this.rangeStart.set(value?.start ?? null)
    this.rangeEnd.set(value?.end ?? null)
  }

  registerOnChange(fn: (value: DateRange | null) => void) {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }
}
