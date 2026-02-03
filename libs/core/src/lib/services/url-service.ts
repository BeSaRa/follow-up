import { inject, Injectable } from '@angular/core'
import {
  URL_SERVICE_OPTIONS_TOKEN,
  UrlServiceProviderOptions,
} from '../providers/provide-url-service'
import { removeLeadingSlash } from '@follow-up/util'

@Injectable()
export class UrlService<T extends Record<string, string>> {
  readonly options = inject<UrlServiceProviderOptions>(
    URL_SERVICE_OPTIONS_TOKEN,
  )
  URLS: T = {} as T

  prepareUrls(baseUrl: string) {
    Object.keys(this.options.ENDPOINTS).forEach((key) => {
      ;(this.URLS as Record<string, string>)[key] = this.isExternalURL(
        this.options.ENDPOINTS[key],
      )
        ? this.options.ENDPOINTS[key]
        : `${baseUrl}/${removeLeadingSlash(this.options.ENDPOINTS[key])}`
    })
  }

  private isExternalURL(url: string) {
    return (
      this.options.EXTERNAL_PROTOCOLS &&
      this.options.EXTERNAL_PROTOCOLS.some((protocol) =>
        url.startsWith(protocol),
      )
    )
  }
}
