import { RequiredAuthEndpoints } from '@follow-up/core'

export const ENDPOINTS = {
  AUTH: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  APPLICATION_USER: 'admin/application-user',
  ATTACHMENT_TYPE: 'admin/attachment-type',
  EXTERNAL_SITE: 'admin/external-site',
} as const satisfies RequiredAuthEndpoints & Record<string, string>

export type Endpoints = typeof ENDPOINTS
