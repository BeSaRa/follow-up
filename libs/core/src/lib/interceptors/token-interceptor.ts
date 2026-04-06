import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthStore } from '../stores/auth-store'

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('Authorization')) {
    return next(req)
  }

  const authStore = inject(AuthStore)
  const token = authStore.accessToken()

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: token,
      },
    })
    return next(cloned)
  }

  return next(req)
}
