import type { FollowupAttachmentContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { Info } from '../../../shared/models/info'

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
