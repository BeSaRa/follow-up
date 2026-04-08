import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { AppStore } from '../shared/stores/app-store'
import { UserType } from '../shared/enums/user-type'

export const defaultRedirectGuard: CanActivateFn = () => {
  const appStore = inject(AppStore)
  const router = inject(Router)
  const route = appStore.userType() === UserType.SYSTEM_ADMIN ? '/admin' : '/followup'
  return router.parseUrl(route)
}
