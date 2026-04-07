import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthStore } from '../stores/auth-store'

export const authGuard: CanActivateFn = () => {
  const store = inject(AuthStore)
  const router = inject(Router)

  if (store.isAuthenticated()) {
    return true
  }

  return router.createUrlTree(['/login'], {
    queryParams: { reason: 'unauthenticated' },
  })
}

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore)
  const router = inject(Router)

  if (!store.isAuthenticated()) {
    return true
  }

  return router.createUrlTree(['/followup'])
}
