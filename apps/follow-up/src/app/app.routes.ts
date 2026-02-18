import { Route } from '@angular/router'

export const appRoutes: Route[] = [
  {
    path: 'showcase',
    loadChildren: () =>
      import('@follow-up/ui').then(m => m.showcaseRoutes),
  },
  {
    path: '',
    redirectTo: 'showcase',
    pathMatch: 'full',
  },
]
