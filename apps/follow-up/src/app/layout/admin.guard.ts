import { inject } from '@angular/core'
import { Router, type CanActivateFn } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ToastService } from '@follow-up/ui'
import { AppStore } from '../shared/stores/app-store'
import { UserType } from '../shared/enums/user-type'

export const adminGuard: CanActivateFn = () => {
  const appStore = inject(AppStore)
  const router = inject(Router)
  const toast = inject(ToastService)
  const translate = inject(TranslateService)
  if (appStore.userType() === UserType.SYSTEM_ADMIN) return true
  toast.error(translate.instant('errors.no_page_access'))
  return router.parseUrl('/followup')
}

export const nonAdminGuard: CanActivateFn = () => {
  const appStore = inject(AppStore)
  const router = inject(Router)
  const toast = inject(ToastService)
  const translate = inject(TranslateService)
  if (appStore.userType() !== UserType.SYSTEM_ADMIN) return true
  toast.error(translate.instant('errors.no_page_access'))
  return router.parseUrl('/admin')
}

export const notificationsGuard: CanActivateFn = () => {
  const appStore = inject(AppStore)
  const router = inject(Router)
  const toast = inject(ToastService)
  const translate = inject(TranslateService)
  const allowed = [
    UserType.INTERNAL_USER,
    UserType.EXTERNAL_USER,
    UserType.PMO_HEAD,
  ]
  if (allowed.includes(appStore.userType())) return true
  toast.error(translate.instant('errors.no_page_access'))
  return router.parseUrl('/')
}
