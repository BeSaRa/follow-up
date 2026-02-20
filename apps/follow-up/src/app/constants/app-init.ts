import { Provider } from '@angular/core'
import { AppConfigs, appConfigs } from './app-configs'
import {
  injectConfigService,
  provideConfigService,
  provideUrlService,
} from '@follow-up/core'
import { ENDPOINTS } from './endpoints'

export const appInit = [
  provideConfigService({
    INCLUDE_API_VERSION_TO_BASE_URL: false,
    CONFIG_FILE_URL: './configurations.json',
    EMBEDDED_CONFIG: appConfigs,
  }),
  provideUrlService(() => {
    const config = injectConfigService<AppConfigs>()
    return {
      PREPARE: true,
      ENDPOINTS: ENDPOINTS,
      BASE_URL: config.baseURL$,
    }
  }),
  // provideSequentialAppInitializer(
  //   () => {
  //     const service = injectUrlService<Endpoints>()
  //     return firstValueFrom(service.urlsPrepared$.pipe(filter((val) => val)))
  //   },
  // ),
] satisfies Provider
