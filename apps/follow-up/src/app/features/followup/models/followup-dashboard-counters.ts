import { Cloner } from '@follow-up/util'

export class FollowupDashboardCounters extends Cloner {
  outgoingCount = 0
  incomingCount = 0
  overdueCount = 0
  overDueWithin7DaysCount = 0
  completedCount = 0
}
