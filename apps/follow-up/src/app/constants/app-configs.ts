export const appConfigs = {
  APP_VERSION: '1.0.0',
  API_VERSION: '/api/v1/',
} as const

export type AppConfigs = typeof appConfigs
