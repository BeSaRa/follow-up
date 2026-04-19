import { ModelInterceptorContract } from 'cast-response'
import { Notification } from './notification'
import { Info } from '../../../shared/models/info'

export class NotificationModelInterceptor implements ModelInterceptorContract<Notification> {
  send(model: Partial<Notification>): Partial<Notification> {
    return model
  }

  receive(model: Notification): Notification {
    model.followupActionInfo = new Info().clone(model.followupActionInfo)
    model.docClassInfo = new Info().clone(model.docClassInfo)
    model.actionToUserInfo = new Info().clone(model.actionToUserInfo)
    return model
  }
}
