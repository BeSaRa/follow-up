import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UiCalendar } from './calendar'
import { createDate } from './date-utils'

@Component({
  imports: [UiCalendar],
  template: `
    <ui-calendar
      [selected]="selected()"
      [min]="min()"
      [max]="max()"
      [dateFilter]="dateFilter()"
      [startAt]="startAt()"
      [startDate]="startDate()"
      [endDate]="endDate()"
      (selectedChange)="onSelected($event)"
    />
  `,
})
class CalendarHost {
  selected = signal<Date | null>(null)
  min = signal<Date | null>(null)
  max = signal<Date | null>(null)
  dateFilter = signal<((d: Date) => boolean) | null>(null)
  startAt = signal<Date | null>(createDate(2026, 1, 1)) // February 2026
  startDate = signal<Date | null>(null)
  endDate = signal<Date | null>(null)
  onSelected = vi.fn()
}

describe('UiCalendar', () => {
  let fixture: ComponentFixture<CalendarHost>
  let host: CalendarHost
  let calendarEl: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHost],
    }).compileComponents()

    fixture = TestBed.createComponent(CalendarHost)
    host = fixture.componentInstance
    fixture.detectChanges()
    calendarEl = fixture.nativeElement.querySelector('ui-calendar')
  })

  function getDayButtons(): HTMLButtonElement[] {
    return Array.from(calendarEl.querySelectorAll('[role="gridcell"]'))
  }

  function getDayButtonByText(text: string): HTMLButtonElement | undefined {
    return getDayButtons().find(
      btn => btn.textContent?.trim() === text && !btn.classList.contains('opacity-40'),
    )
  }

  function getHeaderLabel(): string {
    return calendarEl.querySelector('.text-sm.font-medium')?.textContent?.trim() ?? ''
  }

  function clickPrev() {
    const btn = calendarEl.querySelector('[aria-label="Previous month"]') as HTMLElement
    btn.click()
    fixture.detectChanges()
  }

  function clickNext() {
    const btn = calendarEl.querySelector('[aria-label="Next month"]') as HTMLElement
    btn.click()
    fixture.detectChanges()
  }

  function clickHeader() {
    const btn = calendarEl.querySelector('.text-sm.font-medium') as HTMLElement
    btn.click()
    fixture.detectChanges()
  }

  function pressKey(key: string, options: Partial<KeyboardEvent> = {}) {
    calendarEl.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, ...options }),
    )
    fixture.detectChanges()
  }

  // ── Rendering ─────────────────────────────────────────────────────

  it('should render the correct month header', () => {
    expect(getHeaderLabel()).toBe('February 2026')
  })

  it('should render 7 weekday headers', () => {
    const headers = calendarEl.querySelectorAll('[role="columnheader"]')
    expect(headers.length).toBe(7)
    expect(headers[0].textContent?.trim()).toBe('Su')
    expect(headers[6].textContent?.trim()).toBe('Sa')
  })

  it('should render 42 day cells (6 weeks)', () => {
    expect(getDayButtons().length).toBe(42)
  })

  it('should render days of the current month', () => {
    // February 2026 has 28 days
    const day1 = getDayButtonByText('1')
    const day28 = getDayButtonByText('28')
    expect(day1).toBeTruthy()
    expect(day28).toBeTruthy()
  })

  it('should show a Today button', () => {
    const allBtns = Array.from(calendarEl.querySelectorAll('button'))
    const todayButton = allBtns.find(b => b.textContent?.trim() === 'Today')
    expect(todayButton).toBeTruthy()
  })

  // ── Navigation ────────────────────────────────────────────────────

  it('should navigate to previous month', () => {
    clickPrev()
    expect(getHeaderLabel()).toBe('January 2026')
  })

  it('should navigate to next month', () => {
    clickNext()
    expect(getHeaderLabel()).toBe('March 2026')
  })

  it('should switch to months view when clicking header', () => {
    clickHeader()
    const monthButtons = calendarEl.querySelectorAll('[role="grid"] [role="gridcell"]')
    expect(monthButtons.length).toBe(12)
  })

  it('should switch to years view from months view', () => {
    clickHeader() // → months
    clickHeader() // → years
    const yearButtons = calendarEl.querySelectorAll('[role="grid"] [role="gridcell"]')
    expect(yearButtons.length).toBe(24)
  })

  it('should navigate back from year → months → days', () => {
    clickHeader() // → months
    clickHeader() // → years

    // Click a year
    const yearBtn = Array.from(
      calendarEl.querySelectorAll('[role="gridcell"]'),
    ).find(b => b.textContent?.trim() === '2026') as HTMLElement
    yearBtn?.click()
    fixture.detectChanges()

    // Should be in months view now
    expect(calendarEl.querySelectorAll('[role="grid"] [role="gridcell"]').length).toBe(12)

    // Click a month
    const monthBtn = calendarEl.querySelectorAll('[role="gridcell"]')[0] as HTMLElement
    monthBtn.click()
    fixture.detectChanges()

    // Should be back in days view
    expect(getDayButtons().length).toBe(42)
  })

  // ── Selection ─────────────────────────────────────────────────────

  it('should emit selectedChange when clicking a day', () => {
    const day15 = getDayButtonByText('15')
    day15?.click()
    fixture.detectChanges()

    expect(host.onSelected).toHaveBeenCalledTimes(1)
    const emitted: Date = host.onSelected.mock.calls[0][0]
    expect(emitted.getDate()).toBe(15)
    expect(emitted.getMonth()).toBe(1) // February
    expect(emitted.getFullYear()).toBe(2026)
  })

  it('should highlight the selected date', () => {
    host.selected.set(createDate(2026, 1, 15))
    fixture.detectChanges()

    const day15 = getDayButtonByText('15')
    expect(day15?.getAttribute('aria-selected')).toBe('true')
    expect(day15?.className).toContain('bg-primary')
  })

  // ── ARIA ──────────────────────────────────────────────────────────

  it('should have role="grid" on the days container', () => {
    const grid = calendarEl.querySelector('[role="grid"]')
    expect(grid).toBeTruthy()
  })

  it('should set aria-label on day cells', () => {
    const day1 = getDayButtonByText('1')
    expect(day1?.getAttribute('aria-label')).toContain('February')
    expect(day1?.getAttribute('aria-label')).toContain('2026')
  })

  it('should mark today with aria-current="date"', () => {
    const today = new Date()
    // Navigate to today's month
    host.startAt.set(createDate(today.getFullYear(), today.getMonth(), 1))
    fixture.detectChanges()

    const todayCells = getDayButtons().filter(
      btn => btn.getAttribute('aria-current') === 'date',
    )
    expect(todayCells.length).toBeGreaterThanOrEqual(1)
  })

  // ── Disabled Dates ────────────────────────────────────────────────

  it('should disable dates before min', () => {
    host.min.set(createDate(2026, 1, 10))
    fixture.detectChanges()

    const day5 = getDayButtonByText('5')
    expect(day5?.disabled).toBe(true)
    expect(day5?.getAttribute('aria-disabled')).toBe('true')
  })

  it('should disable dates after max', () => {
    host.max.set(createDate(2026, 1, 20))
    fixture.detectChanges()

    const day25 = getDayButtonByText('25')
    expect(day25?.disabled).toBe(true)
  })

  it('should disable dates matching dateFilter', () => {
    // Disable weekends
    host.dateFilter.set((d: Date) => d.getDay() !== 0 && d.getDay() !== 6)
    fixture.detectChanges()

    // Feb 1, 2026 is a Sunday
    const day1 = getDayButtonByText('1')
    expect(day1?.disabled).toBe(true)
  })

  it('should not emit when clicking a disabled date', () => {
    host.min.set(createDate(2026, 1, 10))
    fixture.detectChanges()

    const day5 = getDayButtonByText('5')
    day5?.click()
    fixture.detectChanges()

    expect(host.onSelected).not.toHaveBeenCalled()
  })

  // ── Keyboard Navigation ───────────────────────────────────────────

  it('should move focus right with ArrowRight', () => {
    pressKey('ArrowRight')
    const focused = calendarEl.querySelector('[tabindex="0"]') as HTMLElement
    expect(focused).toBeTruthy()
  })

  it('should select date on Enter', () => {
    pressKey('Enter')
    expect(host.onSelected).toHaveBeenCalledTimes(1)
  })

  it('should select date on Space', () => {
    pressKey(' ')
    expect(host.onSelected).toHaveBeenCalledTimes(1)
  })

  // ── Range Highlighting ────────────────────────────────────────────

  it('should highlight range start and end', () => {
    host.startDate.set(createDate(2026, 1, 10))
    host.endDate.set(createDate(2026, 1, 20))
    fixture.detectChanges()

    const day10 = getDayButtonByText('10')
    const day20 = getDayButtonByText('20')
    expect(day10?.getAttribute('aria-selected')).toBe('true')
    expect(day20?.getAttribute('aria-selected')).toBe('true')
  })

  it('should highlight dates in range', () => {
    host.startDate.set(createDate(2026, 1, 10))
    host.endDate.set(createDate(2026, 1, 20))
    fixture.detectChanges()

    const day15 = getDayButtonByText('15')
    expect(day15?.className).toContain('bg-primary/10')
  })
})
