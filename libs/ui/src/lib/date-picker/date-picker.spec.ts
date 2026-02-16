import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { OverlayContainer } from '@angular/cdk/overlay'
import { UiDatePicker, UiDatePickerInput, UiDatePickerToggle } from './date-picker'
import { createDate } from './date-utils'

@Component({
  imports: [UiDatePicker, UiDatePickerInput, UiDatePickerToggle, ReactiveFormsModule],
  template: `
    <ui-date-picker
      [min]="min()"
      [max]="max()"
      [formControl]="control"
    >
      <input uiDatePickerInput placeholder="Pick a date" />
      <ui-date-picker-toggle />
    </ui-date-picker>
  `,
})
class DatePickerHost {
  control = new FormControl<Date | null>(null)
  min = signal<Date | null>(null)
  max = signal<Date | null>(null)
}

describe('UiDatePicker', () => {
  let fixture: ComponentFixture<DatePickerHost>
  let host: DatePickerHost
  let overlayContainer: OverlayContainer
  let overlayContainerEl: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerHost],
    }).compileComponents()

    overlayContainer = TestBed.inject(OverlayContainer)
    overlayContainerEl = overlayContainer.getContainerElement()
    fixture = TestBed.createComponent(DatePickerHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    overlayContainer.ngOnDestroy()
  })

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input')
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

  // ── Overlay ───────────────────────────────────────────────────────

  it('should open calendar on toggle click', () => {
    expect(getPanel()).toBeNull()
    clickToggle()
    expect(getPanel()).toBeTruthy()
  })

  it('should close calendar on second toggle click', () => {
    clickToggle()
    expect(getPanel()).toBeTruthy()
    clickToggle()
    expect(getPanel()).toBeNull()
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
    expect(getPanel()).toBeTruthy()

    document.body.click()
    fixture.detectChanges()

    expect(getPanel()).toBeNull()
  })

  it('should open on Enter key in input', () => {
    const input = getInput()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    fixture.detectChanges()

    expect(getPanel()).toBeTruthy()
  })

  it('should open on ArrowDown key in input', () => {
    const input = getInput()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    fixture.detectChanges()

    expect(getPanel()).toBeTruthy()
  })

  // ── Date Selection ────────────────────────────────────────────────

  it('should close overlay and update form control on date selection', () => {
    clickToggle()

    // Click a day in the calendar
    const dayBtns = getCalendarDayButtons().filter(
      btn => !btn.classList.contains('opacity-40') && !btn.disabled,
    )
    const targetBtn = dayBtns[10] // Some day in the current month
    targetBtn.click()
    fixture.detectChanges()

    // Overlay should close
    expect(getPanel()).toBeNull()

    // Form control should have a value
    expect(host.control.value).toBeInstanceOf(Date)
  })

  it('should display selected date in input', () => {
    clickToggle()

    const dayBtns = getCalendarDayButtons().filter(
      btn => !btn.classList.contains('opacity-40') && !btn.disabled,
    )
    dayBtns[10].click()
    fixture.detectChanges()

    const input = getInput()
    expect(input.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  // ── ControlValueAccessor ──────────────────────────────────────────

  it('should update input when form control value is set programmatically', () => {
    host.control.setValue(createDate(2026, 1, 15))
    fixture.detectChanges()

    const input = getInput()
    expect(input.value).toBe('02/15/2026')
  })

  it('should clear input when form control is reset', () => {
    host.control.setValue(createDate(2026, 1, 15))
    fixture.detectChanges()
    expect(getInput().value).toBe('02/15/2026')

    host.control.reset()
    fixture.detectChanges()
    expect(getInput().value).toBe('')
  })

  // ── Input Parsing ─────────────────────────────────────────────────

  it('should parse typed date and update form control', () => {
    const input = getInput()
    input.value = '03/15/2026'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    expect(host.control.value).toBeInstanceOf(Date)
    expect(host.control.value?.getMonth()).toBe(2) // March
    expect(host.control.value?.getDate()).toBe(15)
  })

  it('should set null for invalid input text', () => {
    host.control.setValue(createDate(2026, 1, 15))
    fixture.detectChanges()

    const input = getInput()
    input.value = 'not-a-date'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()

    expect(host.control.value).toBeNull()
  })

  // ── ARIA ──────────────────────────────────────────────────────────

  it('should set aria-haspopup="dialog" on input', () => {
    expect(getInput().getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('should set role="dialog" on the overlay panel', () => {
    clickToggle()
    expect(getPanel()?.getAttribute('role')).toBe('dialog')
  })

  it('should set aria-modal="true" on the overlay panel', () => {
    clickToggle()
    expect(getPanel()?.getAttribute('aria-modal')).toBe('true')
  })

  it('should have aria-label on toggle button', () => {
    expect(getToggleButton().getAttribute('aria-label')).toBe('Toggle calendar')
  })

  // ── Constraints ───────────────────────────────────────────────────

  it('should pass min to calendar', () => {
    host.min.set(createDate(2026, 0, 1))
    fixture.detectChanges()
    clickToggle()

    // Calendar should be rendered with constraints
    const panel = getPanel()
    expect(panel).toBeTruthy()
  })

  it('should pass max to calendar', () => {
    host.max.set(createDate(2026, 11, 31))
    fixture.detectChanges()
    clickToggle()

    const panel = getPanel()
    expect(panel).toBeTruthy()
  })
})
