import type { FollowupOpenContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { FollowupAttachment } from './followup-attachment'
import { FollowupMetaData } from './followup-meta-data'
import { FollowupOpenModelInterceptor } from './followup-open-model-interceptor'

@InterceptModel(new FollowupOpenModelInterceptor())
export class FollowupOpen extends Cloner implements FollowupOpenContract {
  content = ''
  linkedAttachments: FollowupAttachment[] = []
  followupAttachments: FollowupAttachment[] = []
  guidanceAttachments: FollowupAttachment[] = []
  metaData = new FollowupMetaData()
  sitesCount = 0
}
