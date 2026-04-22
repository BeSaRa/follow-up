import { inject, Injectable } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { distinctUntilChanged } from 'rxjs'
import { AuthStore } from '@follow-up/core'
import { AppStore } from '../stores/app-store'
import { FollowupService } from '../../features/followup/services/followup.service'
import { UserType } from '../enums/user-type'

@Injectable({ providedIn: 'root' })
export class SessionBootstrapService {
  private readonly authStore = inject(AuthStore)
  private readonly appStore = inject(AppStore)
  private readonly followupService = inject(FollowupService)

  constructor() {
    toObservable(this.authStore.accessToken)
      .pipe(distinctUntilChanged())
      .subscribe((token) => {
        this.followupService.clearInternalUsersCache()
        if (!token) return
        const userType = this.appStore.userType()
        if (userType === UserType.PMO_HEAD || userType === UserType.INTERNAL_USER) {
          this.followupService.loadAssignableUsers().subscribe({ error: () => undefined })
        }
      })
  }
}
