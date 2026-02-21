import {
  ChangeDetectionStrategy,
  Component,
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

      <ui-drawer-container class="flex-1 overflow-hidden">
        <ui-drawer
          [(open)]="sidebarOpen"
          position="start"
          mode="push"
          [hasBackdrop]="false"
          [closeOnEscape]="false"
        >
          <ui-drawer-content>
            <nav class="flex flex-col gap-1 py-2">
              @for (item of navItems; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="bg-primary/10 text-primary font-medium"
                  [routerLinkActiveOptions]="{ exact: item.exact }"
                  class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon" />
                  </svg>
                  {{ item.label | translate }}
                </a>
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

  protected readonly navItems = [
    {
      path: '/dashboard',
      label: 'layout.dashboard',
      icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
      exact: true,
    },
    {
      path: '/settings',
      label: 'layout.settings',
      icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z',
      exact: false,
    },
  ]

  protected toggleLanguage() {
    const next = this.currentLang() === 'ar' ? 'en' : 'ar'
    this.translate.use(next)
    this.currentLang.set(next)
  }

  protected logout() {
    this.store.logout()
  }
}
