import type { FollowupAttachmentContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { Info } from '../../../shared/models/info'
import { FollowupAttachmentModelInterceptor } from './followup-attachment-model-interceptor'

@InterceptModel(new FollowupAttachmentModelInterceptor())
export class FollowupAttachment extends Cloner implements FollowupAttachmentContract {
  docSubject = ''
  vsId = ''
  documentTitle = ''
  priorityLevel = 0
  exportStatus = false
  isAnnotation = false
  isOfficial = false
  isContract = false
  attachmentTypeInfo = new Info()
}
