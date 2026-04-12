import type { InfoContract } from './model'

export interface FollowupLogContract {
  id: number
  followupId: number
  userInfo: InfoContract
  externalEntityInfo: InfoContract
  userComments: string
  userStatement: string
  actionTime: string
  actionTypeInfo: InfoContract
  oldFollowupStatusInfo: InfoContract
  newFollowupStatusInfo: InfoContract
  newUserAssignedUserInfo: InfoContract
  oldAssignedUserInfo: InfoContract
  oldDueDate: string
  newOldDueDate: string
  attachmentVSID: string
  updatedOn: string
  attachmentTitle: string
  attachmentTypeInfo: InfoContract
}
