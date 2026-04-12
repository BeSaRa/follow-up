import type { FollowupLogContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { Info } from '../../../shared/models/info'
import { FollowupLogModelInterceptor } from './followup-log-model-interceptor'

@InterceptModel(new FollowupLogModelInterceptor())
export class FollowupLog extends Cloner implements FollowupLogContract {
  id = 0
  followupId = 0
  userInfo = new Info()
  externalEntityInfo = new Info()
  userComments = ''
  userStatement = ''
  actionTime = ''
  actionTypeInfo = new Info()
  oldFollowupStatusInfo = new Info()
  newFollowupStatusInfo = new Info()
  newUserAssignedUserInfo = new Info()
  oldAssignedUserInfo = new Info()
  oldDueDate = ''
  newOldDueDate = ''
  attachmentVSID = ''
  updatedOn = ''
  attachmentTitle = ''
  attachmentTypeInfo = new Info()
}
