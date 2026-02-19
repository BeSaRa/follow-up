import {
  ApplicationConfig,
  EventEmitter,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { Directionality, Direction } from '@angular/cdk/bidi'
import { provideRouter } from '@angular/router'
import { provideTranslateService } from '@ngx-translate/core'
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'
import { appRoutes } from './app.routes'
import {
  injectConfigService,
  provideConfigService,
  provideSequentialAppInitializer,
  provideUrlService,
  tokenInterceptor,
} from '@follow-up/core'
import { of } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { AppConfigs, appConfigs } from './constants/app-configs'
import { ENDPOINTS } from './constants/endpoints'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(appRoutes),
    provideTranslateService({
      fallbackLang: 'ar',
    }),
    provideTranslateHttpLoader({
      prefix: './i18n/',
      suffix: '.json',
    }),
    {
      provide: Directionality,
      useFactory: () => {
        const doc = inject(DOCUMENT)
        const change = new EventEmitter<Direction>()
        const instance = { change, ngOnDestroy: () => change.complete() }
        Object.defineProperty(instance, 'value', {
          get: () =>
            (doc.documentElement.dir === 'rtl' ? 'rtl' : 'ltr') as Direction,
        })
        return instance as Directionality
      },
    },
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
