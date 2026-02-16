import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import {
  UiNavbar,
  UiNavbarBrand,
  UiNavbarNav,
  UiNavbarActions,
  UiNavbarLink,
} from './navbar'

// ── Helpers ──────────────────────────────────────────────────────

function query<T extends HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T {
  const el = fixture.nativeElement.querySelector(selector) as T | null
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

function queryAll(fixture: ComponentFixture<unknown>, selector: string): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll(selector))
}

function queryOrNull(fixture: ComponentFixture<unknown>, selector: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(selector)
}

async function waitForFrame() {
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve())
  })
}

// ── Test host ────────────────────────────────────────────────────

@Component({
  imports: [UiNavbar, UiNavbarBrand, UiNavbarNav, UiNavbarActions, UiNavbarLink],
  template: `
    <ui-navbar [fixed]="fixed()" [elevated]="elevated()">
      <ui-navbar-brand>
        <span class="brand-text">App</span>
      </ui-navbar-brand>
      <ui-navbar-nav>
        <a uiNavbarLink [active]="true" href="#">Home</a>
        <a uiNavbarLink href="#">About</a>
        <a uiNavbarLink href="#">Contact</a>
      </ui-navbar-nav>
      <ui-navbar-actions>
        <button class="action-btn">Sign In</button>
      </ui-navbar-actions>
    </ui-navbar>
  `,
})
class TestHost {
  fixed = signal(false)
  elevated = signal(true)
}

// ── Tests ────────────────────────────────────────────────────────

describe('UiNavbar', () => {
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
    it('should render with role="navigation"', () => {
      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.getAttribute('role')).toBe('navigation')
    })

    it('should render with aria-label="Main navigation"', () => {
      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.getAttribute('aria-label')).toBe('Main navigation')
    })

    it('should project brand content', () => {
      const brand = query(fixture, 'ui-navbar-brand')
      expect(brand.textContent).toContain('App')
    })

    it('should project nav links', () => {
      const links = queryAll(fixture, 'a[uiNavbarLink]')
      expect(links.length).toBe(3)
    })

    it('should project actions content', () => {
      const actions = query(fixture, 'ui-navbar-actions')
      expect(actions.textContent).toContain('Sign In')
    })

    it('should render a hamburger toggle button', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      expect(hamburger).toBeTruthy()
    })
  })

  describe('fixed mode', () => {
    it('should not have fixed positioning by default', () => {
      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.className).not.toContain('fixed')
    })

    it('should apply fixed positioning when fixed is true', () => {
      host.fixed.set(true)
      fixture.detectChanges()

      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.className).toContain('fixed')
      expect(navbar.className).toContain('top-0')
      expect(navbar.className).toContain('z-40')
    })
  })

  describe('elevated mode', () => {
    it('should apply shadow by default', () => {
      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.className).toContain('shadow-sm')
    })

    it('should not apply shadow when elevated is false', () => {
      host.elevated.set(false)
      fixture.detectChanges()

      const navbar = query(fixture, 'ui-navbar')
      expect(navbar.className).not.toContain('shadow-sm')
    })
  })

  describe('active link', () => {
    it('should apply active classes to the active link', () => {
      const links = queryAll(fixture, 'a[uiNavbarLink]')
      const activeLink = links[0]
      expect(activeLink.className).toContain('text-foreground')
      expect(activeLink.className).toContain('font-medium')
      expect(activeLink.className).toContain('border-b-2')
      expect(activeLink.className).toContain('border-primary')
    })

    it('should apply inactive classes to non-active links', () => {
      const links = queryAll(fixture, 'a[uiNavbarLink]')
      const inactiveLink = links[1]
      expect(inactiveLink.className).toContain('text-foreground-muted')
      expect(inactiveLink.className).toContain('hover:text-foreground')
    })

    it('should set aria-current="page" on the active link', () => {
      const links = queryAll(fixture, 'a[uiNavbarLink]')
      expect(links[0].getAttribute('aria-current')).toBe('page')
    })

    it('should not set aria-current on inactive links', () => {
      const links = queryAll(fixture, 'a[uiNavbarLink]')
      expect(links[1].getAttribute('aria-current')).toBeNull()
      expect(links[2].getAttribute('aria-current')).toBeNull()
    })
  })

  describe('mobile toggle', () => {
    it('should have aria-expanded="false" initially', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      expect(hamburger.getAttribute('aria-expanded')).toBe('false')
    })

    it('should have aria-controls pointing to the nav panel', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      const controlsId = hamburger.getAttribute('aria-controls')
      expect(controlsId).toBeTruthy()

      const panel = queryOrNull(fixture, `#${controlsId}`)
      expect(panel).not.toBeNull()
    })

    it('should set aria-expanded="true" after clicking hamburger', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      hamburger.click()
      fixture.detectChanges()

      expect(hamburger.getAttribute('aria-expanded')).toBe('true')
    })

    it('should show the mobile nav panel when toggled open', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      hamburger.click()
      fixture.detectChanges()

      const controlsId = hamburger.getAttribute('aria-controls') ?? ''
      const panel = query(fixture, `#${controlsId}`)
      expect(panel.className).toContain('flex')
      expect(panel.className).not.toContain('hidden')
    })

    it('should hide the mobile nav panel when toggled closed', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')

      // Open
      hamburger.click()
      fixture.detectChanges()

      // Close
      hamburger.click()
      fixture.detectChanges()

      const controlsId = hamburger.getAttribute('aria-controls') ?? ''
      const panel = query(fixture, `#${controlsId}`)
      expect(panel.className).toContain('hidden')
    })
  })

  describe('focus management', () => {
    it('should focus the first link when mobile panel opens', async () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      hamburger.click()
      fixture.detectChanges()

      await waitForFrame()

      const firstLink = queryAll(fixture, 'a[uiNavbarLink]')[0]
      expect(document.activeElement).toBe(firstLink)
    })

    it('should close mobile panel on Escape', () => {
      const hamburger = query(fixture, 'button[aria-label="Toggle navigation"]')
      hamburger.click()
      fixture.detectChanges()

      const controlsId = hamburger.getAttribute('aria-controls') ?? ''
      const panel = query(fixture, `#${controlsId}`)
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      fixture.detectChanges()

      expect(hamburger.getAttribute('aria-expanded')).toBe('false')
    })

    it('should restore focus to hamburger after Escape', async () => {
      const hamburger = query<HTMLButtonElement>(fixture, 'button[aria-label="Toggle navigation"]')
      hamburger.focus()
      hamburger.click()
      fixture.detectChanges()

      await waitForFrame()

      const controlsId = hamburger.getAttribute('aria-controls') ?? ''
      const panel = query(fixture, `#${controlsId}`)
      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      fixture.detectChanges()

      expect(document.activeElement).toBe(hamburger)
    })
  })
})

// ── Navbar without nav section ───────────────────────────────────

@Component({
  imports: [UiNavbar, UiNavbarBrand, UiNavbarActions],
  template: `
    <ui-navbar>
      <ui-navbar-brand><span>Logo</span></ui-navbar-brand>
      <ui-navbar-actions><button>Action</button></ui-navbar-actions>
    </ui-navbar>
  `,
})
class NoNavTestHost {}

describe('UiNavbar without UiNavbarNav', () => {
  let fixture: ComponentFixture<NoNavTestHost>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoNavTestHost],
    }).compileComponents()

    fixture = TestBed.createComponent(NoNavTestHost)
    fixture.detectChanges()
  })

  it('should not render the hamburger button', () => {
    const hamburger = queryOrNull(fixture, 'button[aria-label="Toggle navigation"]')
    expect(hamburger).toBeNull()
  })

  it('should still render brand and actions', () => {
    expect(query(fixture, 'ui-navbar-brand').textContent).toContain('Logo')
    expect(query(fixture, 'ui-navbar-actions').textContent).toContain('Action')
  })
})
