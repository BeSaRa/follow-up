import { ModelInterceptorContract } from 'cast-response'
import { FollowupLog } from './followup-log'
import { Info } from '../../../shared/models/info'

export class FollowupLogModelInterceptor implements ModelInterceptorContract<FollowupLog> {
  send(model: Partial<FollowupLog>): Partial<FollowupLog> {
    return model
  }

  receive(model: FollowupLog): FollowupLog {
    model.userInfo = new Info().clone(model.userInfo)
    model.externalEntityInfo = new Info().clone(model.externalEntityInfo)
    model.actionTypeInfo = new Info().clone(model.actionTypeInfo)
    model.oldFollowupStatusInfo = new Info().clone(model.oldFollowupStatusInfo)
    model.newFollowupStatusInfo = new Info().clone(model.newFollowupStatusInfo)
    model.oldAssignedUserInfo = new Info().clone(model.oldAssignedUserInfo)
    model.newUserAssignedUserInfo = new Info().clone(model.newUserAssignedUserInfo)
    model.attachmentTypeInfo = new Info().clone(model.attachmentTypeInfo)
    return model
  }
}
