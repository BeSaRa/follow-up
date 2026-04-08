import { inject, Injectable } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { Followup } from '../models/followup'
import { Endpoints } from '../../../constants/endpoints'
import { UserType } from '../../../shared/enums/user-type'
import { AppStore } from '../../../shared/stores/app-store'
import { CastResponse, CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => Followup,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => Followup,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class FollowupService extends RegisterServiceMixin(CrudService)<Followup, Endpoints, number> {
  $$serviceName = 'FollowupService'

  private readonly appStore = inject(AppStore)

  getSegmentUrl(): string {
    return this.urlService.URLS.FOLLOWUP
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  override getAll(options?: Record<string, unknown>): Observable<Pagination<Followup[]>> {
    const url = this.getSegmentUrl() + this._getRightSegmentURL(this.appStore.userType())
    return this.http.get<Pagination<Followup[]>>(url, {
      params: new HttpParams({ fromObject: options as never }),
    })
  }

  private _getRightSegmentURL(userType: UserType): string {
    switch (userType) {
      case UserType.INTERNAL_USER:
        return '/internal-users'
      case UserType.EXTERNAL_USER:
        return '/external-users'
      case UserType.PMO_HEAD:
        return '/pmo-head'
      default:
        return ''
    }
  }
}
