import { inject, Injectable } from '@angular/core'
import {
  URL_SERVICE_OPTIONS_TOKEN,
  UrlServiceProviderOptions,
} from '../providers/provide-url-service'
import { removeLeadingSlash } from '@follow-up/util'
import { BehaviorSubject } from 'rxjs'

/**
 * Service for managing and preparing API endpoint URLs.
 *
 * This service processes endpoint configurations and prepares fully-qualified URLs
 * by combining them with a base URL. It supports both relative and external URLs,
 * automatically detecting external URLs based on configured protocols (e.g., 'http://', 'https://').
 *
 * @template T - A record type defining the available endpoint keys and their URL string values
 *
 * @example
 * ```typescript
 * type MyEndpoints = {
 *   users: string;
 *   posts: string;
 * };
 *
 * const urlService = injectUrlService<MyEndpoints>();
 * console.log(urlService.URLS.users); // 'https://api.example.com/users'
 * ```
 */
@Injectable()
export class UrlService<T extends Record<string, string>> {
  private urlsPreparedEmitter$ = new BehaviorSubject<boolean>(false)
  /**
   * Observable that emits the preparation state of URLs.
   * Emits `false` initially, then `true` after `prepareUrls()` completes.
   * Subscribe to this to know when all endpoint URLs are ready for use.
   */
  urlsPrepared$ = this.urlsPreparedEmitter$.asObservable()
  /**
   * Configuration options for the URL service, including endpoints and external protocols.
   */
  readonly options = inject<UrlServiceProviderOptions>(
    URL_SERVICE_OPTIONS_TOKEN,
  )
  /**
   * Object containing prepared, fully qualified URLs for all configured endpoints.
   * Populated by the `prepareUrls` method during application initialization.
   */
  URLS: T = {} as T

  /**
   * Prepares all endpoint URLs by combining them with the base URL.
   *
   * For each endpoint defined in options.ENDPOINTS:
   * - External URLs (matching configured protocols) are used as-is
   * - Relative URLs are combined with the baseUrl, with leading slashes normalized
   *
   * @param baseUrl - The base URL to prepend to relative endpoint paths
   */
  prepareUrls(baseUrl: string) {
    Object.keys(this.options.ENDPOINTS).forEach((key) => {
      ;(this.URLS as Record<string, string>)[key] = this.isExternalURL(
        this.options.ENDPOINTS[key],
      )
        ? this.options.ENDPOINTS[key]
        : `${baseUrl}/${removeLeadingSlash(this.options.ENDPOINTS[key])}`
    })
    this.urlsPreparedEmitter$.next(true)
  }

  /**
   * Checks if a URL is external based on configured protocol prefixes.
   *
   * @param url - The URL string to check
   * @returns `true` if the URL starts with any configured external protocol, `false` otherwise
   * @private
   */
  private isExternalURL(url: string) {
    return (
      this.options.EXTERNAL_PROTOCOLS &&
      this.options.EXTERNAL_PROTOCOLS.some((protocol) =>
        url.startsWith(protocol),
      )
    )
  }
}
