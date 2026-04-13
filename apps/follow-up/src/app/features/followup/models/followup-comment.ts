import type { FollowupCommentContract } from '@follow-up/contracts'
import { InterceptModel } from 'cast-response'
import { FollowupEntry } from './followup-entry'
import { FollowupEntryModelInterceptor } from './followup-entry-model-interceptor'

@InterceptModel(new FollowupEntryModelInterceptor<FollowupComment>())
export class FollowupComment extends FollowupEntry implements FollowupCommentContract {
  userComments = ''
}
