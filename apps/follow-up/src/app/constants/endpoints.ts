import { RequiredAuthEndpoints } from '@follow-up/core'

export const ENDPOINTS = {
  AUTH: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
  USERS: '/users',
} as const satisfies RequiredAuthEndpoints & Record<string, string>

export type Endpoints = typeof ENDPOINTS
