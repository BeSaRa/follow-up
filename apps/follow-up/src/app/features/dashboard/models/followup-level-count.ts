import { Cloner, LangNameMixin } from '@follow-up/util'

export class FollowupLevelCount extends LangNameMixin(Cloner) {
  priorityLevel = 0
  securityLevel = 0
  followupCount = 0
  override arName = ''
  override enName = ''
}
