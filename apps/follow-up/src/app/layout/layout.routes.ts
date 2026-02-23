import { Route } from '@angular/router'
import { Layout } from './layout'

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../features/dashboard/dashboard-page').then(m => m.DashboardPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../features/settings/settings-page').then(m => m.SettingsPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
]
