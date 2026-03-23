import { Route } from '@angular/router'
import { guestGuard } from '@follow-up/core'

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/login/login-page').then(m => m.LoginPage),
  },
  {
    path: 'showcase',
    loadChildren: () =>
      import('@follow-up/ui').then(m => m.showcaseRoutes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.routes').then(m => m.layoutRoutes),
  },
]
