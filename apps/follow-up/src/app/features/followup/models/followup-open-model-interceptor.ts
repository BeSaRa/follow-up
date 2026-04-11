import { ModelInterceptorContract } from 'cast-response'
import { FollowupOpen } from './followup-open'

export class FollowupOpenModelInterceptor implements ModelInterceptorContract<FollowupOpen> {
  send(model: Partial<FollowupOpen>): Partial<FollowupOpen> {
    return model
  }

  receive(model: FollowupOpen): FollowupOpen {
    return model
  }
}
