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
        path: 'application-user',
        loadComponent: () =>
          import('../features/application-user/application-user-page').then(m => m.ApplicationUserPage),
      },
      {
        path: 'attachment-type',
        loadComponent: () =>
          import('../features/attachment-type/attachment-type-page').then(m => m.AttachmentTypePage),
      },
      {
        path: 'external-site',
        loadComponent: () =>
          import('../features/external-site/external-site-page').then(m => m.ExternalSitePage),
      },
      {
        path: 'followup-status',
        loadComponent: () =>
          import('../features/followup-status/followup-status-page').then(m => m.FollowupStatusPage),
      },
      {
        path: 'priority-level',
        loadComponent: () =>
          import('../features/priority-level/priority-level-page').then(m => m.PriorityLevelPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
]
