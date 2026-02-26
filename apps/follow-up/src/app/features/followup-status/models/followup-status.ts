import { CrudModel } from '@follow-up/core'
import { FollowupStatusService } from '../services/followup-status.service'

export class FollowupStatus extends CrudModel<FollowupStatus, FollowupStatusService> {
  $$primaryKey = 'id' as const
  $$service = 'FollowupStatusService'

  id = 0
  category = 0
  arName = ''
  enName = ''
  lookupKey = 0
  lookupStrKey = ''
  status = true
  itemOrder = 0
}
