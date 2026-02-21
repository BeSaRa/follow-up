import { inject, Injectable } from '@angular/core'
import { CookieService as NgxCookieService } from 'ngx-cookie-service'

export type SameSite = 'Lax' | 'None' | 'Strict'

export interface CookieOptions {
  expires?: number | Date
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: SameSite
  partitioned?: boolean
}

@Injectable({ providedIn: 'root' })
export class CookieService {
  private readonly cookieService = inject(NgxCookieService)

  check(name: string): boolean {
    return this.cookieService.check(name)
  }

  get(name: string): string {
    return this.cookieService.get(name)
  }

  getAll(): Record<string, string> {
    return this.cookieService.getAll()
  }

  set(name: string, value: string, options?: CookieOptions): void {
    this.cookieService.set(name, value, options)
  }

  delete(
    name: string,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: SameSite,
  ): void {
    this.cookieService.delete(name, path, domain, secure, sameSite)
  }

  deleteAll(
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: SameSite,
  ): void {
    this.cookieService.deleteAll(path, domain, secure, sameSite)
  }
}
