import { Route } from '@angular/router'

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page').then(m => m.LoginPage),
  },
  {
    path: 'showcase',
    loadChildren: () =>
      import('@follow-up/ui').then(m => m.showcaseRoutes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
]
