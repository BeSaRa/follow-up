import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { injectUrlService } from '../providers/provide-url-service'

export type AuthCredentials = {
  userName: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export type RequiredAuthEndpoints = Record<
  'AUTH' | 'REFRESH_TOKEN' | 'LOGOUT',
  string
>

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly urlService = injectUrlService<RequiredAuthEndpoints>()

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
