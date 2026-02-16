import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core'
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay'

export type MenuPosition =
  | 'below-start'
  | 'below-end'
  | 'above-start'
  | 'above-end'

const ROOT_POSITION_MAP: Record<MenuPosition, ConnectedPosition[]> = {
  'below-start': [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
  ],
  'below-end': [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  ],
  'above-start': [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  ],
  'above-end': [
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  ],
}

const SUB_MENU_POSITIONS: ConnectedPosition[] = [
  // Right side
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
  { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
  // Left side fallback
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
]

const HOVER_DELAY = 150

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="flex-1"><ng-content /></span>
    @if (hasSubMenu()) {
      <span class="ml-2 flex items-center rtl:ml-0 rtl:mr-2" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="ml-auto opacity-60 rtl:ml-0 rtl:mr-auto rtl:rotate-180">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </span>
    }
  `,
  host: {
    role: 'menuitem',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.aria-haspopup]': 'hasSubMenu() ? "menu" : null',
    '[attr.aria-expanded]': 'hasSubMenu() ? subMenuOpen() : null',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onSelect()',
    '(keydown.Enter)': 'onSelect()',
    '(keydown.Space)': 'onSelect($event)',
  },
})
export class UiMenuItem {
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly selected = output<void>()

  readonly el = inject(ElementRef)
  private readonly menu = inject(forwardRef(() => UiMenu))

  /** Set by UiSubMenuTrigger if this item triggers a submenu */
  readonly hasSubMenu = signal(false)
  readonly subMenuOpen = signal(false)

  protected readonly hostClasses = computed(() => {
    const base =
      'flex w-full cursor-pointer items-center px-3 py-2 text-start text-sm text-foreground ' +
      'transition-colors hover:bg-surface-hover ' +
      'focus-visible:outline-none focus-visible:bg-surface-hover'

    return this.disabled()
      ? `${base} !cursor-default !opacity-50 !pointer-events-none`
      : base
  })

  focus() {
    this.el.nativeElement.focus()
  }

  protected onSelect(event?: Event) {
    event?.preventDefault()
    if (this.disabled() || this.hasSubMenu()) return
    this.selected.emit()
    this.menu.closeTree()
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerElement()!"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="overlayPositions()"
      [cdkConnectedOverlayOffsetY]="isSubmenu() ? 0 : 4"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onOverlayKeydown($event)"
      (detach)="close()"
    >
      <div role="menu" [class]="panelClasses"
        (mouseenter)="onPanelMouseEnter()"
        (mouseleave)="onPanelMouseLeave()">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiMenu {
  readonly isOpen = signal(false)
  readonly triggerElement = signal<ElementRef | null>(null)
  readonly isSubmenu = signal(false)
  readonly parentMenu = signal<UiMenu | null>(null)

  /** The UiSubMenuTrigger that controls this menu (if it's a submenu) */
  parentTrigger: UiSubMenuTrigger | null = null

  /** Position for root menus — set by UiMenuTrigger */
  readonly rootPosition = signal<MenuPosition>('below-start')

  readonly items = contentChildren(UiMenuItem)

  protected readonly overlayPositions = computed(() =>
    this.isSubmenu() ? SUB_MENU_POSITIONS : ROOT_POSITION_MAP[this.rootPosition()],
  )

  protected readonly panelClasses =
    'min-w-[8rem] rounded-md border border-border bg-surface-raised py-1 shadow-md'

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        requestAnimationFrame(() => {
          const firstEnabled = this.items().find(item => !item.disabled())
          firstEnabled?.focus()
        })
      }
    })
  }

  /** Cancel close timers on this menu's trigger and all ancestor triggers */
  cancelCloseChain() {
    this.parentTrigger?.cancelClose()
    this.parentMenu()?.cancelCloseChain()
  }

  protected onPanelMouseEnter() {
    // Cancel close timers all the way up the ancestor chain
    this.cancelCloseChain()
  }

  protected onPanelMouseLeave() {
    // Only schedule close on the direct parent trigger
    this.parentTrigger?.scheduleClose()
  }

  open() {
    this.isOpen.set(true)
  }

  close() {
    this.isOpen.set(false)
  }

  /** Close this menu and all ancestor/descendant menus */
  closeTree() {
    this.close()
    // Walk up to the root and close everything
    let current = this.parentMenu()
    while (current) {
      current.close()
      current = current.parentMenu()
    }
  }

  closeAndRestoreFocus(restoreEl?: ElementRef | null) {
    this.close()
    restoreEl?.nativeElement.focus()
  }

  protected onOutsideClick(event: MouseEvent) {
    const trigger = this.triggerElement()
    if (trigger && trigger.nativeElement.contains(event.target as Node)) {
      return
    }
    this.closeTree()
  }

  protected onOverlayKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        event.stopPropagation()
        this.focusNext()
        break
      case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        this.focusPrev()
        break
      case 'ArrowRight':
        // Handled by UiSubMenuTrigger on the focused item
        break
      case 'ArrowLeft':
        if (this.isSubmenu()) {
          event.preventDefault()
          event.stopPropagation()
          this.closeAndRestoreFocus(this.triggerElement())
        }
        break
      case 'Home':
        event.preventDefault()
        event.stopPropagation()
        this.focusFirst()
        break
      case 'End':
        event.preventDefault()
        event.stopPropagation()
        this.focusLast()
        break
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        if (this.isSubmenu()) {
          this.closeAndRestoreFocus(this.triggerElement())
        } else {
          this.closeAndRestoreFocus(this.triggerElement())
        }
        break
      case 'Tab':
        this.closeTree()
        break
    }
  }

  private getEnabledItems() {
    return this.items().filter(item => !item.disabled())
  }

  private getActiveIndex(enabledItems: readonly UiMenuItem[]) {
    return enabledItems.findIndex(
      item => item.el.nativeElement === document.activeElement,
    )
  }

  private focusNext() {
    const enabledItems = this.getEnabledItems()
    if (!enabledItems.length) return
    const currentIndex = this.getActiveIndex(enabledItems)
    const nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0
    enabledItems[nextIndex].focus()
  }

  private focusPrev() {
    const enabledItems = this.getEnabledItems()
    if (!enabledItems.length) return
    const currentIndex = this.getActiveIndex(enabledItems)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1
    enabledItems[prevIndex].focus()
  }

  private focusFirst() {
    const enabledItems = this.getEnabledItems()
    if (enabledItems.length) enabledItems[0].focus()
  }

  private focusLast() {
    const enabledItems = this.getEnabledItems()
    if (enabledItems.length) enabledItems[enabledItems.length - 1].focus()
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiMenuTrigger]',
  host: {
    '(click)': 'onClick()',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu().isOpen()',
  },
})
export class UiMenuTrigger {
  readonly menu = input.required<UiMenu>({ alias: 'uiMenuTrigger' })
  readonly menuPosition = input<MenuPosition>('below-start')

  private readonly el = inject(ElementRef)

  constructor() {
    effect(() => {
      const m = this.menu()
      m.triggerElement.set(this.el)
      m.rootPosition.set(this.menuPosition())
      m.isSubmenu.set(false)
    })
  }

  protected onClick() {
    const m = this.menu()
    if (m.isOpen()) {
      m.close()
    } else {
      m.open()
    }
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiSubMenuTrigger]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown.ArrowRight)': 'onArrowRight($event)',
  },
})
export class UiSubMenuTrigger implements OnInit {
  readonly childMenu = input.required<UiMenu>({ alias: 'uiSubMenuTrigger' })

  private readonly item = inject(UiMenuItem)
  private readonly parentMenu = inject(UiMenu)
  private readonly destroyRef = inject(DestroyRef)

  private hoverTimer: ReturnType<typeof setTimeout> | null = null

  ngOnInit() {
    this.item.hasSubMenu.set(true)

    const child = this.childMenu()
    child.triggerElement.set(this.item.el)
    child.isSubmenu.set(true)
    child.parentMenu.set(this.parentMenu)

    child.parentTrigger = this

    this.destroyRef.onDestroy(() => this.clearHoverTimer())
  }

  protected onMouseEnter() {
    this.clearHoverTimer()
    this.hoverTimer = setTimeout(() => this.openChild(), HOVER_DELAY)
  }

  protected onMouseLeave() {
    this.scheduleClose()
  }

  protected onArrowRight(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.openChild()
  }

  /** Cancel any pending close — called when mouse enters the child panel */
  cancelClose() {
    this.clearHoverTimer()
  }

  /** Schedule closing after delay — called when mouse leaves the child panel */
  scheduleClose() {
    this.clearHoverTimer()
    this.hoverTimer = setTimeout(() => this.closeChild(), HOVER_DELAY)
  }

  private openChild() {
    if (this.item.disabled()) return
    const child = this.childMenu()
    child.open()
    this.item.subMenuOpen.set(true)
  }

  private closeChild() {
    const child = this.childMenu()
    child.close()
    this.item.subMenuOpen.set(false)
  }

  private clearHoverTimer() {
    if (this.hoverTimer !== null) {
      clearTimeout(this.hoverTimer)
      this.hoverTimer = null
    }
  }
}
