import type { InfoContract } from './model'

export interface FollowupContract {
  id: number
  followUpReference: string
  documentVSID: string
  docFullSerial: string
  docClassInfo: InfoContract
  docSubject: string
  externalEntityInfo: InfoContract
  subExternalEntityInfo: InfoContract
  securityLevelInfo: InfoContract
  siteTypeInfo: InfoContract
  priorityLevelInfo: InfoContract
  followUpStatusInfo: InfoContract
  assignedUserInfo: InfoContract
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
