import { inject, Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AuthService } from '@follow-up/core'
import type { AuthCredentials, AuthResponse } from '@follow-up/contracts'
import type { AppAuthResponse } from '../models/app-auth'
import { LookupService } from './lookup.service'
import { AppStore } from '../stores/app-store'
import { FollowupService } from '../../features/followup/services/followup.service'

@Injectable({ providedIn: 'root' })
export class AppAuthService extends AuthService {
  private readonly lookupService = inject(LookupService)
  private readonly appStore = inject(AppStore)
  private readonly followupService = inject(FollowupService)

  override login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AppAuthResponse>(this.urlService.URLS.AUTH, credentials).pipe(
      tap((response) => {
        this.appStore.setSession(response.result.applicationUser, response.result.lookupList, response.result.permissionSet, response.result.userType)
        this.lookupService.setLookupList(response.result.lookupList)
        this.preloadCaches()
      }),
    )
  }

  override refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AppAuthResponse>(this.urlService.URLS.REFRESH_TOKEN, {}, {
      headers: { Authorization: token },
    }).pipe(
      tap((response) => {
        this.appStore.setSession(response.result.applicationUser, response.result.lookupList, response.result.permissionSet, response.result.userType)
        this.lookupService.setLookupList(response.result.lookupList)
        this.preloadCaches()
      }),
    )
  }

  private preloadCaches(): void {
    this.followupService.clearInternalUsersCache()
    this.followupService.loadAssignableUsers().subscribe({ error: () => undefined })
  }
}
