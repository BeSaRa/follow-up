export const ENDPOINTS = {
  AUTH: '/auth/login',
  USERS: '/users',
} as const

export type Endpoints = typeof ENDPOINTS
