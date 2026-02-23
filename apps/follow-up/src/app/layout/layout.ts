import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
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
            <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span class="text-lg font-bold text-foreground">{{ 'layout.app_title' | translate }}</span>
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
            [class]="darkMode() ? 'bg-slate-700' : 'bg-amber-200'"
            [attr.aria-label]="'layout.toggle_dark_mode' | translate"
            [uiTooltip]="(darkMode() ? 'layout.switch_to_light' : 'layout.switch_to_dark') | translate"
            uiTooltipPosition="below"
            (click)="darkMode.set(!darkMode())"
          >
            <span
              class="inline-flex size-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300"
              [class]="darkMode() ? 'ltr:translate-x-8 rtl:-translate-x-8' : 'ltr:translate-x-1 rtl:-translate-x-1'"
            >
              @if (darkMode()) {
                <svg class="size-3 text-slate-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
                </svg>
              } @else {
                <svg class="size-3 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                </svg>
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
              <svg class="size-4 text-foreground-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
            <ui-dropdown-menu #userMenu position="below-end">
              <ui-dropdown-item (selected)="logout()">
                <span class="flex items-center gap-2">
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  {{ 'layout.logout' | translate }}
                </span>
              </ui-dropdown-item>
            </ui-dropdown-menu>
          </div>
        </ui-navbar-actions>
      </ui-navbar>

      <ui-drawer-container class="flex-1 overflow-hidden" style="--ui-drawer-width: 250px">
        <ui-drawer
          [(open)]="sidebarOpen"
          position="start"
          mode="push"
          [hasBackdrop]="false"
          [closeOnEscape]="false"
        >
          <ui-drawer-content>
            <nav class="flex flex-col gap-2 py-2">
              @for (group of sortedNavGroups(); track group.label) {
                <div>
                  @if (group.label) {
                    <span class="px-3 text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
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
                        <mat-icon class="!text-xl !size-5 !leading-5" fontSet="material-icons-outlined">{{ item.icon }}</mat-icon>
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

  protected readonly sidebarOpen = signal(true)
  protected readonly currentLang = signal(this.translate.currentLang || 'ar')
  protected readonly darkMode = signal(
    this.doc.documentElement.classList.contains('dark'),
  )

  constructor() {
    effect(() => {
      const isDark = this.darkMode()
      this.doc.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    })

    effect(() => {
      if (!this.store.isAuthenticated()) {
        this.router.navigate(['/login'], { queryParams: { reason: 'logout' } })
      }
    })
  }

  private readonly navGroups = [
    {
      sortOrder: 1,
      items: [
        {
          path: '/dashboard',
          label: 'layout.dashboard',
          icon: 'dashboard',
          exact: true,
          sortOrder: 1,
        },
      ],
    },
    {
      sortOrder: 2,
      label: 'layout.nav_system',
      items: [
        {
          path: '/application-user',
          label: 'layout.application_user',
          icon: 'group',
          exact: false,
          sortOrder: 1,
        },
        {
          path: '/settings',
          label: 'layout.settings',
          icon: 'settings',
          exact: false,
          sortOrder: 2,
        },
      ],
    },
  ]

  protected readonly sortedNavGroups = computed(() =>
    [...this.navGroups]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((group) => ({
        ...group,
        items: [...group.items].sort((a, b) => a.sortOrder - b.sortOrder),
      })),
  )

  protected toggleLanguage() {
    const next = this.currentLang() === 'ar' ? 'en' : 'ar'
    this.translate.use(next)
    this.currentLang.set(next)
  }

  protected logout() {
    this.store.logout()
  }
}
