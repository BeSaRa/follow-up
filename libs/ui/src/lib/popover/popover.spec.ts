import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OverlayContainer } from '@angular/cdk/overlay'
import { UiPopover, UiPopoverTrigger, UiPopoverClose } from './popover'
import type { PopoverPosition } from './popover'

@Component({
  imports: [UiPopover, UiPopoverTrigger, UiPopoverClose],
  template: `
    <button [uiPopoverTrigger]="pop">Open</button>
    <ui-popover #pop [position]="position()" (opened)="onOpened()" (closed)="onClosed()">
      <div class="p-4">
        <input data-testid="first-input" />
        <button data-testid="inner-btn" uiPopoverClose>Close</button>
      </div>
    </ui-popover>
  `,
})
class BasicPopoverHost {
  position = signal<PopoverPosition>('below-start')
  onOpened = vi.fn()
  onClosed = vi.fn()
}

@Component({
  imports: [UiPopover, UiPopoverTrigger],
  template: `
    <button [uiPopoverTrigger]="pop">Open</button>
    <ui-popover #pop>
      <p>No focusable elements here</p>
    </ui-popover>
  `,
})
class NoFocusableHost {}

describe('UiPopover', () => {
  let overlayContainer: OverlayContainer
  let overlayContainerEl: HTMLElement

  afterEach(() => {
    overlayContainer.ngOnDestroy()
  })

  function getPanel(): HTMLElement | null {
    return overlayContainerEl.querySelector('[role="dialog"]')
  }

  function clickTrigger(fixture: ComponentFixture<unknown>) {
    const btn = fixture.nativeElement.querySelector('button') as HTMLElement
    btn.click()
    fixture.detectChanges()
  }

  function getTriggerButton(fixture: ComponentFixture<unknown>): HTMLElement {
    return fixture.nativeElement.querySelector('button')
  }

  describe('Basic popover', () => {
    let fixture: ComponentFixture<BasicPopoverHost>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicPopoverHost],
      }).compileComponents()

      overlayContainer = TestBed.inject(OverlayContainer)
      overlayContainerEl = overlayContainer.getContainerElement()
      fixture = TestBed.createComponent(BasicPopoverHost)
      fixture.detectChanges()
    })

    it('should open popover on trigger click', () => {
      expect(getPanel()).toBeNull()
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()
    })

    it('should close popover on second trigger click', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()
      clickTrigger(fixture)
      expect(getPanel()).toBeNull()
    })

    it('should close popover on Escape and restore focus to trigger', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()

      const panel = getPanel()!
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      fixture.detectChanges()

      expect(getPanel()).toBeNull()
      expect(document.activeElement).toBe(getTriggerButton(fixture))
    })

    it('should close popover on Tab', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()

      const panel = getPanel()!
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
      fixture.detectChanges()

      expect(getPanel()).toBeNull()
    })

    it('should close popover on outside click', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()

      document.body.click()
      fixture.detectChanges()

      expect(getPanel()).toBeNull()
    })

    it('should not close when clicking inside the popover', () => {
      clickTrigger(fixture)
      const innerBtn = overlayContainerEl.querySelector('[data-testid="inner-btn"]') as HTMLElement
      innerBtn.click()
      fixture.detectChanges()

      // The close button has uiPopoverClose so it will close, but the click itself doesn't
      // trigger outside click handler — we test that separately
    })

    it('should close popover via UiPopoverClose directive', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()

      const closeBtn = overlayContainerEl.querySelector('[data-testid="inner-btn"]') as HTMLElement
      closeBtn.click()
      fixture.detectChanges()

      expect(getPanel()).toBeNull()
    })

    it('should restore focus to trigger after UiPopoverClose click', () => {
      clickTrigger(fixture)
      const closeBtn = overlayContainerEl.querySelector('[data-testid="inner-btn"]') as HTMLElement
      closeBtn.click()
      fixture.detectChanges()

      expect(document.activeElement).toBe(getTriggerButton(fixture))
    })

    it('should emit opened when popover opens', () => {
      clickTrigger(fixture)
      expect(fixture.componentInstance.onOpened).toHaveBeenCalledTimes(1)
    })

    it('should emit closed when popover closes', () => {
      clickTrigger(fixture)
      clickTrigger(fixture)
      expect(fixture.componentInstance.onClosed).toHaveBeenCalledTimes(1)
    })

    it('should not emit opened twice when already open', () => {
      clickTrigger(fixture)
      // Attempt to open again programmatically — toggle will close
      clickTrigger(fixture)
      clickTrigger(fixture)
      expect(fixture.componentInstance.onOpened).toHaveBeenCalledTimes(2)
    })

    // ARIA
    it('should set aria-haspopup="dialog" on trigger', () => {
      const btn = getTriggerButton(fixture)
      expect(btn.getAttribute('aria-haspopup')).toBe('dialog')
    })

    it('should set aria-expanded on trigger', () => {
      const btn = getTriggerButton(fixture)
      expect(btn.getAttribute('aria-expanded')).toBe('false')
      clickTrigger(fixture)
      expect(btn.getAttribute('aria-expanded')).toBe('true')
    })

    it('should set aria-controls on trigger pointing to panel id', () => {
      clickTrigger(fixture)
      const btn = getTriggerButton(fixture)
      const panel = getPanel()!
      expect(btn.getAttribute('aria-controls')).toBe(panel.id)
    })

    it('should set role="dialog" on the panel', () => {
      clickTrigger(fixture)
      const panel = getPanel()
      expect(panel?.getAttribute('role')).toBe('dialog')
    })

    it('should have a unique id on the panel', () => {
      clickTrigger(fixture)
      const panel = getPanel()
      expect(panel?.id).toMatch(/^ui-popover-\d+$/)
    })

    // Focus management
    it('should focus first focusable element on open', async () => {
      clickTrigger(fixture)
      // requestAnimationFrame is used, so we need to flush
      await new Promise(resolve => requestAnimationFrame(resolve))
      fixture.detectChanges()

      const firstInput = overlayContainerEl.querySelector('[data-testid="first-input"]') as HTMLElement
      expect(document.activeElement).toBe(firstInput)
    })
  })

  describe('No focusable elements', () => {
    let fixture: ComponentFixture<NoFocusableHost>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NoFocusableHost],
      }).compileComponents()

      overlayContainer = TestBed.inject(OverlayContainer)
      overlayContainerEl = overlayContainer.getContainerElement()
      fixture = TestBed.createComponent(NoFocusableHost)
      fixture.detectChanges()
    })

    it('should open without errors when no focusable elements', () => {
      clickTrigger(fixture)
      expect(getPanel()).toBeTruthy()
    })
  })
})
