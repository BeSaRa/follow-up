import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { appRoutes } from './app.routes'
import {
  injectConfigService,
  provideConfigService,
  provideSequentialAppInitializer,
  provideUrlService,
} from '@follow-up/core'
import { of } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { AppConfigs, appConfigs } from './constants/app-configs'
import { ENDPOINTS } from './constants/endpoints'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideConfigService({
      API_VERSION_KEY: 'API_VERSION',
      INCLUDE_API_VERSION_TO_BASE_URL: true,
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
    provideSequentialAppInitializer(
      () => {
        return inject(DomSanitizer)
      },
      () => {
        return 'WELCOME'
      },
      () => {
        return of('WELCOME')
      },
    ),
  ],
}
