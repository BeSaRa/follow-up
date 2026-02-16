import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  InjectionToken,
  input,
  output,
  signal,
  type OnDestroy,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Subject } from 'rxjs'

// ── Types ────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastPosition =
  | 'top-end'
  | 'top-start'
  | 'top-center'
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom-center'

export interface ToastOptions {
  title?: string
  duration?: number
  dismissible?: boolean
  action?: { label: string, callback: () => void }
  position?: ToastPosition
}

export interface ToastConfig extends ToastOptions {
  message: string
  variant: ToastVariant
}

export interface ToastDefaults {
  position: ToastPosition
  duration: number
}

// ── Internal data ────────────────────────────────────────────────

interface ToastData {
  id: number
  message: string
  variant: ToastVariant
  title?: string
  duration: number
  dismissible: boolean
  action?: { label: string, callback: () => void }
  position: ToastPosition
  state: 'entering' | 'visible' | 'leaving'
}

// ── ToastRef ─────────────────────────────────────────────────────

export class ToastRef {
  private readonly _afterDismissed = new Subject<void>()
  readonly afterDismissed = this._afterDismissed.asObservable()

  constructor(
    private readonly _id: number,
    private readonly _dismissFn: (id: number) => void,
  ) {}

  dismiss(): void {
    this._dismissFn(this._id)
  }

  /** @internal */
  _complete(): void {
    this._afterDismissed.next()
    this._afterDismissed.complete()
  }
}

// ── Injection token for defaults ─────────────────────────────────

const TOAST_DEFAULTS = new InjectionToken<ToastDefaults>('TOAST_DEFAULTS')

export function provideToastDefaults(config: Partial<ToastDefaults>) {
  return {
    provide: TOAST_DEFAULTS,
    useValue: {
      position: config.position ?? 'bottom-end',
      duration: config.duration ?? 5000,
    } satisfies ToastDefaults,
  }
}

// ── Variant config ───────────────────────────────────────────────

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
}

const VARIANT_COLORS: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
}

const VARIANT_BORDERS: Record<ToastVariant, string> = {
  success: 'border-s-success',
  error: 'border-s-error',
  warning: 'border-s-warning',
  info: 'border-s-info',
}

// ── UiToast (individual toast) ───────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(mouseenter)': 'hoverIn.emit(data().id)',
    '(mouseleave)': 'hoverOut.emit(data().id)',
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true',
  },
  template: `
    <div class="flex gap-3">
      <svg
        class="size-5 shrink-0 mt-0.5"
        [class]="iconColor()"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path [attr.d]="iconPath()" />
      </svg>
      <div class="flex-1 min-w-0">
        @if (data().title) {
          <p class="text-sm font-semibold text-foreground">{{ data().title }}</p>
        }
        <p class="text-sm text-foreground-muted" [class.mt-0.5]="!!data().title">{{ data().message }}</p>
        @if (data().action) {
          <button
            type="button"
            class="mt-2 text-sm font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors"
            (click)="onAction($event)"
          >
            {{ data().action!.label }}
          </button>
        }
      </div>
      @if (data().dismissible) {
        <button
          type="button"
          class="shrink-0 cursor-pointer text-foreground-muted hover:text-foreground transition-colors"
          aria-label="Dismiss"
          (click)="dismissed.emit(data().id)"
        >
          <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  `,
})
export class UiToast {
  readonly data = input.required<ToastData>()
  readonly dismissed = output<number>()
  readonly hoverIn = output<number>()
  readonly hoverOut = output<number>()

  protected readonly iconPath = computed(() => VARIANT_ICONS[this.data().variant])
  protected readonly iconColor = computed(() => VARIANT_COLORS[this.data().variant])

  protected readonly hostClasses = computed(() => {
    const d = this.data()
    const base = 'block w-80 rounded-md border border-border border-s-4 bg-background p-4 shadow-lg pointer-events-auto transition-all duration-200'
    const borderColor = VARIANT_BORDERS[d.variant]
    const stateClass = d.state === 'visible'
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-2'
    return `${base} ${borderColor} ${stateClass}`
  })

  protected onAction(event: Event) {
    event.stopPropagation()
    this.data().action?.callback()
    this.dismissed.emit(this.data().id)
  }
}

// ── UiToastContainer ─────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiToast],
  host: {
    '[class]': 'hostClasses()',
  },
  styles: `
    :host {
      position: fixed;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
    }
  `,
  template: `
    @for (toast of toasts(); track toast.id) {
      <ui-toast
        [data]="toast"
        (dismissed)="startDismiss($event)"
        (hoverIn)="pauseTimer($event)"
        (hoverOut)="resumeTimerForToast($event)"
      />
    }
  `,
})
export class UiToastContainer implements OnDestroy {
  readonly position = input<ToastPosition>('bottom-end')
  readonly toasts = signal<ToastData[]>([])

  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>()
  private readonly durations = new Map<number, number>()
  private readonly refs = new Map<number, ToastRef>()
  private readonly dismissFn = (id: number) => this.startDismiss(id)

  protected readonly hostClasses = computed(() => {
    const pos = this.position()
    const classes = ['toast-container']

    if (pos.startsWith('top')) {
      classes.push('top-4')
    } else {
      classes.push('bottom-4')
    }

    if (pos.endsWith('-end')) {
      classes.push('end-4 items-end')
    } else if (pos.endsWith('-start')) {
      classes.push('start-4 items-start')
    } else {
      classes.push('left-1/2 -translate-x-1/2 items-center')
    }

    return classes.join(' ')
  })

  ngOnDestroy() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
  }

  addToast(data: Omit<ToastData, 'id' | 'state'>, id: number): ToastRef {
    const toast: ToastData = { ...data, id, state: 'entering' }
    const ref = new ToastRef(id, this.dismissFn)
    this.refs.set(id, ref)
    this.durations.set(id, data.duration)

    this.toasts.update(toasts => [...toasts, toast])

    // Trigger enter -> visible transition
    setTimeout(() => {
      this.toasts.update(toasts =>
        toasts.map(t => t.id === id && t.state === 'entering' ? { ...t, state: 'visible' } : t),
      )
    }, 20)

    // Start auto-dismiss timer
    if (data.duration > 0) {
      this.startTimer(id, data.duration)
    }

    return ref
  }

  startDismiss(id: number) {
    this.clearTimer(id)

    // Prevent double-dismiss
    const current = this.toasts().find(t => t.id === id)
    if (!current || current.state === 'leaving') return

    // Set leaving state
    this.toasts.update(toasts =>
      toasts.map(t => t.id === id ? { ...t, state: 'leaving' as const } : t),
    )

    // Remove after animation
    setTimeout(() => {
      this.toasts.update(toasts => toasts.filter(t => t.id !== id))
      const ref = this.refs.get(id)
      if (ref) {
        ref._complete()
        this.refs.delete(id)
      }
      this.durations.delete(id)
    }, 200)
  }

  dismissAll() {
    const currentToasts = this.toasts()
    for (const toast of currentToasts) {
      this.startDismiss(toast.id)
    }
  }

  pauseTimer(id: number) {
    this.clearTimer(id)
  }

  resumeTimerForToast(id: number) {
    const duration = this.durations.get(id)
    if (duration && duration > 0) {
      this.startTimer(id, duration)
    }
  }

  private startTimer(id: number, duration: number) {
    this.clearTimer(id)
    const timer = setTimeout(() => this.startDismiss(id), duration)
    this.timers.set(id, timer)
  }

  private clearTimer(id: number) {
    const timer = this.timers.get(id)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(id)
    }
  }
}

// ── ToastService ─────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly appRef = inject(ApplicationRef)
  private readonly injector = inject(EnvironmentInjector)
  private readonly document = inject(DOCUMENT)
  private readonly defaults = inject(TOAST_DEFAULTS, { optional: true })

  private readonly containers = new Map<ToastPosition, ComponentRef<UiToastContainer>>()
  private readonly cleanupTimers = new Map<ToastPosition, ReturnType<typeof setInterval>>()
  private nextId = 0

  private get defaultPosition(): ToastPosition {
    return this.defaults?.position ?? 'bottom-end'
  }

  private get defaultDuration(): number {
    return this.defaults?.duration ?? 5000
  }

  success(message: string, options?: ToastOptions): ToastRef {
    return this.show({ ...options, message, variant: 'success' })
  }

  error(message: string, options?: ToastOptions): ToastRef {
    return this.show({ ...options, message, variant: 'error' })
  }

  warning(message: string, options?: ToastOptions): ToastRef {
    return this.show({ ...options, message, variant: 'warning' })
  }

  info(message: string, options?: ToastOptions): ToastRef {
    return this.show({ ...options, message, variant: 'info' })
  }

  show(config: ToastConfig): ToastRef {
    const position = config.position ?? this.defaultPosition
    const container = this.getOrCreateContainer(position)
    const id = this.nextId++

    return container.instance.addToast({
      message: config.message,
      variant: config.variant,
      title: config.title,
      duration: config.duration ?? this.defaultDuration,
      dismissible: config.dismissible ?? true,
      action: config.action,
      position,
    }, id)
  }

  dismissAll(): void {
    for (const container of this.containers.values()) {
      container.instance.dismissAll()
    }
  }

  private getOrCreateContainer(position: ToastPosition): ComponentRef<UiToastContainer> {
    const existing = this.containers.get(position)
    if (existing) return existing

    const containerRef = createComponent(UiToastContainer, {
      environmentInjector: this.injector,
    })

    containerRef.setInput('position', position)
    this.appRef.attachView(containerRef.hostView)
    this.document.body.appendChild(containerRef.location.nativeElement)
    this.containers.set(position, containerRef)

    // Watch for empty container and clean up
    const checkEmpty = setInterval(() => {
      if (containerRef.instance.toasts().length === 0) {
        clearInterval(checkEmpty)
        this.cleanupTimers.delete(position)
        this.destroyContainer(position)
      }
    }, 500)
    this.cleanupTimers.set(position, checkEmpty)

    return containerRef
  }

  private destroyContainer(position: ToastPosition) {
    const ref = this.containers.get(position)
    if (!ref) return

    const timer = this.cleanupTimers.get(position)
    if (timer) {
      clearInterval(timer)
      this.cleanupTimers.delete(position)
    }

    this.appRef.detachView(ref.hostView)
    ref.location.nativeElement.remove()
    ref.destroy()
    this.containers.delete(position)
  }
}
