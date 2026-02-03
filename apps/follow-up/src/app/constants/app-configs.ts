export const appConfigs = {
  APP_VERSION: '1.0.0',
  API_VERSION: '/api/v1/',
  EXTERNAL_PROTOCOLS: ['http', 'https', 'mailto'],
} as const

export type AppConfigs = typeof appConfigs
