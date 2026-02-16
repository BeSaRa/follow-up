import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { CdkConnectedOverlay, ConnectedPosition } from '@angular/cdk/overlay'

export type PopoverPosition =
  | 'above'
  | 'above-start'
  | 'above-end'
  | 'below'
  | 'below-start'
  | 'below-end'
  | 'start'
  | 'end'

const POSITION_MAP: Record<PopoverPosition, ConnectedPosition[]> = {
  'above': [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
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
  'below': [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  ],
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
  'start': [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
  ],
  'end': [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
  ],
}

function getOffsets(position: PopoverPosition): { offsetX: number; offsetY: number } {
  switch (position) {
    case 'above':
    case 'above-start':
    case 'above-end':
      return { offsetX: 0, offsetY: -4 }
    case 'below':
    case 'below-start':
    case 'below-end':
      return { offsetX: 0, offsetY: 4 }
    case 'start':
      return { offsetX: -4, offsetY: 0 }
    case 'end':
      return { offsetX: 4, offsetY: 0 }
  }
}

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerElement()!"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="overlayPositions()"
      [cdkConnectedOverlayOffsetX]="offsets().offsetX"
      [cdkConnectedOverlayOffsetY]="offsets().offsetY"
      (overlayOutsideClick)="onOutsideClick($event)"
      (overlayKeydown)="onOverlayKeydown($event)"
      (detach)="close()"
    >
      <div
        role="dialog"
        [id]="panelId"
        [class]="panelClasses"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: none;
    }
    .ui-popover-panel {
      animation: ui-popover-enter 100ms ease-out;
    }
    @keyframes ui-popover-enter {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `,
})
export class UiPopover {
  readonly position = input<PopoverPosition>('below-start')
  readonly opened = output<void>()
  readonly closed = output<void>()

  readonly panelId = `ui-popover-${nextId++}`
  readonly isOpen = signal(false)
  readonly triggerElement = signal<ElementRef | null>(null)

  /** Set by UiPopoverTrigger so we can restore focus */
  triggerRef: ElementRef | null = null

  protected readonly overlayPositions = computed(() => POSITION_MAP[this.position()])
  protected readonly offsets = computed(() => getOffsets(this.position()))

  protected readonly panelClasses =
    'rounded-md border border-border bg-surface-raised shadow-md ' +
    'ui-popover-panel'

  open() {
    if (this.isOpen()) return
    this.isOpen.set(true)
    this.opened.emit()
    requestAnimationFrame(() => {
      const panel = document.getElementById(this.panelId)
      if (!panel) return
      const focusable = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    })
  }

  close() {
    if (!this.isOpen()) return
    this.isOpen.set(false)
    this.closed.emit()
  }

  toggle() {
    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  protected onOutsideClick(event: MouseEvent) {
    const trigger = this.triggerRef
    if (trigger && trigger.nativeElement.contains(event.target as Node)) {
      return
    }
    this.close()
  }

  protected onOverlayKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        this.close()
        this.triggerRef?.nativeElement.focus()
        break
      case 'Tab':
        this.close()
        break
    }
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiPopoverTrigger]',
  host: {
    '(click)': 'onClick()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'popover().isOpen()',
    '[attr.aria-controls]': 'popover().panelId',
  },
})
export class UiPopoverTrigger {
  readonly popover = input.required<UiPopover>({ alias: 'uiPopoverTrigger' })

  private readonly el = inject(ElementRef)

  constructor() {
    effect(() => {
      const p = this.popover()
      p.triggerElement.set(this.el)
      p.triggerRef = this.el
    })
  }

  protected onClick() {
    this.popover().toggle()
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiPopoverClose]',
  host: {
    '(click)': 'onClick()',
  },
})
export class UiPopoverClose {
  private readonly popover = inject(UiPopover)

  protected onClick() {
    this.popover.close()
    this.popover.triggerRef?.nativeElement.focus()
  }
}
