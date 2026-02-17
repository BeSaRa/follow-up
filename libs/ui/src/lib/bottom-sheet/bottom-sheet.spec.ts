import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  UiBottomSheet,
  UiBottomSheetHeader,
  UiBottomSheetContent,
  UiBottomSheetClose,
  BottomSheetSnapPoint,
} from './bottom-sheet'

// ── Helpers ──────────────────────────────────────────────────────

function query<T extends HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T {
  const el = fixture.nativeElement.querySelector(selector) as T | null
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

function queryOrNull(fixture: ComponentFixture<unknown>, selector: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(selector)
}

function triggerTransitionEnd(panel: HTMLElement) {
  panel.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'transform' }))
}

async function waitForAnimation() {
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

// ── Test host ────────────────────────────────────────────────────

@Component({
  imports: [UiBottomSheet, UiBottomSheetHeader, UiBottomSheetContent, UiBottomSheetClose],
  template: `
    <button class="trigger" (click)="open.set(true)">Open</button>
    <ui-bottom-sheet
      [(open)]="open"
      [snapPoints]="snapPoints()"
      [initialSnap]="initialSnap()"
      [swipeToDismiss]="swipeToDismiss()"
      [hasBackdrop]="hasBackdrop()"
      [closeOnBackdropClick]="closeOnBackdropClick()"
      [ariaLabel]="'Test bottom sheet'"
      (opened)="openedCount = openedCount + 1"
      (closed)="closedCount = closedCount + 1"
      (snapChanged)="lastSnap = $event"
    >
      <ui-bottom-sheet-header>
        <h3>Title</h3>
      </ui-bottom-sheet-header>
      <ui-bottom-sheet-content>
        <button class="inner-btn">Inner</button>
        <button class="close-btn" uiBottomSheetClose>Close</button>
      </ui-bottom-sheet-content>
    </ui-bottom-sheet>
  `,
})
class TestHost {
  open = signal(false)
  snapPoints = signal<BottomSheetSnapPoint[]>(['half', 'full'])
  initialSnap = signal<BottomSheetSnapPoint>('half')
  swipeToDismiss = signal(true)
  hasBackdrop = signal(true)
  closeOnBackdropClick = signal(true)
  openedCount = 0
  closedCount = 0
  lastSnap: BottomSheetSnapPoint | null = null
}

// ── Tests ────────────────────────────────────────────────────────

describe('UiBottomSheet', () => {
  let fixture: ComponentFixture<TestHost>
  let host: TestHost

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('rendering', () => {
    it('should not render the panel when closed', () => {
      expect(queryOrNull(fixture, '.ui-bottom-sheet-panel')).toBeNull()
    })

    it('should render the panel when open', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-bottom-sheet-panel')).not.toBeNull()
    })

    it('should remove the panel from DOM after close transition ends', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      host.open.set(false)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      triggerTransitionEnd(panel)
      fixture.detectChanges()

      expect(queryOrNull(fixture, '.ui-bottom-sheet-panel')).toBeNull()
    })
  })

  describe('backdrop', () => {
    it('should show backdrop when open', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-bottom-sheet-backdrop')).not.toBeNull()
    })

    it('should not show backdrop when hasBackdrop is false', () => {
      host.hasBackdrop.set(false)
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-bottom-sheet-backdrop')).toBeNull()
    })

    it('should close on backdrop click', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      query(fixture, '.ui-bottom-sheet-backdrop').click()
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })

    it('should not close on backdrop click when closeOnBackdropClick is false', async () => {
      host.closeOnBackdropClick.set(false)
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      query(fixture, '.ui-bottom-sheet-backdrop').click()
      fixture.detectChanges()

      expect(host.open()).toBe(true)
    })
  })

  describe('keyboard', () => {
    it('should close on Escape key', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })
  })

  describe('UiBottomSheetClose directive', () => {
    it('should close the sheet when clicked', () => {
      host.open.set(true)
      fixture.detectChanges()

      query(fixture, '.close-btn').click()
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })
  })

  describe('snap points', () => {
    it('should set panel height based on current snap point', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.style.height).toBe('50vh')
    })

    it('should use initialSnap for starting position', () => {
      host.initialSnap.set('full')
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.style.height).toBe('calc(100vh - 2rem)')
    })

    it('should use peek height when initialSnap is peek', () => {
      host.snapPoints.set(['peek', 'half', 'full'])
      host.initialSnap.set('peek')
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.style.height).toBe('25vh')
    })

    it('should emit snapChanged on open', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()

      expect(host.lastSnap).toBe('half')
    })
  })

  describe('accessibility', () => {
    it('should have role="dialog" on the panel', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-bottom-sheet-panel').getAttribute('role')).toBe('dialog')
    })

    it('should have aria-modal="true"', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-bottom-sheet-panel').getAttribute('aria-modal')).toBe('true')
    })

    it('should set aria-label', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-bottom-sheet-panel').getAttribute('aria-label')).toBe('Test bottom sheet')
    })

    it('should have a drag handle with role="slider"', () => {
      host.open.set(true)
      fixture.detectChanges()

      const handle = query(fixture, '[role="slider"]')
      expect(handle).not.toBeNull()
      expect(handle.getAttribute('aria-label')).toBe('Resize sheet')
    })

    it('should show current snap point as aria-valuetext on the handle', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      const handle = query(fixture, '[role="slider"]')
      expect(handle.getAttribute('aria-valuetext')).toBe('half')
    })
  })

  describe('animation', () => {
    it('should not have panel-open class immediately after open', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.classList.contains('panel-open')).toBe(false)
    })

    it('should add panel-open class after animation frame', async () => {
      host.open.set(true)
      fixture.detectChanges()

      await waitForAnimation()
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.classList.contains('panel-open')).toBe(true)
    })

    it('should add closing class when closing', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      host.open.set(false)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      expect(panel.classList.contains('closing')).toBe(true)
      expect(panel.classList.contains('panel-open')).toBe(false)
    })
  })

  describe('outputs', () => {
    it('should emit opened when the sheet opens', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()

      expect(host.openedCount).toBe(1)
    })

    it('should emit closed after close transition ends', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      host.open.set(false)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-bottom-sheet-panel')
      triggerTransitionEnd(panel)
      fixture.detectChanges()

      expect(host.closedCount).toBe(1)
    })
  })

  describe('content projection', () => {
    it('should project content into UiBottomSheetContent', () => {
      host.open.set(true)
      fixture.detectChanges()

      const content = query(fixture, 'ui-bottom-sheet-content')
      expect(content.textContent).toContain('Inner')
    })

    it('should project the header title', () => {
      host.open.set(true)
      fixture.detectChanges()

      const header = query(fixture, 'ui-bottom-sheet-header')
      expect(header.textContent).toContain('Title')
    })
  })

  describe('header drag handle indicator', () => {
    it('should render the drag handle indicator', () => {
      host.open.set(true)
      fixture.detectChanges()

      const indicator = queryOrNull(fixture, '.ui-bottom-sheet-handle-indicator')
      expect(indicator).not.toBeNull()
    })
  })
})
