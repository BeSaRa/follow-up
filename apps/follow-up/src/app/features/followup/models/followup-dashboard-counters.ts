import { Cloner } from '@follow-up/util'
import { InterceptModel } from 'cast-response'
import { FollowupDashboardCountersModelInterceptor } from './followup-dashboard-counters-model-interceptor'

@InterceptModel(new FollowupDashboardCountersModelInterceptor())
export class FollowupDashboardCounters extends Cloner {
  outgoingCount = 0
  incomingCount = 0
  overdueCount = 0
  overDueWithin7DaysCount = 0
  completedCount = 0
}
