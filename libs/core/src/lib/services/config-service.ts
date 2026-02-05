import { inject, Injectable } from '@angular/core'
import { CONFIG_SERVICE_DEFAULTS_TOKEN } from '../providers/provide-config-service'
import { HttpClient } from '@angular/common/http'
import { map, Observable, ReplaySubject, tap } from 'rxjs'
import {
  removeTrailingAndLeadingSlash,
  removeTrailingSlash,
} from '@follow-up/util'

export type EnvironmentConfigs = {
  BASE_URL: string
  ENVIRONMENTS: Record<string, string>
  ENV: string
}

/**
 * Service for loading and managing application configuration from external JSON files.
 *
 * This service loads configuration from a JSON file, validates its structure, and provides
 * type-safe access through a proxy. It handles environment-specific base URLs and optional
 * API version path segments.
 *
 * @template T - The application-specific configuration type that extends the base environment configs
 *
 * @example
 * ```typescript
 * type AppConfig = {
 *   API_VERSION: string;
 *   FEATURE_FLAGS: Record<string, boolean>;
 * };
 *
 * const configService = injectConfigService<AppConfig>();
 * console.log(configService.CONFIG.BASE_URL); // 'https://api.example.com/v1'
 * ```
 */
@Injectable()
export class ConfigService<T> {
  options = inject(CONFIG_SERVICE_DEFAULTS_TOKEN)
  http = inject(HttpClient)
  /**
   * The loaded configuration object with type-safe access via proxy.
   * Access to non-existent properties will throw an error.
   */
  CONFIG: T & EnvironmentConfigs = {} as T & EnvironmentConfigs
  /**
   * Internal subject for emitting the prepared base URL.
   * @private
   */
  private baseUrlPrepared$ = new ReplaySubject<string>(1)
  /**
   * Observable stream of the base URL after it has been prepared.
   * Emits once when configuration is loaded and base URL is set.
   */
  baseURL$ = this.baseUrlPrepared$.asObservable()

  /**
   * Loads the configuration from the configured JSON file URL.
   *
   * Performs the following operations:
   * 1. Fetches configuration JSON via HTTP
   * 2. Merges with embedded configuration if provided
   * 3. Validates the configuration structure
   * 4. Sets the base URL from the selected environment
   * 5. Optionally appends API version to the base URL
   * 6. Wraps configuration in a proxy for type-safe access
   *
   * @returns Observable that emits the loaded and validated configuration
   * @throws Error if configuration structure is invalid or selected environment doesn't exist
   */
  load(): Observable<T & EnvironmentConfigs> {
    return this.http
      .get<T & EnvironmentConfigs>(this.options.CONFIG_FILE_URL)
      .pipe(
        map((response) => {
          return (this.CONFIG = {
            ...(this.options.EMBEDDED_CONFIG as T),
            ...response,
          })
        }),
        map(() => this.isValidConfigJSON()),
        tap(() => this.setBaseUrl()),
        tap(() => this.addAPIVersionToBaseUrl()),
        map(() => this.prepareConfigurationProxy()),
      )
  }

  /**
   * Validates that the loaded configuration has the required structure.
   *
   * Checks for:
   * - ENVIRONMENTS object presence
   * - ENV property presence
   * - Selected environment exists in ENVIRONMENTS
   *
   * @throws Error if any validation check fails
   * @private
   */
  private isValidConfigJSON() {
    if (!('ENVIRONMENTS' in this.CONFIG))
      throw new Error(
        'Invalid configuration file, file should has ENVIRONMENTS Object',
      )

    if (!('ENV' in this.CONFIG))
      throw new Error('Invalid configuration file, ENV property is missing')

    if (!this.CONFIG.ENVIRONMENTS[this.CONFIG.ENV])
      throw new Error('Invalid configuration file, the selected ENV not exists')
  }

  /**
   * Wraps the configuration object in a proxy for type-safe property access.
   *
   * The proxy intercepts property access and throws an error if attempting to
   * access a property that doesn't exist in the configuration file.
   *
   * @returns The proxied configuration object
   * @private
   */
  private prepareConfigurationProxy() {
    this.CONFIG = new Proxy(this.CONFIG, {
      get: (target, prop, receiver) => {
        // noinspection SuspiciousTypeOfGuard
        if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver)

        if (prop in target)
          return target[prop as unknown as keyof T & EnvironmentConfigs]
        throw new Error(
          `Property ${prop.toString()} not exists at configurations.json file so please add it to fix that error`,
        )
      },
      set: (target, p, newValue) => {
        target[p as unknown as keyof T & EnvironmentConfigs] = newValue
        return true
      },
    }) as unknown as T & EnvironmentConfigs
    return this.CONFIG
  }

  /**
   * Sets the BASE_URL property from the selected environment configuration.
   *
   * Removes trailing slashes from the environment URL and emits it via baseURL$ observable.
   *
   * @private
   */
  private setBaseUrl() {
    this.CONFIG.BASE_URL = removeTrailingSlash(
      this.CONFIG.ENVIRONMENTS[this.CONFIG.ENV],
    )
    this.baseUrlPrepared$.next(this.CONFIG.BASE_URL)
  }

  /**
   * Optionally appends the API version path segment to the base URL.
   *
   * Only modifies BASE_URL if both INCLUDE_API_VERSION_TO_BASE_URL and API_VERSION_KEY
   * options are configured. Normalizes slashes in the API version path.
   *
   * @private
   */
  private addAPIVersionToBaseUrl() {
    this.CONFIG.BASE_URL =
      this.options.INCLUDE_API_VERSION_TO_BASE_URL &&
      this.options.API_VERSION_KEY
        ? `${this.CONFIG.BASE_URL}/${removeTrailingAndLeadingSlash(this.CONFIG[this.options.API_VERSION_KEY as keyof T & EnvironmentConfigs] as string)}`
        : this.CONFIG.BASE_URL
  }
}
