import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { TranslatePipe } from '@ngx-translate/core'
import {
  UiNavbar,
  UiNavbarBrand,
  UiNavbarActions,
  UiDrawer,
  UiDrawerContainer,
  UiDrawerContent,
  UiButton,
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
    UiButton,
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
            uiButton
            variant="ghost"
            size="sm"
            (click)="logout()"
          >
            <svg class="size-4 me-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            {{ 'layout.logout' | translate }}
          </button>
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
  private readonly router = inject(Router)
  protected readonly store = inject(AuthStore)

  protected readonly sidebarOpen = signal(true)

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

  protected logout() {
    this.store.logout()
    this.router.navigate(['/login'])
  }
}
