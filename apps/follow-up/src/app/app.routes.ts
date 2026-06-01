import { Route } from '@angular/router'
import { guestGuard } from '@follow-up/core'
import { devOnlyRoutes } from './dev.routes'

export const appRoutes: Route[] = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/login/login-page').then(m => m.LoginPage),
  },
  ...devOnlyRoutes,
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.routes').then(m => m.layoutRoutes),
  },
]
