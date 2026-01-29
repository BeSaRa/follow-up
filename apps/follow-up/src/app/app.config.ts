import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { appRoutes } from './app.routes'
import {
  provideConfigService,
  provideSequentialAppInitializer,
} from '@follow-up/core'
import { of } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { appConfigs } from './constants/app-configs'

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
