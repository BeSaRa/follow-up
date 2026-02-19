export const appConfigs = {
  APP_VERSION: '1.0.0',
  API_VERSION: '',
  EXTERNAL_PROTOCOLS: ['http', 'https', 'mailto'],
} as const

export type AppConfigs = typeof appConfigs
