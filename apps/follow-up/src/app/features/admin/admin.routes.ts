import { Route } from '@angular/router'

export const adminRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-page').then(m => m.AdminPage),
  },
  {
    path: 'application-user',
    loadComponent: () =>
      import('../application-user/application-user-page').then(m => m.ApplicationUserPage),
  },
  {
    path: 'attachment-type',
    loadComponent: () =>
      import('../attachment-type/attachment-type-page').then(m => m.AttachmentTypePage),
  },
  {
    path: 'external-site',
    loadComponent: () =>
      import('../external-site/external-site-page').then(m => m.ExternalSitePage),
  },
  {
    path: 'followup-status',
    loadComponent: () =>
      import('../followup-status/followup-status-page').then(m => m.FollowupStatusPage),
  },
  {
    path: 'priority-level',
    loadComponent: () =>
      import('../priority-level/priority-level-page').then(m => m.PriorityLevelPage),
  },
]
