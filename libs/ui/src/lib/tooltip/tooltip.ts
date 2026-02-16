import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  signal,
} from '@angular/core'
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { FocusMonitor } from '@angular/cdk/a11y'

export type TooltipPosition = 'above' | 'below' | 'start' | 'end'

const POSITION_MAP: Record<TooltipPosition, ConnectedPosition[]> = {
  above: [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  ],
  below: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  ],
  start: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
  ],
  end: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
  ],
}

function resolveActualPosition(pos: ConnectedPosition): TooltipPosition {
  if (pos.originY === 'top' && pos.overlayY === 'bottom') return 'above'
  if (pos.originY === 'bottom' && pos.overlayY === 'top') return 'below'
  if (pos.originX === 'start' && pos.overlayX === 'end') return 'start'
  return 'end'
}

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-tooltip-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tooltip',
    '[id]': 'id()',
    class:
      'pointer-events-none relative inline-block max-w-xs ' +
      'rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md break-words',
  },
  styles: `
    :host {
      animation: ui-tooltip-enter 100ms ease-out;
    }
    @keyframes ui-tooltip-enter {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `,
  template: `
    <span class="relative z-10">{{ message() }}</span>
    <span [class]="arrowClasses()"></span>
  `,
})
export class UiTooltipPanel {
  readonly id = signal('')
  readonly message = signal('')
  readonly position = signal<TooltipPosition>('above')

  protected readonly arrowClasses = computed(() => {
    const base = 'absolute h-2 w-2 rotate-45 bg-foreground'
    const positionStyles: Record<TooltipPosition, string> = {
      above: '-bottom-1 left-1/2 -translate-x-1/2',
      below: '-top-1 left-1/2 -translate-x-1/2',
      start: '-end-1 top-1/2 -translate-y-1/2',
      end: '-start-1 top-1/2 -translate-y-1/2',
    }
    return `${base} ${positionStyles[this.position()]}`
  })
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiTooltip]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown.escape)': 'hide()',
    '[attr.aria-describedby]': 'tooltipId()',
  },
})
export class UiTooltip implements OnDestroy {
  readonly uiTooltip = input('')
  readonly uiTooltipPosition = input<TooltipPosition>('above')
  readonly uiTooltipShowDelay = input(200, { transform: numberAttribute })
  readonly uiTooltipHideDelay = input(0, { transform: numberAttribute })
  readonly uiTooltipDisabled = input(false, { transform: booleanAttribute })

  private readonly overlay = inject(Overlay)
  private readonly el = inject(ElementRef)
  private readonly focusMonitor = inject(FocusMonitor)

  private overlayRef: OverlayRef | null = null
  private showTimeout: ReturnType<typeof setTimeout> | null = null
  private hideTimeout: ReturnType<typeof setTimeout> | null = null
  private isHovered = false
  private isFocused = false

  readonly tooltipId = signal<string | null>(null)

  constructor() {
    this.focusMonitor.monitor(this.el).subscribe(origin => {
      if (origin === 'keyboard') {
        this.isFocused = true
        this.scheduleShow()
      } else if (!origin) {
        this.isFocused = false
        if (!this.isHovered) this.scheduleHide()
      }
    })
  }

  protected onMouseEnter() {
    this.isHovered = true
    this.scheduleShow()
  }

  protected onMouseLeave() {
    this.isHovered = false
    if (!this.isFocused) this.scheduleHide()
  }

  hide() {
    this.clearTimers()
    if (this.overlayRef) {
      this.overlayRef.dispose()
      this.overlayRef = null
      this.tooltipId.set(null)
    }
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.el)
    this.hide()
  }

  private scheduleShow() {
    this.clearHideTimeout()
    if (this.overlayRef || this.showTimeout) return
    if (this.uiTooltipDisabled() || !this.uiTooltip()) return

    const delay = this.uiTooltipShowDelay()
    if (delay > 0) {
      this.showTimeout = setTimeout(() => {
        this.showTimeout = null
        this.createTooltip()
      }, delay)
    } else {
      this.createTooltip()
    }
  }

  private scheduleHide() {
    this.clearShowTimeout()
    if (!this.overlayRef) return

    const delay = this.uiTooltipHideDelay()
    if (delay > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hideTimeout = null
        this.hide()
      }, delay)
    } else {
      this.hide()
    }
  }

  private createTooltip() {
    if (this.overlayRef) return

    const id = `ui-tooltip-${nextId++}`
    this.tooltipId.set(id)
    const preferredPosition = this.uiTooltipPosition()

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.el)
      .withPositions(POSITION_MAP[preferredPosition])

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    })

    const portal = new ComponentPortal(UiTooltipPanel)
    const ref = this.overlayRef.attach(portal)
    ref.instance.id.set(id)
    ref.instance.message.set(this.uiTooltip())
    ref.instance.position.set(preferredPosition)

    ;(positionStrategy as FlexibleConnectedPositionStrategy)
      .positionChanges
      .subscribe(change => {
        ref.instance.position.set(resolveActualPosition(change.connectionPair))
      })

    this.overlayRef.detachments().subscribe(() => {
      this.hide()
    })
  }

  private clearTimers() {
    this.clearShowTimeout()
    this.clearHideTimeout()
  }

  private clearShowTimeout() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout)
      this.showTimeout = null
    }
  }

  private clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = null
    }
  }
}
