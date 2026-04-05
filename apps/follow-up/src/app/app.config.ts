import {
  ApplicationConfig,
  EventEmitter,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { Direction, Directionality } from '@angular/cdk/bidi'
import { provideRouter } from '@angular/router'
import { provideTranslateService } from '@ngx-translate/core'
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { appRoutes } from './app.routes'
import { firstValueFrom, filter, of, switchMap } from 'rxjs'
import { AuthService, AuthStore, injectUrlService, tokenInterceptor } from '@follow-up/core'
import { AppAuthService } from './shared/services/app-auth.service'
import { AppStore } from './shared/stores/app-store'
import { appInit } from './constants/app-init'
import { errorInterceptor } from './interceptors/error-interceptor'
import { provideModelInterceptors } from 'cast-response'
import { GlobalModelInterceptor } from './constants/global-model-interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    appInit,
    { provide: AuthService, useExisting: AppAuthService },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore)
      const authService = inject(AuthService)
      const appStore = inject(AppStore)
      const urlService = injectUrlService()
      const refreshToken = authStore.refreshToken()
      if (!refreshToken) return of(null)
      return firstValueFrom(
        urlService.urlsPrepared$.pipe(
          filter(Boolean),
          switchMap(() => authService.refreshToken(refreshToken)),
        ),
      ).then((response) => {
        authStore.setTokens({
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken,
        })
      }).catch(() => {
        appStore.clearSession()
        authStore.logout()
      })
    }),
    provideModelInterceptors([GlobalModelInterceptor]),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor])),
    provideRouter(appRoutes),
    provideTranslateService({
      fallbackLang: 'ar',
    }),
    provideTranslateHttpLoader({
      prefix: './i18n/',
      suffix: '.json',
      useHttpBackend: true,
    }),
    provideEnvironmentInitializer(() => {
      const iconRegistry = inject(MatIconRegistry)
      const sanitizer = inject(DomSanitizer)
      iconRegistry.addSvgIconSet(
        sanitizer.bypassSecurityTrustResourceUrl('./mdi.svg'),
      )
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
