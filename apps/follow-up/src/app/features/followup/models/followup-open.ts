import type { FollowupOpenContract } from '@follow-up/contracts'
import { Cloner } from '@follow-up/util'
import { FollowupAttachment } from './followup-attachment'
import { FollowupMetaData } from './followup-meta-data'

export class FollowupOpen extends Cloner implements FollowupOpenContract {
  content: string[] = []
  linkedAttachments: FollowupAttachment[] = []
  followupAttachments: FollowupAttachment[] = []
  guidanceAttachments: FollowupAttachment[] = []
  metaData = new FollowupMetaData()
  sitesCount = 0
}
