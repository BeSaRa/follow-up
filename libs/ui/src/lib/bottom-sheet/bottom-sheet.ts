import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  input,
  model,
  output,
  signal,
  TemplateRef,
  ViewContainerRef,
  viewChild,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { A11yModule } from '@angular/cdk/a11y'
import { ComponentType, Overlay } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Observable, Subject } from 'rxjs'

// ── Types ────────────────────────────────────────────────────────

export type BottomSheetSnapPoint = 'peek' | 'half' | 'full'

export interface BottomSheetConfig {
  snapPoints?: BottomSheetSnapPoint[]
  initialSnap?: BottomSheetSnapPoint
  swipeToDismiss?: boolean
  hasBackdrop?: boolean
  data?: unknown
}

const SNAP_HEIGHTS: Record<BottomSheetSnapPoint, string> = {
  peek: '25vh',
  half: '50vh',
  full: 'calc(100vh - 2rem)',
}

// ── Injection tokens ─────────────────────────────────────────────

export const BOTTOM_SHEET_DATA = new InjectionToken<unknown>('BOTTOM_SHEET_DATA')

// ── BottomSheetRef ───────────────────────────────────────────────

export class BottomSheetRef<T = unknown> { // eslint-disable-line @typescript-eslint/no-unused-vars
  private readonly _afterClosed = new Subject<unknown>()
  private _result: unknown = undefined

  /** @internal */
  _snapFn: ((point: BottomSheetSnapPoint) => void) | null = null
  /** @internal */
  _closeFn: ((result?: unknown) => void) | null = null

  close(result?: unknown): void {
    this._result = result
    this._closeFn?.(result)
  }

  afterClosed(): Observable<unknown> {
    return this._afterClosed.asObservable()
  }

  snap(point: BottomSheetSnapPoint): void {
    this._snapFn?.(point)
  }

  /** @internal */
  _emitClosed(): void {
    this._afterClosed.next(this._result)
    this._afterClosed.complete()
  }
}

// ── UiBottomSheetContent ─────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-bottom-sheet-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block overflow-y-auto px-4 pb-4 flex-1',
  },
})
export class UiBottomSheetContent {}

// ── UiBottomSheet ────────────────────────────────────────────────

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  styles: `
    :host {
      display: block;
    }

    .ui-bottom-sheet-backdrop {
      position: fixed;
      inset: 0;
      z-index: 40;
      background: rgb(0 0 0 / 0.5);
      opacity: 0;
      transition: opacity 200ms ease-out;
      pointer-events: none;
    }

    .ui-bottom-sheet-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .ui-bottom-sheet-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      border-top-left-radius: 0.75rem;
      border-top-right-radius: 0.75rem;
      background: var(--color-surface-raised, #fff);
      border-top: 1px solid var(--color-border, #e5e7eb);
      box-shadow: 0 -10px 25px -5px rgb(0 0 0 / 0.1), 0 -8px 10px -6px rgb(0 0 0 / 0.1);
      transition: transform 200ms ease-out;
      transform: translateY(100%);
      max-height: calc(100vh - 2rem);
      touch-action: none;
    }

    .ui-bottom-sheet-panel.panel-open {
      transform: translateY(0);
    }

    .ui-bottom-sheet-panel.closing {
      transition: transform 150ms ease-in;
    }

    .ui-bottom-sheet-panel.dragging {
      transition: none;
    }
  `,
  template: `
    @if (showBackdrop()) {
      <div
        class="ui-bottom-sheet-backdrop"
        [class.visible]="visuallyOpen()"
        aria-hidden="true"
        (click)="onBackdropClick()"
      ></div>
    }
    @if (rendered()) {
      <div
        [attr.id]="panelId"
        class="ui-bottom-sheet-panel"
        [class.panel-open]="visuallyOpen()"
        [class.closing]="closing()"
        [class.dragging]="dragging()"
        [style.height]="panelHeight()"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [cdkTrapFocus]="open()"
        [cdkTrapFocusAutoCapture]="true"
        (transitionend)="onTransitionEnd($event)"
        (keydown.escape)="onEscape()"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
      >
        <ng-content />
      </div>
    }
  `,
})
export class UiBottomSheet {
  private readonly doc = inject(DOCUMENT)
  private readonly destroyRef = inject(DestroyRef)

  readonly open = model(false)
  readonly snapPoints = input<BottomSheetSnapPoint[]>(['half', 'full'])
  readonly initialSnap = input<BottomSheetSnapPoint>('half')
  readonly swipeToDismiss = input(true, { transform: booleanAttribute })
  readonly hasBackdrop = input(true, { transform: booleanAttribute })
  readonly closeOnBackdropClick = input(true, { transform: booleanAttribute })
  readonly ariaLabel = input<string | null>(null)
  readonly ariaLabelledBy = input<string | null>(null)

  readonly opened = output<void>()
  readonly closed = output<void>()
  readonly snapChanged = output<BottomSheetSnapPoint>()

  protected readonly panelId = `ui-bottom-sheet-panel-${nextId++}`
  protected readonly rendered = signal(false)
  private readonly _visuallyOpen = signal(false)
  readonly visuallyOpen = this._visuallyOpen.asReadonly()
  protected readonly closing = signal(false)
  protected readonly dragging = signal(false)

  readonly currentSnap = signal<BottomSheetSnapPoint>('half')
  private dragStartY = 0
  private dragCurrentY = 0
  private pointerId: number | null = null
  private panelEl: HTMLElement | null = null

  protected readonly showBackdrop = computed(
    () => this.hasBackdrop() && this.rendered(),
  )

  protected readonly panelHeight = computed(
    () => SNAP_HEIGHTS[this.currentSnap()],
  )

  readonly snapIndex = computed(
    () => this.snapPoints().indexOf(this.currentSnap()),
  )

  private previouslyFocused: HTMLElement | null = null
  private destroyed = false

  constructor() {
    effect(() => {
      const isOpen = this.open()
      if (isOpen) {
        this.previouslyFocused = this.doc.activeElement as HTMLElement | null
        this.currentSnap.set(this.initialSnap())
        this.rendered.set(true)
        this.closing.set(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!this.destroyed) {
              this._visuallyOpen.set(true)
              this.opened.emit()
              this.snapChanged.emit(this.currentSnap())
            }
          })
        })
      } else if (this.rendered()) {
        this._visuallyOpen.set(false)
        this.closing.set(true)
      }
    })

    this.destroyRef.onDestroy(() => {
      this.destroyed = true
      this.restoreFocus()
    })
  }

  // ── Public API for snap navigation ──

  snapNext() {
    const points = this.snapPoints()
    const idx = points.indexOf(this.currentSnap())
    if (idx < points.length - 1) {
      this.snapTo(points[idx + 1])
    }
  }

  snapPrev() {
    const points = this.snapPoints()
    const idx = points.indexOf(this.currentSnap())
    if (idx > 0) {
      this.snapTo(points[idx - 1])
    } else if (this.swipeToDismiss()) {
      this.open.set(false)
    }
  }

  snapTo(point: BottomSheetSnapPoint) {
    this.currentSnap.set(point)
    this.snapChanged.emit(point)
  }

  // ── Drag handling ──

  protected onPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement
    if (!this.isHeaderArea(target)) return

    this.pointerId = event.pointerId
    this.dragStartY = event.clientY
    this.dragCurrentY = event.clientY
    this.dragging.set(true)
    this.panelEl = (event.currentTarget as HTMLElement)
    this.panelEl.setPointerCapture(event.pointerId)
  }

  protected onPointerMove(event: PointerEvent) {
    if (event.pointerId !== this.pointerId || !this.panelEl) return
    this.dragCurrentY = event.clientY
    const deltaY = this.dragCurrentY - this.dragStartY
    this.panelEl.style.transform = `translateY(${Math.max(0, deltaY)}px)`
  }

  protected onPointerUp(event: PointerEvent) {
    if (event.pointerId !== this.pointerId || !this.panelEl) return

    const deltaY = this.dragCurrentY - this.dragStartY
    this.dragging.set(false)
    this.panelEl.style.transform = ''
    this.pointerId = null

    const panelHeight = this.panelEl.offsetHeight
    this.panelEl = null

    if (deltaY > panelHeight * 0.3) {
      const points = this.snapPoints()
      const idx = points.indexOf(this.currentSnap())
      if (idx > 0) {
        this.snapTo(points[idx - 1])
      } else if (this.swipeToDismiss()) {
        this.open.set(false)
      }
    } else if (deltaY < -(panelHeight * 0.3)) {
      const points = this.snapPoints()
      const idx = points.indexOf(this.currentSnap())
      if (idx < points.length - 1) {
        this.snapTo(points[idx + 1])
      }
    }
  }

  private isHeaderArea(target: HTMLElement): boolean {
    let el: HTMLElement | null = target
    const panel = this.doc.getElementById(this.panelId)
    while (el && el !== panel) {
      if (el.tagName === 'UI-BOTTOM-SHEET-HEADER') return true
      el = el.parentElement
    }
    return false
  }

  // ── Event handlers ──

  protected onBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.open.set(false)
    }
  }

  protected onEscape() {
    this.open.set(false)
  }

  protected onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'transform' && !this.open()) {
      this.rendered.set(false)
      this.closing.set(false)
      this.restoreFocus()
      this.closed.emit()
    }
  }

  private restoreFocus() {
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus()
      this.previouslyFocused = null
    }
  }
}

// ── UiBottomSheetHeader ──────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-bottom-sheet-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ui-bottom-sheet-handle"
      role="slider"
      tabindex="0"
      aria-label="Resize sheet"
      [attr.aria-valuenow]="sheet.snapIndex()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="sheet.snapPoints().length - 1"
      [attr.aria-valuetext]="sheet.currentSnap()"
      (keydown.ArrowUp)="sheet.snapNext()"
      (keydown.ArrowDown)="sheet.snapPrev()"
    >
      <div class="ui-bottom-sheet-handle-indicator"></div>
    </div>
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
      padding: 0 1rem;
      cursor: grab;
      user-select: none;
      touch-action: none;
    }

    :host:active {
      cursor: grabbing;
    }

    .ui-bottom-sheet-handle {
      display: flex;
      justify-content: center;
      padding: 0.5rem 0;
      outline: none;
    }

    .ui-bottom-sheet-handle:focus-visible .ui-bottom-sheet-handle-indicator {
      box-shadow: 0 0 0 2px var(--color-ring, #3b82f6);
    }

    .ui-bottom-sheet-handle-indicator {
      width: 2.5rem;
      height: 0.25rem;
      border-radius: 9999px;
      background: var(--color-border, #e5e7eb);
    }
  `,
})
export class UiBottomSheetHeader {
  readonly sheet = inject(UiBottomSheet)
}

// ── UiBottomSheetClose ───────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiBottomSheetClose]',
  host: {
    '(click)': 'close()',
  },
})
export class UiBottomSheetClose {
  private readonly sheet = inject(UiBottomSheet)

  protected close() {
    this.sheet.open.set(false)
  }
}

// ── BottomSheetService wrapper (internal) ────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-bottom-sheet-service-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBottomSheet, UiBottomSheetHeader, UiBottomSheetContent],
  styles: `
    :host { display: block; }
  `,
  template: `
    <ui-bottom-sheet
      [open]="_open()"
      (openChange)="_open.set($event)"
      [snapPoints]="_snapPoints()"
      [initialSnap]="_initialSnap()"
      [swipeToDismiss]="_swipeToDismiss()"
      [hasBackdrop]="false"
      (closed)="_closed.next()"
    >
      <ui-bottom-sheet-header>
        <span></span>
      </ui-bottom-sheet-header>
      <ui-bottom-sheet-content>
        <ng-template #outlet />
      </ui-bottom-sheet-content>
    </ui-bottom-sheet>
  `,
})
export class BottomSheetServiceWrapper {
  readonly _open = signal(false)
  readonly _snapPoints = signal<BottomSheetSnapPoint[]>(['half', 'full'])
  readonly _initialSnap = signal<BottomSheetSnapPoint>('half')
  readonly _swipeToDismiss = signal(true)
  readonly _closed = new Subject<void>()
  readonly _sheetRef = viewChild(UiBottomSheet)
  private readonly _outlet = viewChild('outlet', { read: ViewContainerRef })

  _componentType: ComponentType<unknown> | null = null
  _componentInjector: Injector | null = null
  _templateRef: TemplateRef<unknown> | null = null
  private _contentCreated = false

  constructor() {
    effect(() => {
      const outlet = this._outlet()
      if (!outlet || this._contentCreated) return

      if (this._componentType) {
        outlet.createComponent(this._componentType, {
          injector: this._componentInjector ?? undefined,
        })
        this._contentCreated = true
      } else if (this._templateRef) {
        outlet.createEmbeddedView(this._templateRef)
        this._contentCreated = true
      }
    })
  }
}

// ── BottomSheetService ───────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class BottomSheetService {
  private readonly overlay = inject(Overlay)
  private readonly injector = inject(Injector)

  open<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<T>,
    config: BottomSheetConfig = {},
  ): BottomSheetRef<T> {
    const {
      snapPoints = ['half', 'full'],
      initialSnap = 'half',
      swipeToDismiss = true,
      hasBackdrop = true,
      data,
    } = config

    const ref = new BottomSheetRef<T>()

    const overlayRef = this.overlay.create({
      hasBackdrop,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global(),
    })

    const bottomSheetInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: BottomSheetRef, useValue: ref },
        { provide: BOTTOM_SHEET_DATA, useValue: data },
      ],
    })

    const wrapperPortal = new ComponentPortal(
      BottomSheetServiceWrapper,
      null,
      bottomSheetInjector,
    )
    const wrapperRef = overlayRef.attach(wrapperPortal)
    const wrapper = wrapperRef.instance

    wrapper._snapPoints.set(snapPoints)
    wrapper._initialSnap.set(initialSnap)
    wrapper._swipeToDismiss.set(swipeToDismiss)

    if (componentOrTemplate instanceof TemplateRef) {
      wrapper._templateRef = componentOrTemplate
    } else {
      wrapper._componentType = componentOrTemplate
      wrapper._componentInjector = bottomSheetInjector
    }

    ref._closeFn = () => {
      wrapper._open.set(false)
    }

    ref._snapFn = (point: BottomSheetSnapPoint) => {
      wrapper._sheetRef()?.snapTo(point)
    }

    if (hasBackdrop) {
      overlayRef.backdropClick().subscribe(() => {
        wrapper._open.set(false)
      })
    }

    wrapper._closed.subscribe(() => {
      overlayRef.dispose()
      ref._emitClosed()
    })

    requestAnimationFrame(() => {
      wrapper._open.set(true)
    })

    return ref
  }
}
