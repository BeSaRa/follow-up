export const ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
} as const

export type Endpoints = typeof ENDPOINTS
