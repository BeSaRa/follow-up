import { ModelInterceptorContract } from 'cast-response'
import { FollowupAttachment } from './followup-attachment'
import { Info } from '../../../shared/models/info'

export class FollowupAttachmentModelInterceptor implements ModelInterceptorContract<FollowupAttachment> {
  send(model: Partial<FollowupAttachment>): Partial<FollowupAttachment> {
    return model
  }

  receive(model: FollowupAttachment): FollowupAttachment {
    model.attachmentTypeInfo = new Info().clone(model.attachmentTypeInfo)
    return model
  }
}
