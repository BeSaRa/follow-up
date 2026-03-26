import { inject, Injectable, signal } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AuthService } from '@follow-up/core'
import type { AuthCredentials, AuthResponse } from '@follow-up/contracts'
import type { AppApplicationUser, AppAuthResponse } from '../models/app-auth'
import { LookupService } from './lookup.service'

@Injectable({ providedIn: 'root' })
export class AppAuthService extends AuthService {
  private readonly lookupService = inject(LookupService)

  readonly applicationUser = signal<AppApplicationUser | null>(null)

  override login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AppAuthResponse>(this.urlService.URLS.AUTH, credentials).pipe(
      tap((response) => {
        this.applicationUser.set(response.result.applicationUser)
        this.lookupService.setLookupList(response.result.lookupList)
      }),
    )
  }
}
