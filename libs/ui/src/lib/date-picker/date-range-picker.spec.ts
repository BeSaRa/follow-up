import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { OverlayContainer } from '@angular/cdk/overlay'
import {
  UiDateRangePicker,
  UiDateRangeStartInput,
  UiDateRangeEndInput,
  type DateRange,
} from './date-range-picker'
import { UiDatePickerToggle } from './date-picker'
import { createDate } from './date-utils'

@Component({
  imports: [
    UiDateRangePicker,
    UiDateRangeStartInput,
    UiDateRangeEndInput,
    UiDatePickerToggle,
    ReactiveFormsModule,
  ],
  template: `
    <ui-date-range-picker
      [min]="min()"
      [max]="max()"
      [formControl]="control"
    >
      <input uiDateRangeStart placeholder="Start date" />
      <input uiDateRangeEnd placeholder="End date" />
      <ui-date-picker-toggle />
    </ui-date-range-picker>
  `,
})
class DateRangePickerHost {
  control = new FormControl<DateRange | null>(null)
  min = signal<Date | null>(null)
  max = signal<Date | null>(null)
}

describe('UiDateRangePicker', () => {
  let fixture: ComponentFixture<DateRangePickerHost>
  let host: DateRangePickerHost
  let overlayContainer: OverlayContainer
  let overlayContainerEl: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangePickerHost],
    }).compileComponents()

    overlayContainer = TestBed.inject(OverlayContainer)
    overlayContainerEl = overlayContainer.getContainerElement()
    fixture = TestBed.createComponent(DateRangePickerHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    overlayContainer.ngOnDestroy()
  })

  function getStartInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[uiDateRangeStart]') as HTMLInputElement
  }

  function getEndInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[uiDateRangeEnd]') as HTMLInputElement
  }

  function getToggleButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('ui-date-picker-toggle button')
  }

  function getPanel(): HTMLElement | null {
    return overlayContainerEl.querySelector('[role="dialog"]')
  }

  function clickToggle() {
    getToggleButton().click()
    fixture.detectChanges()
  }

  function getCalendarDayButtons(): HTMLButtonElement[] {
    return Array.from(overlayContainerEl.querySelectorAll('[role="gridcell"]'))
  }

  function getCurrentMonthDayButtons(): HTMLButtonElement[] {
    return getCalendarDayButtons().filter(
      btn => !btn.classList.contains('opacity-40') && !btn.disabled,
    )
  }

  // ── Rendering ─────────────────────────────────────────────────────

  it('should render two inputs', () => {
    expect(getStartInput()).toBeTruthy()
    expect(getEndInput()).toBeTruthy()
  })

  it('should render a dash separator between inputs', () => {
    const separator = fixture.nativeElement.querySelector('span')
    expect(separator?.textContent).toContain('–')
  })

  it('should render a toggle button', () => {
    expect(getToggleButton()).toBeTruthy()
  })

  // ── Overlay ───────────────────────────────────────────────────────

  it('should open calendar on toggle click', () => {
    expect(getPanel()).toBeNull()
    clickToggle()
    expect(getPanel()).toBeTruthy()
  })

  it('should close on Escape', () => {
    clickToggle()
    const panel = getPanel()
    expect(panel).toBeTruthy()
    panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    fixture.detectChanges()
    expect(getPanel()).toBeNull()
  })

  it('should close on outside click', () => {
    clickToggle()
    document.body.click()
    fixture.detectChanges()
    expect(getPanel()).toBeNull()
  })

  // ── Two-click Selection ───────────────────────────────────────────

  it('should stay open after first click (start date)', () => {
    clickToggle()
    const days = getCurrentMonthDayButtons()
    days[5].click()
    fixture.detectChanges()

    // Should still be open
    expect(getPanel()).toBeTruthy()
  })

  it('should close after second click (end date)', () => {
    clickToggle()
    const days = getCurrentMonthDayButtons()

    // First click — start
    days[5].click()
    fixture.detectChanges()

    // Second click — end
    days[15].click()
    fixture.detectChanges()

    expect(getPanel()).toBeNull()
  })

  it('should update form control after selecting both dates', () => {
    clickToggle()
    const days = getCurrentMonthDayButtons()

    days[5].click()
    fixture.detectChanges()

    days[15].click()
    fixture.detectChanges()

    const value = host.control.value
    expect(value).toBeTruthy()
    expect(value?.start).toBeInstanceOf(Date)
    expect(value?.end).toBeInstanceOf(Date)
  })

  it('should swap dates if end is before start', () => {
    clickToggle()
    const days = getCurrentMonthDayButtons()

    // Pick a later date first
    days[15].click()
    fixture.detectChanges()

    // Then pick an earlier date
    days[5].click()
    fixture.detectChanges()

    const value = host.control.value
    expect(value?.start).toBeTruthy()
    expect(value?.end).toBeTruthy()
    if (value?.start && value?.end) {
      expect(value.start.getTime()).toBeLessThan(value.end.getTime())
    }
  })

  // ── ControlValueAccessor ──────────────────────────────────────────

  it('should update inputs when form control is set programmatically', () => {
    host.control.setValue({
      start: createDate(2026, 1, 10),
      end: createDate(2026, 1, 20),
    })
    fixture.detectChanges()

    expect(getStartInput().value).toBe('02/10/2026')
    expect(getEndInput().value).toBe('02/20/2026')
  })

  it('should clear inputs when form control is reset', () => {
    host.control.setValue({
      start: createDate(2026, 1, 10),
      end: createDate(2026, 1, 20),
    })
    fixture.detectChanges()

    host.control.reset()
    fixture.detectChanges()

    expect(getStartInput().value).toBe('')
    expect(getEndInput().value).toBe('')
  })

  // ── Input Parsing ─────────────────────────────────────────────────

  it('should parse typed start date', () => {
    const startInput = getStartInput()
    startInput.value = '03/01/2026'
    startInput.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    const value = host.control.value
    expect(value?.start).toBeInstanceOf(Date)
    expect(value?.start?.getMonth()).toBe(2) // March
  })

  it('should parse typed end date', () => {
    const endInput = getEndInput()
    endInput.value = '03/15/2026'
    endInput.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    const value = host.control.value
    expect(value?.end).toBeInstanceOf(Date)
    expect(value?.end?.getDate()).toBe(15)
  })

  // ── ARIA ──────────────────────────────────────────────────────────

  it('should set role="dialog" on the overlay panel', () => {
    clickToggle()
    expect(getPanel()?.getAttribute('role')).toBe('dialog')
  })

  it('should set aria-modal="true" on the panel', () => {
    clickToggle()
    expect(getPanel()?.getAttribute('aria-modal')).toBe('true')
  })

  it('should set aria-label on the panel', () => {
    clickToggle()
    expect(getPanel()?.getAttribute('aria-label')).toBe('Choose date range')
  })
})
