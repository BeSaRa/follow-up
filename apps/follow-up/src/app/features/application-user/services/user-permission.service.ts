import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CastResponse } from 'cast-response'
import { injectUrlService } from '@follow-up/core'
import { Endpoints } from '../../../constants/endpoints'
import { UserPermission } from '../models/user-permission'

@Injectable({ providedIn: 'root' })
export class UserPermissionService {
  private readonly http = inject(HttpClient)
  private readonly urlService = injectUrlService<Endpoints>()

  @CastResponse(() => UserPermission, { unwrap: 'result' })
  getByUserId(userId: number): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(
      this.urlService.URLS.USER_PERMISSION_BY_USER + '/' + userId,
    )
  }

  saveForUser(userId: number, permissions: Partial<UserPermission>[]): Observable<UserPermission[]> {
    return this.http.post<UserPermission[]>(
      this.urlService.URLS.USER_PERMISSION_BY_USER + '/' + userId,
      permissions,
    )
  }
}
