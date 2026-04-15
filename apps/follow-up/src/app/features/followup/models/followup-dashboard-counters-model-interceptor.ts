import { ModelInterceptorContract } from 'cast-response'
import { FollowupDashboardCounters } from './followup-dashboard-counters'

export class FollowupDashboardCountersModelInterceptor
  implements ModelInterceptorContract<FollowupDashboardCounters>
{
  send(model: Partial<FollowupDashboardCounters>): Partial<FollowupDashboardCounters> {
    return model
  }

  receive(model: FollowupDashboardCounters): FollowupDashboardCounters {
    model.outgoingCount = model.outgoingCount ?? 0
    model.incomingCount = model.incomingCount ?? 0
    model.overdueCount = model.overdueCount ?? 0
    model.overDueWithin7DaysCount = model.overDueWithin7DaysCount ?? 0
    model.completedCount = model.completedCount ?? 0
    return model
  }
}
