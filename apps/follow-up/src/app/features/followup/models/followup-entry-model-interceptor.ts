import { ModelInterceptorContract } from 'cast-response'
import { FollowupEntry } from './followup-entry'
import { Info } from '../../../shared/models/info'

export class FollowupEntryModelInterceptor<T extends FollowupEntry> implements ModelInterceptorContract<T> {
  send(model: Partial<T>): Partial<T> {
    return model
  }

  receive(model: T): T {
    model.userInfo = new Info().clone(model.userInfo)
    model.externalEntityInfo = new Info().clone(model.externalEntityInfo)
    return model
  }
}
