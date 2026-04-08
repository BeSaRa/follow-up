import type { FollowupContract, InfoType } from '@follow-up/contracts'
import { CrudModel } from '@follow-up/core'
import { FollowupService } from '../services/followup.service'

export class Followup extends CrudModel<Followup, FollowupService> implements FollowupContract {
  $$primaryKey = 'id' as const
  $$service = 'FollowupService'

  id = 0
  followUpReference = ''
  documentVSID = ''
  docFullSerial = ''
  docClassInfo: InfoType = { arName: '', enName: '', id: 0 }
  docSubject = ''
  externalEntityInfo: InfoType = { arName: '', enName: '', id: 0 }
  subExternalEntityInfo: InfoType = { arName: '', enName: '', id: 0 }
  securityLevelInfo: InfoType = { arName: '', enName: '', id: 0 }
  siteTypeInfo: InfoType = { arName: '', enName: '', id: 0 }
  priorityLevelInfo: InfoType = { arName: '', enName: '', id: 0 }
  followUpStatusInfo: InfoType = { arName: '', enName: '', id: 0 }
  assignedUserInfo: InfoType = { arName: '', enName: '', id: 0 }
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
