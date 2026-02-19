import { computed, inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'

export type AuthCredentials = {
  userName: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)

  private readonly _accessToken = signal<string | null>(null)
  private readonly _refreshToken = signal<string | null>(null)

  readonly isAuthenticated = computed(() => !!this._accessToken())
  readonly accessToken = computed(() => this._accessToken())
  readonly refreshToken = computed(() => this._refreshToken())

  login(url: string, credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        this._accessToken.set(response.accessToken)
        this._refreshToken.set(response.refreshToken)
      }),
    )
  }

  logout() {
    this._accessToken.set(null)
    this._refreshToken.set(null)
  }
}
