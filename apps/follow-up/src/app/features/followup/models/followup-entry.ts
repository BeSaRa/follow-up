import type { FollowupEntryContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { Info } from '../../../shared/models/info'

export abstract class FollowupEntry extends Cloner implements FollowupEntryContract {
  id = 0
  followupId = 0
  userInfo = new Info()
  externalEntityInfo = new Info()
  actionTime = ''
  attachmentVSID = ''
  updatedOn = ''
}
