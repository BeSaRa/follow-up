import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
export type { AuthCredentials, AuthResponse, AuthTokens, RequiredAuthEndpoints } from '@follow-up/contracts'
import type { AuthCredentials, AuthResponse, RequiredAuthEndpoints } from '@follow-up/contracts'
import { injectUrlService } from '../providers/provide-url-service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  protected readonly http = inject(HttpClient)
  protected readonly urlService = injectUrlService<RequiredAuthEndpoints>()

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.urlService.URLS.AUTH, credentials)
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.urlService.URLS.REFRESH_TOKEN, {
      refreshToken: token,
    })
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.urlService.URLS.LOGOUT, {})
  }
}
