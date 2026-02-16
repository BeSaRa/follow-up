import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { OverlayContainer } from '@angular/cdk/overlay'
import { UiMenu, UiMenuItem, UiMenuTrigger, UiSubMenuTrigger } from './menu'

@Component({
  imports: [UiMenu, UiMenuItem, UiMenuTrigger],
  template: `
    <button [uiMenuTrigger]="menu">Open</button>
    <ui-menu #menu>
      <ui-menu-item (selected)="onFirst()">First</ui-menu-item>
      <ui-menu-item (selected)="onSecond()">Second</ui-menu-item>
      <ui-menu-item [disabled]="disableThird()" (selected)="onThird()">Third</ui-menu-item>
    </ui-menu>
  `,
})
class BasicMenuHost {
  disableThird = signal(false)
  onFirst = vi.fn()
  onSecond = vi.fn()
  onThird = vi.fn()
}

@Component({
  imports: [UiMenu, UiMenuItem, UiMenuTrigger, UiSubMenuTrigger],
  template: `
    <button [uiMenuTrigger]="rootMenu">Open</button>

    <ui-menu #rootMenu>
      <ui-menu-item (selected)="onItem()">Item 1</ui-menu-item>
      <ui-menu-item [uiSubMenuTrigger]="subMenu">Submenu</ui-menu-item>
    </ui-menu>

    <ui-menu #subMenu>
      <ui-menu-item (selected)="onSubItem()">Sub Item 1</ui-menu-item>
      <ui-menu-item (selected)="onSubItem2()">Sub Item 2</ui-menu-item>
    </ui-menu>
  `,
})
class NestedMenuHost {
  onItem = vi.fn()
  onSubItem = vi.fn()
  onSubItem2 = vi.fn()
}

describe('UiMenu', () => {
  let overlayContainer: OverlayContainer
  let overlayContainerEl: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    overlayContainer.ngOnDestroy()
  })

  function getMenuPanels(): HTMLElement[] {
    return Array.from(overlayContainerEl.querySelectorAll('[role="menu"]'))
  }

  function getMenuItems(panel?: HTMLElement): HTMLElement[] {
    const container = panel ?? overlayContainerEl
    return Array.from(container.querySelectorAll('[role="menuitem"]'))
  }

  function clickTrigger(fixture: ComponentFixture<unknown>) {
    const btn = fixture.nativeElement.querySelector('button') as HTMLElement
    btn.click()
    fixture.detectChanges()
  }

  function pressKey(el: HTMLElement, key: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  }

  describe('Basic menu', () => {
    let fixture: ComponentFixture<BasicMenuHost>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicMenuHost],
      }).compileComponents()

      overlayContainer = TestBed.inject(OverlayContainer)
      overlayContainerEl = overlayContainer.getContainerElement()
      fixture = TestBed.createComponent(BasicMenuHost)
      fixture.detectChanges()
    })

    it('should open menu on trigger click', () => {
      expect(getMenuPanels().length).toBe(0)
      clickTrigger(fixture)
      expect(getMenuPanels().length).toBe(1)
    })

    it('should close menu on second trigger click', () => {
      clickTrigger(fixture)
      expect(getMenuPanels().length).toBe(1)
      clickTrigger(fixture)
      expect(getMenuPanels().length).toBe(0)
    })

    it('should set aria-haspopup on trigger', () => {
      const btn = fixture.nativeElement.querySelector('button')
      expect(btn.getAttribute('aria-haspopup')).toBe('menu')
    })

    it('should set aria-expanded on trigger', () => {
      const btn = fixture.nativeElement.querySelector('button')
      expect(btn.getAttribute('aria-expanded')).toBe('false')
      clickTrigger(fixture)
      expect(btn.getAttribute('aria-expanded')).toBe('true')
    })

    it('should render menu items with role="menuitem"', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      expect(items.length).toBe(3)
      items.forEach(item => {
        expect(item.getAttribute('role')).toBe('menuitem')
      })
    })

    it('should emit selected and close menu when item is clicked', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      items[0].click()
      fixture.detectChanges()
      expect(fixture.componentInstance.onFirst).toHaveBeenCalled()
      expect(getMenuPanels().length).toBe(0)
    })

    it('should set aria-disabled on disabled items', () => {
      fixture.componentInstance.disableThird.set(true)
      fixture.detectChanges()
      clickTrigger(fixture)
      const items = getMenuItems()
      expect(items[2].getAttribute('aria-disabled')).toBe('true')
    })

    it('should not emit selected on disabled item click', () => {
      fixture.componentInstance.disableThird.set(true)
      fixture.detectChanges()
      clickTrigger(fixture)
      const items = getMenuItems()
      items[2].click()
      fixture.detectChanges()
      expect(fixture.componentInstance.onThird).not.toHaveBeenCalled()
    })

    it('should close menu on Escape', () => {
      clickTrigger(fixture)
      const panel = getMenuPanels()[0]
      pressKey(panel, 'Escape')
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(0)
    })

    it('should navigate items with ArrowDown', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[0].focus()
      pressKey(panel, 'ArrowDown')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[1])
    })

    it('should navigate items with ArrowUp', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[1].focus()
      pressKey(panel, 'ArrowUp')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[0])
    })

    it('should wrap around when navigating past last item', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[2].focus()
      pressKey(panel, 'ArrowDown')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[0])
    })

    it('should wrap around when navigating before first item', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[0].focus()
      pressKey(panel, 'ArrowUp')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[2])
    })

    it('should focus first item on Home', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[2].focus()
      pressKey(panel, 'Home')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[0])
    })

    it('should focus last item on End', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[0].focus()
      pressKey(panel, 'End')
      fixture.detectChanges()

      expect(document.activeElement).toBe(items[2])
    })

    it('should skip disabled items during keyboard navigation', () => {
      fixture.componentInstance.disableThird.set(true)
      fixture.detectChanges()
      clickTrigger(fixture)

      const items = getMenuItems()
      const panel = getMenuPanels()[0]

      items[1].focus()
      pressKey(panel, 'ArrowDown')
      fixture.detectChanges()

      // Should wrap to first, skipping disabled third
      expect(document.activeElement).toBe(items[0])
    })

    it('should emit selected on Enter key', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      items[0].focus()
      pressKey(items[0], 'Enter')
      fixture.detectChanges()

      expect(fixture.componentInstance.onFirst).toHaveBeenCalled()
      expect(getMenuPanels().length).toBe(0)
    })

    it('should emit selected on Space key', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      items[1].focus()
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      fixture.detectChanges()

      expect(fixture.componentInstance.onSecond).toHaveBeenCalled()
    })
  })

  describe('Nested menu', () => {
    let fixture: ComponentFixture<NestedMenuHost>

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NestedMenuHost],
      }).compileComponents()

      overlayContainer = TestBed.inject(OverlayContainer)
      overlayContainerEl = overlayContainer.getContainerElement()
      fixture = TestBed.createComponent(NestedMenuHost)
      fixture.detectChanges()
    })

    it('should show chevron on submenu trigger item', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const submenuItem = items[1]
      expect(submenuItem.querySelector('svg')).toBeTruthy()
    })

    it('should set aria-haspopup on submenu trigger item', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      expect(items[1].getAttribute('aria-haspopup')).toBe('menu')
    })

    it('should open submenu on hover after delay', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const submenuItem = items[1]

      submenuItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(1) // Only root menu

      vi.advanceTimersByTime(150)
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(2) // Root + submenu
    })

    it('should open submenu on ArrowRight', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const submenuItem = items[1]

      submenuItem.focus()
      submenuItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      fixture.detectChanges()

      expect(getMenuPanels().length).toBe(2)
    })

    it('should close submenu on ArrowLeft', () => {
      clickTrigger(fixture)
      const rootItems = getMenuItems()

      // Open submenu via hover
      rootItems[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      vi.advanceTimersByTime(150)
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(2)

      // Press ArrowLeft in submenu
      const subPanel = getMenuPanels()[1]
      pressKey(subPanel, 'ArrowLeft')
      fixture.detectChanges()

      expect(getMenuPanels().length).toBe(1) // Only root
    })

    it('should close entire tree when submenu item is selected', () => {
      clickTrigger(fixture)
      const rootItems = getMenuItems()

      // Open submenu
      rootItems[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      vi.advanceTimersByTime(150)
      fixture.detectChanges()

      const subPanel = getMenuPanels()[1]
      const subItems = getMenuItems(subPanel)
      subItems[0].click()
      fixture.detectChanges()

      expect(fixture.componentInstance.onSubItem).toHaveBeenCalled()
      expect(getMenuPanels().length).toBe(0)
    })

    it('should not emit selected when clicking on submenu trigger item', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      items[1].click()
      fixture.detectChanges()

      // Submenu trigger items should not emit selected
      expect(getMenuPanels().length).toBeGreaterThanOrEqual(1)
    })

    it('should close submenu on mouseleave after delay', () => {
      clickTrigger(fixture)
      const items = getMenuItems()
      const submenuItem = items[1]

      // Open submenu
      submenuItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      vi.advanceTimersByTime(150)
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(2)

      // Leave submenu trigger
      submenuItem.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      vi.advanceTimersByTime(150)
      fixture.detectChanges()
      expect(getMenuPanels().length).toBe(1)
    })
  })
})
