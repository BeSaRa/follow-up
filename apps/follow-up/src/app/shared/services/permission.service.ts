import { Injectable, inject, signal, computed } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { CastResponse, CastResponseContainer } from 'cast-response'
import { injectUrlService, Pagination } from '@follow-up/core'
import { Endpoints } from '../../constants/endpoints'
import { Permission } from '../models/permission'

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => Permission,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly http = inject(HttpClient)
  private readonly urlService = injectUrlService<Endpoints>()

  readonly models = signal<Permission[]>([])
  readonly permissionMap = computed(() =>
    this.models().reduce((acc, permission) => {
      acc[permission.permissionKey] = permission
      return acc
    }, {} as Record<string, Permission>),
  )

  getAll(options?: Record<string, unknown>): Observable<Pagination<Permission[]>> {
    return this._getAll(options).pipe(
      tap((res) => this.models.set(res.result)),
    )
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  private _getAll(options?: Record<string, unknown>): Observable<Pagination<Permission[]>> {
    return this.http.get<Pagination<Permission[]>>(this.urlService.URLS.PERMISSION, {
      params: new HttpParams({
        fromObject: options as never,
      }),
    })
  }
}
