import {
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core'
import { UrlService } from '../services/url-service'
import { firstValueFrom, isObservable, map, Observable, of } from 'rxjs'

export type UrlServiceProviderOptions = {
  ENDPOINTS: Record<string, string>
  PREPARE: boolean
  BASE_URL: string | Observable<string>
  EXTERNAL_PROTOCOLS?: string[]
}

export const URL_SERVICE_OPTIONS_TOKEN =
  new InjectionToken<UrlServiceProviderOptions>('URL_SERVICE_ENDPOINTS_TOKEN')

export type ContextInjectionCallback = () => UrlServiceProviderOptions

export function provideUrlService(
  options: ContextInjectionCallback | UrlServiceProviderOptions,
) {
  const isCallback = typeof options === 'function'

  return makeEnvironmentProviders([
    {
      provide: URL_SERVICE_OPTIONS_TOKEN,
      ...(isCallback ? { useFactory: () => options() } : { useValue: options }),
    },
    UrlService,
    provideAppInitializer(() => {
      const options = inject<UrlServiceProviderOptions>(
        URL_SERVICE_OPTIONS_TOKEN,
      )
      const service = inject(UrlService)

      if (!options.BASE_URL) {
        throw new Error('BASE_URL is required')
      }

      return options.PREPARE
        ? options.BASE_URL
          ? isObservable(options.BASE_URL)
            ? firstValueFrom(
                options.BASE_URL.pipe(
                  map((url) => {
                    service.prepareUrls(url)
                    return true
                  }),
                ),
              )
            : service.prepareUrls(options.BASE_URL)
          : of(true)
        : of(true)
    }),
  ])
}

export function injectUrlService<T extends Record<string, string>>() {
  return inject(UrlService) as UrlService<T>
}
