import { Injectable, Type } from '@angular/core'
import {
  CrudWithDialogService,
  Pagination,
  RegisterServiceMixin,
} from '@follow-up/core'
import { FollowupStatus } from '../models/followup-status'
import { FollowupStatusDialog } from '../components/followup-status-dialog'
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
export class FollowupStatusService extends RegisterServiceMixin(
  CrudWithDialogService,
)<FollowupStatus, FollowupStatusDialog, Endpoints, number> {
  $$serviceName = 'FollowupStatusService'

  getSegmentUrl(): string {
    return this.urlService.URLS.FOLLOWUP_STATUS
  }

  getDialogComponent(): Type<FollowupStatusDialog> {
    return FollowupStatusDialog
  }

  getModelInstance(): FollowupStatus {
    return new FollowupStatus()
  }
}
