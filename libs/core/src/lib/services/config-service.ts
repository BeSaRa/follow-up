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

@Injectable()
export class ConfigService<T> {
  options = inject(CONFIG_SERVICE_DEFAULTS_TOKEN)
  http = inject(HttpClient)
  CONFIG: T & EnvironmentConfigs = {} as T & EnvironmentConfigs
  private baseUrlPrepared$ = new ReplaySubject<string>(1)
  baseURL$ = this.baseUrlPrepared$.asObservable()

  load(): Observable<T & EnvironmentConfigs> {
    return this.http
      .get<T & EnvironmentConfigs>(this.options.CONFIG_FILE_URL)
      .pipe(
        map((response) => {
          return (this.CONFIG = {
            ...response,
            ...(this.options.EMBEDDED_CONFIG as T),
          })
        }),
        map(() => this.isValidConfigJSON()),
        tap(() => this.setBaseUrl()),
        tap(() => this.addAPIVersionToBaseUrl()),
        map(() => this.prepareConfigurationProxy()),
      )
  }

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

  private setBaseUrl() {
    this.CONFIG.BASE_URL = removeTrailingSlash(
      this.CONFIG.ENVIRONMENTS[this.CONFIG.ENV],
    )
    this.baseUrlPrepared$.next(this.CONFIG.BASE_URL)
  }

  private addAPIVersionToBaseUrl() {
    this.CONFIG.BASE_URL =
      this.options.INCLUDE_API_VERSION_TO_BASE_URL &&
      this.options.API_VERSION_KEY
        ? `${this.CONFIG.BASE_URL}/${removeTrailingAndLeadingSlash(this.CONFIG[this.options.API_VERSION_KEY as keyof T & EnvironmentConfigs] as string)}`
        : this.CONFIG.BASE_URL
  }
}
