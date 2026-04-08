import { Route } from '@angular/router'
import { authGuard } from '@follow-up/core'
import { Layout } from './layout'

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'followup',
        loadComponent: () =>
          import('../features/followup/followup-page').then(m => m.FollowupPage),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../features/admin/admin.routes').then(m => m.adminRoutes),
      },
      {
        path: '',
        redirectTo: 'followup',
        pathMatch: 'full',
      },
    ],
  },
]
