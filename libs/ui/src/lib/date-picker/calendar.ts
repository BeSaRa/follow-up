import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core'

import {
  type CalendarCell,
  addMonths,
  addYears,
  createDate,
  formatDayAriaLabel,
  formatMonthYear,
  generateMonthGrid,
  getYearRange,
  isDateAfter,
  isDateBefore,
  isDateDisabled,
  isDateInRange,
  isSameDay,
  isSameMonth,
  MONTH_NAMES,
  WEEKDAY_HEADERS,
} from './date-utils'

export type CalendarView = 'days' | 'months' | 'years'

let nextCalendarId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block select-none',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between px-1 pb-2" dir="ltr">
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md text-foreground-muted
               hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-ring"
        [attr.aria-label]="prevButtonLabel()"
        (click)="navigatePrev()"
      >
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      <button
        type="button"
        class="text-sm font-medium text-foreground hover:bg-surface-hover rounded-md px-2 py-1
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        (click)="onHeaderClick()"
        [attr.aria-label]="headerAriaLabel()"
      >
        {{ headerLabel() }}
      </button>

      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md text-foreground-muted
               hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-ring"
        [attr.aria-label]="nextButtonLabel()"
        (click)="navigateNext()"
      >
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9,6 15,12 9,18" />
        </svg>
      </button>
    </div>

    <!-- Screen reader live region -->
    <div class="sr-only" aria-live="polite" role="status">
      {{ headerLabel() }}
    </div>

    @switch (activeView()) {
      @case ('days') {
        <div role="grid" [attr.aria-label]="monthYearLabel()" [id]="calendarId">
          <!-- Weekday headers -->
          <div role="row" class="grid grid-cols-7 text-center mb-1">
            @for (header of weekdayHeaders; track header.short) {
              <div role="columnheader"
                   class="text-xs font-medium text-foreground-muted py-1"
                   [attr.aria-label]="header.full">
                {{ header.short }}
              </div>
            }
          </div>

          <!-- Day grid -->
          @for (week of monthGrid(); track $index) {
            <div role="row" class="grid grid-cols-7">
              @for (cell of week; track cell.date.getTime()) {
                <button
                  type="button"
                  role="gridcell"
                  [class]="getDayCellClasses(cell)"
                  [attr.aria-label]="getDayAriaLabel(cell.date)"
                  [attr.aria-selected]="isCellSelected(cell.date)"
                  [attr.aria-disabled]="isCellDisabled(cell.date) || null"
                  [attr.aria-current]="cell.isToday ? 'date' : null"
                  [tabindex]="isCellFocused(cell.date) ? 0 : -1"
                  [disabled]="isCellDisabled(cell.date)"
                  (click)="onDateClick(cell.date)"
                  (mouseenter)="hoveredDate.set(cell.date)"
                  (mouseleave)="hoveredDate.set(null)"
                >
                  {{ cell.day }}
                </button>
              }
            </div>
          }
        </div>

        <!-- Today button -->
        <div class="flex justify-center pt-2 border-t border-border mt-2">
          <button
            type="button"
            class="text-xs text-primary hover:text-primary-hover font-medium px-2 py-1 rounded
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            (click)="goToToday()"
          >
            Today
          </button>
        </div>
      }

      @case ('months') {
        <div class="grid grid-cols-3 gap-1 p-2" role="grid" aria-label="Select month">
          @for (month of monthNames; track $index) {
            <button
              type="button"
              role="gridcell"
              [class]="getMonthCellClasses($index)"
              (click)="onMonthClick($index)"
            >
              {{ month }}
            </button>
          }
        </div>
      }

      @case ('years') {
        <div class="grid grid-cols-4 gap-1 p-2" role="grid" aria-label="Select year">
          @for (year of yearRange(); track year) {
            <button
              type="button"
              role="gridcell"
              [class]="getYearCellClasses(year)"
              (click)="onYearClick(year)"
            >
              {{ year }}
            </button>
          }
        </div>
      }
    }
  `,
})
export class UiCalendar {
  // ── Public API ──────────────────────────────────────────────────────

  readonly selected = model<Date | null>(null)
  readonly startDate = input<Date | null>(null)
  readonly endDate = input<Date | null>(null)
  readonly min = input<Date | null>(null)
  readonly max = input<Date | null>(null)
  readonly dateFilter = input<((date: Date) => boolean) | null>(null)
  readonly startAt = input<Date | null>(null)

  readonly monthChange = output<Date>()

  // ── Internal State ──────────────────────────────────────────────────

  readonly calendarId = `ui-calendar-${nextCalendarId++}`
  readonly activeView = signal<CalendarView>('days')
  readonly viewDate = signal<Date>(new Date())
  readonly focusedDate = signal<Date>(new Date())
  readonly hoveredDate = signal<Date | null>(null)

  protected readonly weekdayHeaders = WEEKDAY_HEADERS
  protected readonly monthNames = MONTH_NAMES

  // ── Computed ────────────────────────────────────────────────────────

  protected readonly monthGrid = computed(() =>
    generateMonthGrid(this.viewDate().getFullYear(), this.viewDate().getMonth()),
  )

  protected readonly monthYearLabel = computed(() =>
    formatMonthYear(this.viewDate()),
  )

  protected readonly yearRange = computed(() =>
    getYearRange(this.viewDate().getFullYear()),
  )

  protected readonly headerLabel = computed(() => {
    switch (this.activeView()) {
      case 'days':
        return this.monthYearLabel()
      case 'months':
        return String(this.viewDate().getFullYear())
      case 'years': {
        const range = this.yearRange()
        return `${range[0]} – ${range[range.length - 1]}`
      }
    }
  })

  protected readonly headerAriaLabel = computed(() => {
    switch (this.activeView()) {
      case 'days':
        return `Currently showing ${this.monthYearLabel()}. Click to select month`
      case 'months':
        return `Currently showing ${this.viewDate().getFullYear()}. Click to select year`
      case 'years':
        return 'Currently showing year range'
    }
  })

  protected readonly prevButtonLabel = computed(() => {
    switch (this.activeView()) {
      case 'days': return 'Previous month'
      case 'months': return 'Previous year'
      case 'years': return 'Previous year range'
    }
  })

  protected readonly nextButtonLabel = computed(() => {
    switch (this.activeView()) {
      case 'days': return 'Next month'
      case 'months': return 'Next year'
      case 'years': return 'Next year range'
    }
  })

  constructor() {
    const initial = this.startAt() ?? this.selected() ?? new Date()
    this.viewDate.set(createDate(initial.getFullYear(), initial.getMonth(), 1))
    this.focusedDate.set(createDate(initial.getFullYear(), initial.getMonth(), initial.getDate()))
  }

  // ── Navigation ──────────────────────────────────────────────────────

  protected navigatePrev() {
    switch (this.activeView()) {
      case 'days':
        this.viewDate.update(d => addMonths(d, -1))
        break
      case 'months':
        this.viewDate.update(d => addYears(d, -1))
        break
      case 'years':
        this.viewDate.update(d => addYears(d, -24))
        break
    }
    this.monthChange.emit(this.viewDate())
  }

  protected navigateNext() {
    switch (this.activeView()) {
      case 'days':
        this.viewDate.update(d => addMonths(d, 1))
        break
      case 'months':
        this.viewDate.update(d => addYears(d, 1))
        break
      case 'years':
        this.viewDate.update(d => addYears(d, 24))
        break
    }
    this.monthChange.emit(this.viewDate())
  }

  protected onHeaderClick() {
    switch (this.activeView()) {
      case 'days':
        this.activeView.set('months')
        break
      case 'months':
        this.activeView.set('years')
        break
      case 'years':
        // cycle back to days
        this.activeView.set('days')
        break
    }
  }

  protected goToToday() {
    const today = new Date()
    this.viewDate.set(createDate(today.getFullYear(), today.getMonth(), 1))
    this.focusedDate.set(createDate(today.getFullYear(), today.getMonth(), today.getDate()))
    this.monthChange.emit(this.viewDate())
  }

  // ── Date Selection ──────────────────────────────────────────────────

  protected onDateClick(date: Date) {
    if (this.isCellDisabled(date)) return
    this.selected.set(date)
    this.focusedDate.set(date)
    if (!isSameMonth(date, this.viewDate())) {
      this.viewDate.set(createDate(date.getFullYear(), date.getMonth(), 1))
    }
  }

  protected onMonthClick(month: number) {
    const vd = this.viewDate()
    this.viewDate.set(createDate(vd.getFullYear(), month, 1))
    this.activeView.set('days')
    this.monthChange.emit(this.viewDate())
  }

  protected onYearClick(year: number) {
    const vd = this.viewDate()
    this.viewDate.set(createDate(year, vd.getMonth(), 1))
    this.activeView.set('months')
    this.monthChange.emit(this.viewDate())
  }

  // ── Cell State Queries ──────────────────────────────────────────────

  isCellSelected(date: Date): boolean {
    return (
      isSameDay(date, this.selected()) ||
      isSameDay(date, this.startDate()) ||
      isSameDay(date, this.endDate())
    )
  }

  isCellDisabled(date: Date): boolean {
    return isDateDisabled(date, this.min(), this.max(), this.dateFilter())
  }

  protected isCellFocused(date: Date): boolean {
    return isSameDay(date, this.focusedDate())
  }

  protected isRangeStart(date: Date): boolean {
    return isSameDay(date, this.startDate())
  }

  protected isRangeEnd(date: Date): boolean {
    return isSameDay(date, this.endDate())
  }

  protected isInRange(date: Date): boolean {
    return isDateInRange(date, this.startDate(), this.endDate())
  }

  protected isInPreviewRange(date: Date): boolean {
    const start = this.startDate()
    const hovered = this.hoveredDate()
    if (!start || this.endDate() || !hovered) return false
    const rangeStart = isDateBefore(start, hovered) ? start : hovered
    const rangeEnd = isDateAfter(start, hovered) ? start : hovered
    return isDateInRange(date, rangeStart, rangeEnd)
  }

  // ── Cell Classes ────────────────────────────────────────────────────

  protected getDayCellClasses(cell: CalendarCell): string {
    const date = cell.date
    const base = 'inline-flex size-9 items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    const disabled = this.isCellDisabled(date)
    const selected = isSameDay(date, this.selected())
    const rangeStart = this.isRangeStart(date)
    const rangeEnd = this.isRangeEnd(date)
    const inRange = this.isInRange(date)
    const inPreview = this.isInPreviewRange(date)

    const parts: string[] = [base]

    if (disabled) {
      parts.push('opacity-30 cursor-not-allowed')
    } else {
      parts.push('cursor-pointer')
    }

    if (!cell.isCurrentMonth) {
      parts.push('text-foreground-muted opacity-40')
    }

    if (selected || rangeStart || rangeEnd) {
      parts.push('bg-primary text-primary-foreground font-semibold')
      if (rangeStart && this.endDate()) parts.push('rounded-s-md rounded-e-none')
      else if (rangeEnd && this.startDate()) parts.push('rounded-e-md rounded-s-none')
      else parts.push('rounded-md')
    } else if (inRange || inPreview) {
      parts.push('bg-primary/10 rounded-none')
    } else {
      parts.push('rounded-md')
      if (!disabled && cell.isCurrentMonth) {
        parts.push('hover:bg-surface-hover')
      }
    }

    if (cell.isToday && !selected && !rangeStart && !rangeEnd) {
      parts.push('font-bold ring-1 ring-border')
    }

    return parts.join(' ')
  }

  protected getMonthCellClasses(monthIndex: number): string {
    const base = 'rounded-md px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer'
    const vd = this.viewDate()
    const isCurrent = vd.getMonth() === monthIndex
    if (isCurrent) {
      return `${base} bg-primary text-primary-foreground font-semibold`
    }
    return `${base} hover:bg-surface-hover text-foreground`
  }

  protected getYearCellClasses(year: number): string {
    const base = 'rounded-md px-2 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer'
    const currentYear = this.viewDate().getFullYear()
    if (year === currentYear) {
      return `${base} bg-primary text-primary-foreground font-semibold`
    }
    return `${base} hover:bg-surface-hover text-foreground`
  }

  protected getDayAriaLabel(date: Date): string {
    return formatDayAriaLabel(date)
  }

  // ── Keyboard Navigation ─────────────────────────────────────────────

  protected onKeydown(event: KeyboardEvent) {
    if (this.activeView() !== 'days') return

    let newDate: Date | null = null
    const focused = this.focusedDate()

    switch (event.key) {
      case 'ArrowLeft':
        newDate = addDays(focused, -1)
        break
      case 'ArrowRight':
        newDate = addDays(focused, 1)
        break
      case 'ArrowUp':
        newDate = addDays(focused, -7)
        break
      case 'ArrowDown':
        newDate = addDays(focused, 7)
        break
      case 'Home':
        newDate = createDate(focused.getFullYear(), focused.getMonth(), 1)
        break
      case 'End':
        newDate = createDate(
          focused.getFullYear(),
          focused.getMonth(),
          new Date(focused.getFullYear(), focused.getMonth() + 1, 0).getDate(),
        )
        break
      case 'PageUp':
        newDate = event.shiftKey ? addYears(focused, -1) : addMonths(focused, -1)
        break
      case 'PageDown':
        newDate = event.shiftKey ? addYears(focused, 1) : addMonths(focused, 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        this.onDateClick(focused)
        return
    }

    if (newDate) {
      event.preventDefault()
      this.focusedDate.set(newDate)
      if (!isSameMonth(newDate, this.viewDate())) {
        this.viewDate.set(createDate(newDate.getFullYear(), newDate.getMonth(), 1))
        this.monthChange.emit(this.viewDate())
      }
      // Focus the cell after change detection
      requestAnimationFrame(() => {
        const grid = document.getElementById(this.calendarId)
        const cell = grid?.querySelector('[tabindex="0"]') as HTMLElement
        cell?.focus()
      })
    }
  }
}

// ── Internal Helpers ──────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime())
  result.setDate(result.getDate() + days)
  result.setHours(0, 0, 0, 0)
  return result
}
