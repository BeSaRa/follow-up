import type { FollowupStatementContract } from '@follow-up/contracts'
import { InterceptModel } from 'cast-response'
import { FollowupEntry } from './followup-entry'
import { FollowupEntryModelInterceptor } from './followup-entry-model-interceptor'

@InterceptModel(new FollowupEntryModelInterceptor<FollowupStatement>())
export class FollowupStatement extends FollowupEntry implements FollowupStatementContract {
  userStatement = ''
}
