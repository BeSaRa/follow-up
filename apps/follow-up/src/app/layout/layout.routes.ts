import { Route } from '@angular/router'
import { authGuard } from '@follow-up/core'
import { Layout } from './layout'
import { defaultRedirectGuard } from './default-redirect.guard'
import { adminGuard, nonAdminGuard, notificationsGuard } from './admin.guard'

export const layoutRoutes: Route[] = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [nonAdminGuard],
        loadComponent: () =>
          import('../features/dashboard/dashboard-page').then(m => m.DashboardPage),
      },
      {
        path: 'followup',
        canActivate: [nonAdminGuard],
        loadComponent: () =>
          import('../features/followup/followup-page').then(m => m.FollowupPage),
      },
      {
        path: 'search',
        canActivate: [nonAdminGuard],
        loadComponent: () =>
          import('../features/search/search-page').then(m => m.SearchPage),
      },
      {
        path: 'notifications',
        canActivate: [notificationsGuard],
        loadComponent: () =>
          import('../features/notification/notifications-page').then(
            m => m.NotificationsPage,
          ),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('../features/admin/admin.routes').then(m => m.adminRoutes),
      },
      {
        path: '',
        pathMatch: 'full',
        canActivate: [defaultRedirectGuard],
        children: [],
      },
    ],
  },
]
