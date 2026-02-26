import { Injectable } from '@angular/core'
import { CrudService, Pagination, RegisterServiceMixin } from '@follow-up/core'
import { FollowupStatus } from '../models/followup-status'
import { Endpoints } from '../../../constants/endpoints'
import { CastResponseContainer } from 'cast-response'

@CastResponseContainer({
  $default: {
    model: () => FollowupStatus,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => FollowupStatus,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class FollowupStatusService extends RegisterServiceMixin(CrudService)<
  FollowupStatus,
  Endpoints,
  number
> {
  $$serviceName = 'FollowupStatusService'

  getSegmentUrl(): string {
    return this.urlService.URLS.FOLLOWUP_STATUS
  }
}
