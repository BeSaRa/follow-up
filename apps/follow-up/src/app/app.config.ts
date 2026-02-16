import {
  ApplicationConfig,
  EventEmitter,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { Directionality, Direction } from '@angular/cdk/bidi'
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
    {
      provide: Directionality,
      useFactory: () => {
        const doc = inject(DOCUMENT)
        const change = new EventEmitter<Direction>()
        const instance = { change, ngOnDestroy: () => change.complete() }
        Object.defineProperty(instance, 'value', {
          get: () => (doc.documentElement.dir === 'rtl' ? 'rtl' : 'ltr') as Direction,
        })
        return instance as Directionality
      },
    },
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
