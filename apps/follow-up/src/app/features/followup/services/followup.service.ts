import { Injectable } from '@angular/core'
import { HttpParams } from '@angular/common/http'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { Followup } from '../models/followup'
import { Endpoints } from '../../../constants/endpoints'
import { UserType } from '../../../shared/enums/user-type'
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

  getSegmentUrl(): string {
    return this.urlService.URLS.FOLLOWUP
  }

  load(type: UserType, options?: Record<string, unknown>) {
    return this._load(type, options)
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  private _load(type: UserType, options?: Record<string, unknown>) {
    const url = this.getSegmentUrl() + this._getRightSegmentURL(type)
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
