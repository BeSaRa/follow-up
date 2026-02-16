import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core'

// ── UiNavbarLink ──────────────────────────────────────────────────

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'a[uiNavbarLink]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-current]': 'active() ? "page" : null',
  },
})
export class UiNavbarLink {
  readonly active = input(false, { transform: booleanAttribute })

  readonly el = inject(ElementRef<HTMLAnchorElement>)

  protected readonly hostClasses = computed(() => {
    const base =
      'text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-3 py-2 md:py-1'

    return this.active()
      ? `${base} text-foreground font-medium border-b-2 border-primary`
      : `${base} text-foreground-muted hover:text-foreground`
  })

  focus() {
    this.el.nativeElement.focus()
  }
}

// ── UiNavbarBrand ─────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-navbar-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-2 shrink-0',
  },
})
export class UiNavbarBrand {}

// ── UiNavbarActions ───────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-navbar-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-2 shrink-0',
  },
})
export class UiNavbarActions {}

// ── UiNavbarNav ───────────────────────────────────────────────────

let nextNavId = 0

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-navbar-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'contents',
    '(keydown.escape)': 'closeMobile()',
  },
  template: `
    <div
      [attr.id]="panelId"
      [class]="containerClasses()"
    >
      <ng-content />
    </div>
  `,
})
export class UiNavbarNav {
  readonly links = contentChildren(UiNavbarLink)

  readonly panelId = `ui-navbar-nav-${nextNavId++}`
  readonly mobileOpen = signal(false)

  private previouslyFocused: HTMLElement | null = null

  protected readonly containerClasses = computed(() => {
    const desktop = 'md:flex md:flex-row md:items-center md:gap-1 md:static md:border-0 md:shadow-none md:bg-transparent md:py-0 md:px-0'

    if (this.mobileOpen()) {
      return `flex flex-col absolute start-0 end-0 top-16 border-b border-border bg-surface-raised shadow-md py-2 px-4 z-30 ${desktop}`
    }

    return `hidden ${desktop}`
  })

  openMobile() {
    this.previouslyFocused = document.activeElement as HTMLElement | null
    this.mobileOpen.set(true)
    requestAnimationFrame(() => {
      const first = this.links()?.[0]
      first?.focus()
    })
  }

  closeMobile() {
    this.mobileOpen.set(false)
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus()
      this.previouslyFocused = null
    }
  }

  toggleMobile() {
    if (this.mobileOpen()) {
      this.closeMobile()
    } else {
      this.openMobile()
    }
  }
}

// ── UiNavbar ──────────────────────────────────────────────────────

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'navigation',
    'aria-label': 'Main navigation',
    '[class]': 'hostClasses()',
  },
  template: `
    <div class="mx-auto flex h-16 w-full items-center gap-4 px-4">
      <ng-content select="ui-navbar-brand" />

      <div class="flex-1">
        <ng-content select="ui-navbar-nav" />
      </div>

      <ng-content select="ui-navbar-actions" />

      @if (nav()) {
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors md:hidden"
          [attr.aria-expanded]="nav()!.mobileOpen()"
          [attr.aria-controls]="nav()!.panelId"
          aria-label="Toggle navigation"
          (click)="nav()!.toggleMobile()"
        >
          <svg
            class="size-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            @if (nav()!.mobileOpen()) {
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            }
          </svg>
        </button>
      }
    </div>
  `,
})
export class UiNavbar {
  readonly fixed = input(false, { transform: booleanAttribute })
  readonly elevated = input(true, { transform: booleanAttribute })

  protected readonly nav = contentChild(UiNavbarNav)

  protected readonly hostClasses = computed(() => {
    const base = 'block relative w-full bg-surface-raised border-b border-border'
    const fixedClasses = this.fixed() ? 'fixed top-0 start-0 end-0 z-40' : ''
    const elevatedClasses = this.elevated() ? 'shadow-sm' : ''

    return [base, fixedClasses, elevatedClasses].filter(Boolean).join(' ')
  })
}
