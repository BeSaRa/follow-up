import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay'

export type DropdownPosition =
  | 'below-start'
  | 'below-end'
  | 'below'
  | 'above-start'
  | 'above-end'
  | 'above'

const POSITION_MAP: Record<DropdownPosition, ConnectedPosition[]> = {
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
  'below': [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
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
  'above': [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  ],
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-dropdown-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'menuitem',
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onSelect()',
    '(keydown.Enter)': 'onSelect()',
    '(keydown.Space)': 'onSelect($event)',
  },
})
export class UiDropdownItem {
  readonly disabled = input(false, { transform: booleanAttribute })
  readonly selected = output<void>()

  readonly el = inject(ElementRef)
  private readonly menu = inject(forwardRef(() => UiDropdownMenu))

  protected readonly hostClasses = computed(() => {
    const base =
      'block w-full cursor-pointer px-3 py-2 text-left text-sm text-foreground ' +
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
    if (!this.disabled()) {
      this.selected.emit()
      this.menu.closeAndRestoreFocus()
    }
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-dropdown-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerElement()!"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions()"
      [cdkConnectedOverlayOffsetY]="4"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onOverlayKeydown($event)"
      (detach)="close()"
    >
      <div role="menu" [class]="panelClasses">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class UiDropdownMenu {
  readonly position = input<DropdownPosition>('below-start')

  readonly isOpen = signal(false)
  readonly triggerElement = signal<ElementRef | null>(null)

  readonly items = contentChildren(UiDropdownItem)

  protected readonly positions = computed(() => POSITION_MAP[this.position()])

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

  closeAndRestoreFocus() {
    this.close()
    this.triggerElement()?.nativeElement.focus()
  }

  toggle() {
    this.isOpen.update(v => !v)
  }

  open() {
    this.isOpen.set(true)
  }

  close() {
    this.isOpen.set(false)
  }

  setTrigger(el: ElementRef) {
    this.triggerElement.set(el)
  }

  protected onOutsideClick(event: MouseEvent) {
    const trigger = this.triggerElement()
    if (trigger && trigger.nativeElement.contains(event.target as Node)) {
      return
    }
    this.close()
  }

  protected onOverlayKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.focusNext()
        break
      case 'ArrowUp':
        event.preventDefault()
        this.focusPrev()
        break
      case 'Escape':
        event.preventDefault()
        this.closeAndRestoreFocus()
        break
      case 'Tab':
        this.close()
        break
    }
  }

  private focusNext() {
    const enabledItems = this.items().filter(item => !item.disabled())
    if (!enabledItems.length) return

    const currentIndex = enabledItems.findIndex(
      item => item.el.nativeElement === document.activeElement,
    )
    const nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0
    enabledItems[nextIndex].focus()
  }

  private focusPrev() {
    const enabledItems = this.items().filter(item => !item.disabled())
    if (!enabledItems.length) return

    const currentIndex = enabledItems.findIndex(
      item => item.el.nativeElement === document.activeElement,
    )
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1
    enabledItems[prevIndex].focus()
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiDropdownTrigger]',
  host: {
    '(click)': 'onClick()',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu().isOpen()',
  },
})
export class UiDropdownTrigger {
  readonly menu = input.required<UiDropdownMenu>({ alias: 'uiDropdownTrigger' })

  private readonly el = inject(ElementRef)

  constructor() {
    effect(() => {
      this.menu().setTrigger(this.el)
    })
  }

  protected onClick() {
    this.menu().toggle()
  }
}
