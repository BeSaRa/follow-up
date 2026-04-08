import type { FollowupContract } from '@follow-up/contracts'
import { CrudModel } from '@follow-up/core'
import { InterceptModel } from 'cast-response'
import { FollowupService } from '../services/followup.service'
import { FollowupModelInterceptor } from './followup-model-interceptor'
import { Info } from '../../../shared/models/info'

@InterceptModel(new FollowupModelInterceptor())
export class Followup extends CrudModel<Followup, FollowupService> implements FollowupContract {
  $$primaryKey = 'id' as const
  $$service = 'FollowupService'

  id = 0
  followUpReference = ''
  documentVSID = ''
  docFullSerial = ''
  docClassInfo = new Info()
  docSubject = ''
  externalEntityInfo = new Info()
  subExternalEntityInfo = new Info()
  securityLevelInfo = new Info()
  siteTypeInfo = new Info()
  priorityLevelInfo = new Info()
  followUpStatusInfo = new Info()
  assignedUserInfo = new Info()
  status = true
  dueDate = ''
  receivedDate = ''
  creationComments = ''
  docCreationDate = ''
  attachmentVSIDList = ''
  updatedOn = ''
  statusDateLastModified = ''
  followupEndDate = ''
  addedByUser = ''
  addedByOU = ''
  addedByEntity = ''
}
