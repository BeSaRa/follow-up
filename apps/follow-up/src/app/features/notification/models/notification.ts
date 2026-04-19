import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { Info } from '../../../shared/models/info'
import { NotificationModelInterceptor } from './notification-model-interceptor'

@InterceptModel(new NotificationModelInterceptor())
export class Notification extends Cloner {
  id = 0
  followupSubject = ''
  followupActionInfo = new Info()
  docClassInfo = new Info()
  actionToUserInfo = new Info()
  actionDescription = ''
  isRead = false
  actionTime = ''
  updatedOn = ''
  followupLogId = 0
  followupId = 0
  userComments = ''
}
