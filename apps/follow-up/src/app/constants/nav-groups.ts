import { APP_ICONS } from './icons'

export const NAV_GROUPS = [
  {
    sortOrder: 1,
    adminOnly: false,
    items: [
      {
        path: '/followup',
        label: 'layout.followup',
        icon: APP_ICONS.VIEW_DASHBOARD,
        exact: true,
        sortOrder: 1,
      },
    ],
  },
  {
    sortOrder: 2,
    adminOnly: true,
    label: 'layout.nav_system',
    items: [
      {
        path: '/admin/application-user',
        label: 'layout.application_user',
        icon: APP_ICONS.ACCOUNT_GROUP,
        exact: false,
        sortOrder: 1,
      },
      {
        path: '/admin/external-site',
        label: 'layout.external_site',
        icon: APP_ICONS.WEB,
        exact: false,
        sortOrder: 2,
      },
      {
        path: '/admin/attachment-type',
        label: 'layout.attachment_type',
        icon: APP_ICONS.PAPERCLIP,
        exact: false,
        sortOrder: 3,
      },
      {
        path: '/admin/followup-status',
        label: 'layout.followup_status',
        icon: APP_ICONS.LIST_STATUS,
        exact: false,
        sortOrder: 4,
      },
      {
        path: '/admin/priority-level',
        label: 'layout.priority_level',
        icon: APP_ICONS.PRIORITY_HIGH,
        exact: false,
        sortOrder: 5,
      },
    ],
  },
]
