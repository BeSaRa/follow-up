import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  UiDrawer,
  UiDrawerContainer,
  UiDrawerHeader,
  UiDrawerContent,
  UiDrawerFooter,
  UiDrawerClose,
} from './drawer'

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

/** Wait two animation frames (the delay used for visuallyOpen). */
async function waitForAnimation() {
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

// ── Test host ────────────────────────────────────────────────────

@Component({
  imports: [UiDrawer, UiDrawerHeader, UiDrawerContent, UiDrawerFooter, UiDrawerClose],
  template: `
    <button class="trigger" (click)="open.set(true)">Open</button>
    <ui-drawer
      [(open)]="open"
      [position]="position()"
      [mode]="mode()"
      [hasBackdrop]="hasBackdrop()"
      [closeOnBackdropClick]="closeOnBackdropClick()"
      [closeOnEscape]="closeOnEscape()"
      [ariaLabel]="'Test drawer'"
      (opened)="openedCount = openedCount + 1"
      (closed)="closedCount = closedCount + 1"
    >
      <ui-drawer-header><h3>Title</h3></ui-drawer-header>
      <ui-drawer-content>
        <button class="inner-btn">Inner</button>
        <p>Content</p>
      </ui-drawer-content>
      <ui-drawer-footer>
        <button class="close-btn" uiDrawerClose>Close</button>
      </ui-drawer-footer>
    </ui-drawer>
  `,
})
class TestHost {
  open = signal(false)
  position = signal<'start' | 'end'>('start')
  mode = signal<'overlay' | 'push'>('overlay')
  hasBackdrop = signal(true)
  closeOnBackdropClick = signal(true)
  closeOnEscape = signal(true)
  openedCount = 0
  closedCount = 0
}

// ── Tests ────────────────────────────────────────────────────────

describe('UiDrawer', () => {
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
      expect(queryOrNull(fixture, '.ui-drawer-panel')).toBeNull()
    })

    it('should render the panel when open', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-drawer-panel')).not.toBeNull()
    })

    it('should remove the panel from DOM after close transition ends', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      host.open.set(false)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      triggerTransitionEnd(panel)
      fixture.detectChanges()

      expect(queryOrNull(fixture, '.ui-drawer-panel')).toBeNull()
    })
  })

  describe('backdrop', () => {
    it('should show backdrop in overlay mode', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-drawer-backdrop')).not.toBeNull()
    })

    it('should not show backdrop when hasBackdrop is false', () => {
      host.hasBackdrop.set(false)
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-drawer-backdrop')).toBeNull()
    })

    it('should not show backdrop in push mode', () => {
      host.mode.set('push')
      host.open.set(true)
      fixture.detectChanges()
      expect(queryOrNull(fixture, '.ui-drawer-backdrop')).toBeNull()
    })

    it('should close on backdrop click', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      query(fixture, '.ui-drawer-backdrop').click()
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })

    it('should not close on backdrop click when closeOnBackdropClick is false', async () => {
      host.closeOnBackdropClick.set(false)
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      query(fixture, '.ui-drawer-backdrop').click()
      fixture.detectChanges()

      expect(host.open()).toBe(true)
    })
  })

  describe('keyboard', () => {
    it('should close on Escape key', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })

    it('should not close on Escape when closeOnEscape is false', () => {
      host.closeOnEscape.set(false)
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      fixture.detectChanges()

      expect(host.open()).toBe(true)
    })
  })

  describe('UiDrawerClose directive', () => {
    it('should close the drawer when clicked', () => {
      host.open.set(true)
      fixture.detectChanges()

      query(fixture, '.close-btn').click()
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })
  })

  describe('UiDrawerHeader', () => {
    it('should render the header with title and close button', () => {
      host.open.set(true)
      fixture.detectChanges()

      const header = query(fixture, 'ui-drawer-header')
      expect(header.textContent).toContain('Title')

      const closeBtn = header.querySelector('button[aria-label="Close drawer"]')
      expect(closeBtn).not.toBeNull()
    })

    it('should close the drawer via the header close button', () => {
      host.open.set(true)
      fixture.detectChanges()

      query(fixture, 'ui-drawer-header button[aria-label="Close drawer"]').click()
      fixture.detectChanges()

      expect(host.open()).toBe(false)
    })
  })

  describe('position', () => {
    it('should apply position-start class by default', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('position-start')).toBe(true)
      expect(panel.classList.contains('position-end')).toBe(false)
    })

    it('should apply position-end class when position is end', () => {
      host.position.set('end')
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('position-end')).toBe(true)
      expect(panel.classList.contains('position-start')).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should have role="dialog" on the panel', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-drawer-panel').getAttribute('role')).toBe('dialog')
    })

    it('should have aria-modal="true" in overlay mode', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-drawer-panel').getAttribute('aria-modal')).toBe('true')
    })

    it('should not have aria-modal in push mode', () => {
      host.mode.set('push')
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-drawer-panel').getAttribute('aria-modal')).toBe('false')
    })

    it('should set aria-label', () => {
      host.open.set(true)
      fixture.detectChanges()
      expect(query(fixture, '.ui-drawer-panel').getAttribute('aria-label')).toBe('Test drawer')
    })
  })

  describe('animation', () => {
    it('should not have panel-open class immediately after open', () => {
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('panel-open')).toBe(false)
    })

    it('should add panel-open class after animation frame', async () => {
      host.open.set(true)
      fixture.detectChanges()

      await waitForAnimation()
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('panel-open')).toBe(true)
    })

    it('should add closing class when closing', async () => {
      host.open.set(true)
      fixture.detectChanges()
      await waitForAnimation()
      fixture.detectChanges()

      host.open.set(false)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('closing')).toBe(true)
      expect(panel.classList.contains('panel-open')).toBe(false)
    })
  })

  describe('outputs', () => {
    it('should emit opened when the drawer opens', async () => {
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

      const panel = query(fixture, '.ui-drawer-panel')
      triggerTransitionEnd(panel)
      fixture.detectChanges()

      expect(host.closedCount).toBe(1)
    })
  })

  describe('content projection', () => {
    it('should project content into UiDrawerContent', () => {
      host.open.set(true)
      fixture.detectChanges()

      const content = query(fixture, 'ui-drawer-content')
      expect(content.textContent).toContain('Content')
    })

    it('should project footer content', () => {
      host.open.set(true)
      fixture.detectChanges()

      const footer = query(fixture, 'ui-drawer-footer')
      expect(footer.textContent).toContain('Close')
    })
  })

  describe('push mode', () => {
    it('should add mode-push class in push mode', () => {
      host.mode.set('push')
      host.open.set(true)
      fixture.detectChanges()

      const panel = query(fixture, '.ui-drawer-panel')
      expect(panel.classList.contains('mode-push')).toBe(true)
    })
  })
})

// ── UiDrawerContainer tests ──────────────────────────────────────

@Component({
  imports: [UiDrawer, UiDrawerContainer, UiDrawerHeader, UiDrawerContent],
  template: `
    <ui-drawer-container>
      <ui-drawer [(open)]="open" [mode]="mode()" [position]="position()" ariaLabel="Push drawer">
        <ui-drawer-header><h3>Nav</h3></ui-drawer-header>
        <ui-drawer-content><p>Links</p></ui-drawer-content>
      </ui-drawer>
      <div class="main-content">Main content</div>
    </ui-drawer-container>
  `,
})
class PushTestHost {
  open = signal(false)
  mode = signal<'overlay' | 'push'>('push')
  position = signal<'start' | 'end'>('start')
}

describe('UiDrawerContainer', () => {
  let fixture: ComponentFixture<PushTestHost>
  let host: PushTestHost

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(PushTestHost)
    host = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should apply margin-inline-start when push drawer opens at start position', async () => {
    host.open.set(true)
    fixture.detectChanges()
    await waitForAnimation()
    fixture.detectChanges()

    const content = query(fixture, '.ui-drawer-container-content')
    expect(content.style.marginInlineStart).toBe('var(--ui-drawer-width, 20rem)')
    expect(content.style.marginInlineEnd).toBe('0')
  })

  it('should apply margin-inline-end when push drawer opens at end position', async () => {
    host.position.set('end')
    host.open.set(true)
    fixture.detectChanges()
    await waitForAnimation()
    fixture.detectChanges()

    const content = query(fixture, '.ui-drawer-container-content')
    expect(content.style.marginInlineEnd).toBe('var(--ui-drawer-width, 20rem)')
    expect(content.style.marginInlineStart).toBe('0')
  })

  it('should reset margins when drawer is closed', async () => {
    host.open.set(true)
    fixture.detectChanges()
    await waitForAnimation()
    fixture.detectChanges()

    host.open.set(false)
    fixture.detectChanges()

    const content = query(fixture, '.ui-drawer-container-content')
    expect(content.style.marginInlineStart).toBe('0')
  })

  it('should not apply margins in overlay mode', async () => {
    host.mode.set('overlay')
    host.open.set(true)
    fixture.detectChanges()
    await waitForAnimation()
    fixture.detectChanges()

    const content = query(fixture, '.ui-drawer-container-content')
    expect(content.style.marginInlineStart).toBe('0')
    expect(content.style.marginInlineEnd).toBe('0')
  })
})
