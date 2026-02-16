import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OverlayContainer } from '@angular/cdk/overlay'
import { FocusMonitor } from '@angular/cdk/a11y'
import { UiTooltip } from './tooltip'

@Component({
  imports: [UiTooltip],
  template: `
    <button
      uiTooltip="Test tooltip"
      [uiTooltipPosition]="position"
      [uiTooltipShowDelay]="showDelay"
      [uiTooltipHideDelay]="hideDelay"
      [uiTooltipDisabled]="disabled"
    >Hover me</button>
  `,
})
class TestHost {
  position: 'above' | 'below' | 'start' | 'end' = 'above'
  showDelay = 0
  hideDelay = 0
  disabled = false
}

@Component({
  imports: [UiTooltip],
  template: `<button [uiTooltip]="text">Hover me</button>`,
})
class EmptyTooltipHost {
  text = ''
}

describe('UiTooltip', () => {
  let fixture: ComponentFixture<TestHost>
  let buttonEl: HTMLButtonElement
  let overlayContainer: OverlayContainer
  let overlayContainerEl: HTMLElement
  let focusMonitor: FocusMonitor

  beforeEach(async () => {
    vi.useFakeTimers()

    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHost)
    fixture.detectChanges()
    buttonEl = fixture.nativeElement.querySelector('button')
    overlayContainer = TestBed.inject(OverlayContainer)
    overlayContainerEl = overlayContainer.getContainerElement()
    focusMonitor = TestBed.inject(FocusMonitor)
  })

  afterEach(() => {
    vi.useRealTimers()
    overlayContainer.ngOnDestroy()
  })

  function mouseEnter() {
    buttonEl.dispatchEvent(new MouseEvent('mouseenter'))
    fixture.detectChanges()
  }

  function mouseLeave() {
    buttonEl.dispatchEvent(new MouseEvent('mouseleave'))
    fixture.detectChanges()
  }

  function keyboardFocus() {
    focusMonitor.focusVia(buttonEl, 'keyboard')
    fixture.detectChanges()
  }

  function blur() {
    buttonEl.blur()
    fixture.detectChanges()
  }

  function pressEscape() {
    buttonEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    fixture.detectChanges()
  }

  function getTooltipPanel(): HTMLElement | null {
    return overlayContainerEl.querySelector('ui-tooltip-panel')
  }

  it('should show tooltip on mouseenter', () => {
    mouseEnter()
    expect(getTooltipPanel()).toBeTruthy()
    expect(getTooltipPanel()?.textContent).toContain('Test tooltip')
  })

  it('should hide tooltip on mouseleave', () => {
    mouseEnter()
    expect(getTooltipPanel()).toBeTruthy()
    mouseLeave()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should show tooltip on keyboard focus', () => {
    keyboardFocus()
    expect(getTooltipPanel()).toBeTruthy()
  })

  it('should hide tooltip on blur', () => {
    keyboardFocus()
    expect(getTooltipPanel()).toBeTruthy()
    blur()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should not pin tooltip on mouse click focus', () => {
    mouseEnter()
    expect(getTooltipPanel()).toBeTruthy()
    focusMonitor.focusVia(buttonEl, 'mouse')
    fixture.detectChanges()
    mouseLeave()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should keep tooltip visible when mouse leaves but keyboard focus remains', () => {
    mouseEnter()
    keyboardFocus()
    mouseLeave()
    expect(getTooltipPanel()).toBeTruthy()
  })

  it('should keep tooltip visible when keyboard focus leaves but mouse remains', () => {
    mouseEnter()
    keyboardFocus()
    blur()
    expect(getTooltipPanel()).toBeTruthy()
  })

  it('should hide tooltip on Escape key', () => {
    mouseEnter()
    expect(getTooltipPanel()).toBeTruthy()
    pressEscape()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should not show tooltip when disabled', () => {
    const disabledFixture = TestBed.createComponent(TestHost)
    disabledFixture.componentInstance.disabled = true
    disabledFixture.detectChanges()
    const btn = disabledFixture.nativeElement.querySelector('button') as HTMLElement
    btn.dispatchEvent(new MouseEvent('mouseenter'))
    disabledFixture.detectChanges()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should set role="tooltip" on the panel', () => {
    mouseEnter()
    const panel = getTooltipPanel()
    expect(panel?.getAttribute('role')).toBe('tooltip')
  })

  it('should set aria-describedby on the host element', () => {
    mouseEnter()
    const panel = getTooltipPanel()
    const id = panel?.getAttribute('id')
    expect(id).toBeTruthy()
    expect(buttonEl.getAttribute('aria-describedby')).toBe(id)
  })

  it('should remove aria-describedby after hiding', () => {
    mouseEnter()
    expect(buttonEl.getAttribute('aria-describedby')).toBeTruthy()
    mouseLeave()
    expect(buttonEl.getAttribute('aria-describedby')).toBeNull()
  })

  it('should respect show delay', () => {
    const delayFixture = TestBed.createComponent(TestHost)
    delayFixture.componentInstance.showDelay = 300
    delayFixture.detectChanges()
    const btn = delayFixture.nativeElement.querySelector('button') as HTMLElement

    btn.dispatchEvent(new MouseEvent('mouseenter'))
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeNull()

    vi.advanceTimersByTime(200)
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeNull()

    vi.advanceTimersByTime(100)
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeTruthy()
  })

  it('should respect hide delay', () => {
    const delayFixture = TestBed.createComponent(TestHost)
    delayFixture.componentInstance.hideDelay = 200
    delayFixture.detectChanges()
    const btn = delayFixture.nativeElement.querySelector('button') as HTMLElement

    btn.dispatchEvent(new MouseEvent('mouseenter'))
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeTruthy()

    btn.dispatchEvent(new MouseEvent('mouseleave'))
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeTruthy()

    vi.advanceTimersByTime(200)
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should cancel show if mouse leaves before delay', () => {
    const delayFixture = TestBed.createComponent(TestHost)
    delayFixture.componentInstance.showDelay = 300
    delayFixture.detectChanges()
    const btn = delayFixture.nativeElement.querySelector('button') as HTMLElement

    btn.dispatchEvent(new MouseEvent('mouseenter'))
    delayFixture.detectChanges()

    vi.advanceTimersByTime(100)
    btn.dispatchEvent(new MouseEvent('mouseleave'))
    delayFixture.detectChanges()

    vi.advanceTimersByTime(200)
    delayFixture.detectChanges()
    expect(getTooltipPanel()).toBeNull()
  })

  it('should not show tooltip when text is empty', () => {
    const emptyFixture = TestBed.createComponent(EmptyTooltipHost)
    emptyFixture.detectChanges()
    const btn = emptyFixture.nativeElement.querySelector('button') as HTMLElement
    btn.dispatchEvent(new MouseEvent('mouseenter'))
    emptyFixture.detectChanges()
    expect(overlayContainerEl.querySelector('ui-tooltip-panel')).toBeNull()
  })
})
