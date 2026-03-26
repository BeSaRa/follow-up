import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core'
import { DOCUMENT, NgOptimizedImage } from '@angular/common'
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router'
import { TranslatePipe, TranslateService } from '@ngx-translate/core'
import {
  UiNavbar,
  UiNavbarBrand,
  UiNavbarActions,
  UiDrawer,
  UiDrawerContainer,
  UiDrawerContent,
  UiTooltip,
  UiDropdownTrigger,
  UiDropdownMenu,
  UiDropdownItem,
  UiAvatar,
} from '@follow-up/ui'
import { MatIcon } from '@angular/material/icon'
import { AuthStore } from '@follow-up/core'
import { APP_ICONS } from '../constants/icons'
import { NAV_GROUPS } from '../constants/nav-groups'

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    UiNavbar,
    UiNavbarBrand,
    UiNavbarActions,
    UiDrawer,
    UiDrawerContainer,
    UiDrawerContent,
    UiTooltip,
    UiDropdownTrigger,
    UiDropdownMenu,
    UiDropdownItem,
    UiAvatar,
    MatIcon,
    NgOptimizedImage,
  ],
  template: `
    <div class="flex h-screen flex-col">
      <ui-navbar [fixed]="false" [elevated]="true">
        <ui-navbar-brand>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            [attr.aria-label]="'layout.toggle_sidebar' | translate"
            (click)="sidebarOpen.set(!sidebarOpen())"
          >
            <mat-icon
              class="text-2xl! size-6! leading-6!"
              [svgIcon]="icons.MENU"
            />
          </button>
          <span class="text-lg font-bold text-foreground">{{
            'layout.app_title' | translate
          }}</span>
        </ui-navbar-brand>

        <ui-navbar-actions>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            [uiTooltip]="'layout.switch_language' | translate"
            uiTooltipPosition="below"
            (click)="toggleLanguage()"
          >
            {{ currentLang() === 'ar' ? 'EN' : 'عربي' }}
          </button>

          <button
            type="button"
            class="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300"
            [class]="darkMode() ? 'bg-slate-600' : 'bg-amber-200'"
            [attr.aria-label]="'layout.toggle_dark_mode' | translate"
            [uiTooltip]="
              (darkMode() ? 'layout.switch_to_light' : 'layout.switch_to_dark')
                | translate
            "
            uiTooltipPosition="below"
            (click)="darkMode.set(!darkMode())"
          >
            <span
              class="inline-flex size-5 items-center justify-center rounded-full shadow-sm transition-transform duration-300"
              [class]="
                darkMode()
                  ? 'bg-white ltr:translate-x-8 rtl:-translate-x-8'
                  : 'bg-white ltr:translate-x-1 rtl:-translate-x-1'
              "
            >
              @if (darkMode()) {
                <mat-icon
                  class="text-xs! size-3! leading-3! text-slate-700!"
                  [svgIcon]="icons.WEATHER_NIGHT"
                />
              } @else {
                <mat-icon
                  class="text-xs! size-3! leading-3! text-amber-500"
                  [svgIcon]="icons.WHITE_BALANCE_SUNNY"
                />
              }
            </span>
          </button>

          <div class="relative">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-foreground hover:bg-surface-hover transition-colors"
              [uiDropdownTrigger]="userMenu"
            >
              <ui-avatar size="sm" [initials]="store.userName() ?? '?'" />
              <span class="hidden sm:inline">{{ store.userName() }}</span>
              <mat-icon
                class="text-base! size-4! leading-4! text-foreground-muted"
                [svgIcon]="icons.CHEVRON_DOWN"
              />
            </button>
            <ui-dropdown-menu #userMenu position="below-end">
              <ui-dropdown-item (selected)="logout()">
                <span class="flex items-center gap-2">
                  <mat-icon
                    class="text-base! size-4! leading-4!"
                    [svgIcon]="icons.LOGOUT"
                  />
                  {{ 'layout.logout' | translate }}
                </span>
              </ui-dropdown-item>
            </ui-dropdown-menu>
          </div>
        </ui-navbar-actions>
      </ui-navbar>

      <ui-drawer-container
        class="flex-1 overflow-hidden bg-surface"
        style="--ui-drawer-width: 250px"
      >
        <ui-drawer
          (openChange)="sidebarOpen.set($event)"
          [open]="sidebarOpen()"
          position="start"
          mode="push"
          [hasBackdrop]="false"
          [closeOnEscape]="false"
        >
          <ui-drawer-content>
            <div class="flex items-center justify-center border-b border-border py-4">
              <img
                ngSrc="logo.png"
                alt="Logo"
                width="150"
                height="150"
              />
            </div>
            <nav class="flex flex-col gap-2 py-2">
              @for (group of sortedNavGroups(); track group.label) {
                <div>
                  @if (group.label) {
                    <span
                      class="px-3 text-xs font-semibold uppercase tracking-wider text-foreground-subtle"
                    >
                      {{ group.label | translate }}
                    </span>
                  }
                  <div class="mt-1 flex flex-col gap-1">
                    @for (item of group.items; track item.path) {
                      <a
                        [routerLink]="item.path"
                        routerLinkActive="bg-primary/10 text-primary font-medium"
                        [routerLinkActiveOptions]="{ exact: item.exact }"
                        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                      >
                        <mat-icon
                          class="text-xl! size-5! leading-5!"
                          [svgIcon]="item.icon"
                        />
                        {{ item.label | translate }}
                      </a>
                    }
                  </div>
                </div>
              }
            </nav>
          </ui-drawer-content>
        </ui-drawer>

        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </ui-drawer-container>
    </div>
  `,
})
export class Layout {
  private readonly doc = inject(DOCUMENT)
  private readonly router = inject(Router)
  private readonly translate = inject(TranslateService)
  protected readonly store = inject(AuthStore)
  protected readonly icons = APP_ICONS

  protected readonly sidebarOpen = signal(true)
  protected readonly currentLang = signal(
    this.translate.getCurrentLang() || 'ar',
  )
  protected readonly darkMode = signal(
    this.doc.documentElement.classList.contains('dark'),
  )

  private readonly navGroups = NAV_GROUPS

  protected readonly sortedNavGroups = computed(() =>
    [...this.navGroups]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((group) => ({
        ...group,
        items: [...group.items].sort((a, b) => a.sortOrder - b.sortOrder),
      })),
  )

  constructor() {
    effect(() => {
      const isDark = this.darkMode()
      this.doc.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    })

    effect(() => {
      if (!this.store.isAuthenticated()) {
        this.router
          .navigate(['/login'], { queryParams: { reason: 'logout' } })
          .then()
      }
    })
  }

  protected toggleLanguage() {
    const next = this.currentLang() === 'ar' ? 'en' : 'ar'
    this.translate.use(next)
    this.currentLang.set(next)
  }

  protected logout() {
    this.store.logout()
  }
}
