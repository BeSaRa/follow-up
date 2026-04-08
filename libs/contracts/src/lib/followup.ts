import type { InfoType } from './model'

export interface FollowupContract {
  id: number
  followUpReference: string
  documentVSID: string
  docFullSerial: string
  docClassInfo: InfoType
  docSubject: string
  externalEntityInfo: InfoType
  subExternalEntityInfo: InfoType
  securityLevelInfo: InfoType
  siteTypeInfo: InfoType
  priorityLevelInfo: InfoType
  followUpStatusInfo: InfoType
  assignedUserInfo: InfoType
  status: boolean
  dueDate: string
  receivedDate: string
  creationComments: string
  docCreationDate: string
  attachmentVSIDList: string
  updatedOn: string
  statusDateLastModified: string
  followupEndDate: string
  addedByUser: string
  addedByOU: string
  addedByEntity: string
}
