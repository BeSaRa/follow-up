import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { A11yModule } from '@angular/cdk/a11y'

// ── Types ────────────────────────────────────────────────────────

export type DrawerPosition = 'start' | 'end'
export type DrawerMode = 'overlay' | 'push'

// ── UiDrawerContent ──────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-drawer-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block flex-1 overflow-y-auto px-4 py-3',
  },
})
export class UiDrawerContent {}

// ── UiDrawerFooter ───────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-drawer-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block px-4 py-3 border-t border-border',
  },
})
export class UiDrawerFooter {}

// ── UiDrawer ─────────────────────────────────────────────────────

let nextId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule],
  styles: `
    :host {
      display: block;
    }

    .ui-drawer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 40;
      background: rgb(0 0 0 / 0.5);
      opacity: 0;
      transition: opacity 200ms ease-out;
      pointer-events: none;
    }

    .ui-drawer-backdrop.visible {
      opacity: 1;
      pointer-events: auto;
    }

    .ui-drawer-panel {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      width: var(--ui-drawer-width, 20rem);
      max-width: calc(100vw - 2rem);
      background: var(--color-surface-raised, #fff);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      transition: transform 200ms ease-out;
      transform: translateX(var(--ui-drawer-hide-x));
    }

    .ui-drawer-panel.mode-push {
      position: absolute;
    }

    .ui-drawer-panel.position-start {
      inset-inline-start: 0;
      border-inline-end: 1px solid var(--color-border, #e5e7eb);
      --ui-drawer-hide-x: -100%;
    }

    :host-context([dir="rtl"]) .ui-drawer-panel.position-start {
      --ui-drawer-hide-x: 100%;
    }

    .ui-drawer-panel.position-end {
      inset-inline-end: 0;
      border-inline-start: 1px solid var(--color-border, #e5e7eb);
      --ui-drawer-hide-x: 100%;
    }

    :host-context([dir="rtl"]) .ui-drawer-panel.position-end {
      --ui-drawer-hide-x: -100%;
    }

    .ui-drawer-panel.panel-open {
      transform: translateX(0);
    }

    .ui-drawer-panel.closing {
      transition: transform 150ms ease-in;
    }
  `,
  template: `
    @if (showBackdrop()) {
      <div
        class="ui-drawer-backdrop"
        [class.visible]="visuallyOpen()"
        aria-hidden="true"
        (click)="onBackdropClick()"
      ></div>
    }
    @if (rendered()) {
      <div
        [attr.id]="panelId"
        class="ui-drawer-panel"
        [class.position-start]="position() === 'start'"
        [class.position-end]="position() === 'end'"
        [class.mode-push]="mode() === 'push'"
        [class.panel-open]="visuallyOpen()"
        [class.closing]="closing()"
        role="dialog"
        [attr.aria-modal]="mode() === 'overlay'"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [cdkTrapFocus]="mode() === 'overlay' && open()"
        [cdkTrapFocusAutoCapture]="true"
        (transitionend)="onTransitionEnd($event)"
        (keydown.escape)="onEscape()"
      >
        <ng-content />
      </div>
    }
  `,
})
export class UiDrawer {
  private readonly doc = inject(DOCUMENT)
  private readonly destroyRef = inject(DestroyRef)

  readonly open = model(false)
  readonly position = input<DrawerPosition>('start')
  readonly mode = input<DrawerMode>('overlay')
  readonly hasBackdrop = input(true, { transform: booleanAttribute })
  readonly closeOnBackdropClick = input(true, { transform: booleanAttribute })
  readonly closeOnEscape = input(true, { transform: booleanAttribute })
  readonly ariaLabel = input<string | null>(null)
  readonly ariaLabelledBy = input<string | null>(null)

  readonly opened = output<void>()
  readonly closed = output<void>()

  protected readonly panelId = `ui-drawer-panel-${nextId++}`
  protected readonly rendered = signal(false)
  private readonly _visuallyOpen = signal(false)
  /** Whether the panel is visually open (delayed by one frame for animation). */
  readonly visuallyOpen = this._visuallyOpen.asReadonly()
  protected readonly closing = signal(false)

  protected readonly showBackdrop = computed(
    () => this.hasBackdrop() && this.mode() === 'overlay' && this.rendered(),
  )

  private previouslyFocused: HTMLElement | null = null
  private destroyed = false

  constructor() {
    effect(() => {
      const isOpen = this.open()
      if (isOpen) {
        this.previouslyFocused = this.doc.activeElement as HTMLElement | null
        this.rendered.set(true)
        this.closing.set(false)
        // Wait two frames: first for DOM insertion, second for browser paint,
        // then add the open class so the CSS transition plays.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!this.destroyed) {
              this._visuallyOpen.set(true)
              this.opened.emit()
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

  protected onBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.open.set(false)
    }
  }

  protected onEscape() {
    if (this.closeOnEscape()) {
      this.open.set(false)
    }
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

// ── UiDrawerContainer ────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-drawer-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: flex;
      overflow: hidden;
      position: relative;
    }

    .ui-drawer-container-content {
      flex: 1;
      min-width: 0;
      transition: margin 200ms ease-out;
    }
  `,
  template: `
    <ng-content select="ui-drawer" />
    <div
      class="ui-drawer-container-content"
      [style.margin-inline-start]="marginStart()"
      [style.margin-inline-end]="marginEnd()"
    >
      <ng-content />
    </div>
  `,
})
export class UiDrawerContainer {
  private readonly drawer = contentChild(UiDrawer)

  protected readonly marginStart = computed(() => {
    const d = this.drawer()
    if (!d || d.mode() !== 'push' || !d.visuallyOpen()) return '0'
    return d.position() === 'start' ? 'var(--ui-drawer-width, 20rem)' : '0'
  })

  protected readonly marginEnd = computed(() => {
    const d = this.drawer()
    if (!d || d.mode() !== 'push' || !d.visuallyOpen()) return '0'
    return d.position() === 'end' ? 'var(--ui-drawer-width, 20rem)' : '0'
  })
}

// ── UiDrawerHeader ───────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-drawer-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between">
      <ng-content />
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md p-1 text-foreground-muted hover:text-foreground hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        aria-label="Close drawer"
        (click)="close()"
      >
        <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  `,
  host: {
    class: 'block px-4 py-3 border-b border-border',
  },
})
export class UiDrawerHeader {
  private readonly drawer = inject(UiDrawer)

  protected close() {
    this.drawer.open.set(false)
  }
}

// ── UiDrawerClose ────────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[uiDrawerClose]',
  host: {
    '(click)': 'close()',
  },
})
export class UiDrawerClose {
  private readonly drawer = inject(UiDrawer)

  protected close() {
    this.drawer.open.set(false)
  }
}
