import type { InfoContract } from './model'

export interface FollowupEntryContract {
  id: number
  followupId: number
  userInfo: InfoContract
  externalEntityInfo: InfoContract
  actionTime: string
  attachmentVSID: string
  updatedOn: string
}

export interface FollowupCommentContract extends FollowupEntryContract {
  userComments: string
}
