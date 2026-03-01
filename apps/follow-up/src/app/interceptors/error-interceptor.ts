import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs'
import { AuthStore, AuthService } from '@follow-up/core'
import { ToastService } from '@follow-up/ui'

let isRefreshing = false
const refreshSubject = new BehaviorSubject<string | null>(null)

const SKIP_URLS = ['/auth/login', '/auth/refresh-token']

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (SKIP_URLS.some(url => req.url.includes(url))) {
    return next(req)
  }

  const authStore = inject(AuthStore)
  const authService = inject(AuthService)
  const router = inject(Router)
  const toast = inject(ToastService)
  const translate = inject(TranslateService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401(req, next, authStore, authService, router, toast, translate)
      }

      if (error.status === 403) {
        toast.error(translate.instant('http_errors.forbidden'))
      } else if (error.status === 400) {
        const serverMessage = error.error?.message || error.error?.error
        const message = serverMessage || translate.instant('http_errors.bad_request')
        toast.error(message)
      } else if (error.status >= 500) {
        toast.error(translate.instant('http_errors.server_error'))
      } else if (error.status === 0) {
        toast.error(translate.instant('http_errors.no_connection'))
      }

      return throwError(() => error)
    }),
  )
}

function handle401(
  req: Parameters<HttpInterceptorFn>[0],
  next: Parameters<HttpInterceptorFn>[1],
  authStore: InstanceType<typeof AuthStore>,
  authService: AuthService,
  router: Router,
  toast: ToastService,
  translate: TranslateService,
) {
  if (!isRefreshing) {
    isRefreshing = true
    refreshSubject.next(null)

    const refreshToken = authStore.refreshToken()
    if (!refreshToken) {
      return handleRefreshFailure(authStore, router, toast, translate)
    }

    return authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        isRefreshing = false
        const { accessToken, refreshToken: newRefreshToken } = response.result
        authStore.setTokens({ accessToken, refreshToken: newRefreshToken })
        refreshSubject.next(accessToken)

        return next(req.clone({
          setHeaders: { Authorization: accessToken },
        }))
      }),
      catchError(() => {
        isRefreshing = false
        return handleRefreshFailure(authStore, router, toast, translate)
      }),
    )
  }

  return refreshSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => {
      return next(req.clone({
        setHeaders: { Authorization: token },
      }))
    }),
  )
}

function handleRefreshFailure(
  authStore: InstanceType<typeof AuthStore>,
  router: Router,
  toast: ToastService,
  translate: TranslateService,
) {
  authStore.logout()
  router.navigate(['/login'])
  toast.error(translate.instant('http_errors.session_expired'))
  return throwError(() => new Error('Session expired'))
}
