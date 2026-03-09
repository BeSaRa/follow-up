import { RequiredAuthEndpoints } from '@follow-up/core'

export const ENDPOINTS = {
  AUTH: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  APPLICATION_USER: 'admin/application-user',
  ATTACHMENT_TYPE: 'admin/attachment-type',
  ATTACHMENT_TYPE_LOOKUPS: 'admin/attachment-type/lookup',
  EXTERNAL_SITE: 'admin/external-site',
  FOLLOWUP_STATUS: 'admin/followup-status',
  FOLLOWUP_STATUS_LOOKUPS: 'admin/followup-status/lookup',
  PRIORITY_LEVEL: 'admin/priority-Level',
  PRIORITY_LEVEL_LOOKUPS: 'admin/priority-Level/lookup',
} as const satisfies RequiredAuthEndpoints & Record<string, string>

export type Endpoints = typeof ENDPOINTS
