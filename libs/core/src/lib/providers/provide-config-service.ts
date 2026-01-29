import {
  assertInInjectionContext,
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core'
import { ConfigService, EnvironmentConfigs } from '../services/config-service'
import { of } from 'rxjs'

export type ConfigServiceOptions = {
  AUTO_LOAD?: boolean
  CONFIG_FILE_URL: string
  INCLUDE_API_VERSION_TO_BASE_URL?: boolean
  API_VERSION_KEY?: string
  EMBEDDED_CONFIG?: unknown
}

export const CONFIG_SERVICE_DEFAULTS_TOKEN =
  new InjectionToken<ConfigServiceOptions>('CONFIG_DEFAULTS_TOKEN')

export function provideConfigService(
  options: ConfigServiceOptions = {
    CONFIG_FILE_URL: '/configurations.json',
  },
): EnvironmentProviders {
  options.AUTO_LOAD = 'AUTO_LOAD' in options ? options.AUTO_LOAD : true
  options.CONFIG_FILE_URL =
    'CONFIG_FILE_URL' in options
      ? options.CONFIG_FILE_URL
      : '/configurations.json'
  return makeEnvironmentProviders([
    {
      provide: CONFIG_SERVICE_DEFAULTS_TOKEN,
      useValue: options || {},
    },
    ConfigService,
    provideAppInitializer(() => {
      return options.AUTO_LOAD ? injectConfigService().load() : of(null)
    }),
  ])
}

export function injectConfigService<T>(): ConfigService<
  T & EnvironmentConfigs
> {
  assertInInjectionContext(injectConfigService)
  return inject(ConfigService) as ConfigService<T & EnvironmentConfigs>
}
