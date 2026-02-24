import {
  ApplicationConfig,
  EventEmitter,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { Direction, Directionality } from '@angular/cdk/bidi'
import { provideRouter } from '@angular/router'
import { provideTranslateService } from '@ngx-translate/core'
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'
import { appRoutes } from './app.routes'
import { tokenInterceptor } from '@follow-up/core'
import { appInit } from './constants/app-init'

export const appConfig: ApplicationConfig = {
  providers: [
    appInit,
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
        // noinspection JSUnusedGlobalSymbols
        const instance = { change, ngOnDestroy: () => change.complete() }
        Object.defineProperty(instance, 'value', {
          get: () =>
            (doc.documentElement.dir === 'rtl' ? 'rtl' : 'ltr') as Direction,
        })
        return instance as Directionality
      },
    },
  ],
}
