import { computed, inject } from '@angular/core'
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs'
import { AuthService, AuthCredentials } from '../services/auth-service'
import { CookieService, CookieOptions } from '../services/cookie-service'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  userName: string | null
  loading: boolean
  error: string
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userName: null,
  loading: false,
  error: '',
}

const COOKIE_ACCESS_TOKEN = 'access_token'
const COOKIE_REFRESH_TOKEN = 'refresh_token'
const COOKIE_USER_NAME = 'user_name'

const cookieOptions: CookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'Strict',
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.accessToken()),
  })),
  withMethods((store, authService = inject(AuthService), cookieService = inject(CookieService)) => ({
    login: rxMethod<AuthCredentials>(
      pipe(
        tap(() => patchState(store, { loading: true, error: '' })),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tap((response) => {
              const { accessToken, refreshToken } = response.result
              patchState(store, {
                accessToken,
                refreshToken,
                userName: credentials.userName,
                loading: false,
              })
              cookieService.set(COOKIE_ACCESS_TOKEN, accessToken, cookieOptions)
              cookieService.set(COOKIE_REFRESH_TOKEN, refreshToken, cookieOptions)
              cookieService.set(COOKIE_USER_NAME, credentials.userName, cookieOptions)
            }),
            catchError(() => {
              patchState(store, { loading: false, error: 'login.error_generic' })
              return EMPTY
            }),
          ),
        ),
      ),
    ),
    logout: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { ...initialState })
          cookieService.delete(COOKIE_ACCESS_TOKEN, '/')
          cookieService.delete(COOKIE_REFRESH_TOKEN, '/')
          cookieService.delete(COOKIE_USER_NAME, '/')
        }),
        switchMap(() =>
          authService.logout().pipe(
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),
    setTokens(tokens: { accessToken: string, refreshToken: string }) {
      patchState(store, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      })
      cookieService.set(COOKIE_ACCESS_TOKEN, tokens.accessToken, cookieOptions)
      cookieService.set(COOKIE_REFRESH_TOKEN, tokens.refreshToken, cookieOptions)
    },
  })),
  withHooks({
    onInit(store, cookieService = inject(CookieService)) {
      const accessToken = cookieService.get(COOKIE_ACCESS_TOKEN) || null
      const refreshToken = cookieService.get(COOKIE_REFRESH_TOKEN) || null
      const userName = cookieService.get(COOKIE_USER_NAME) || null
      if (accessToken) {
        patchState(store, { accessToken, refreshToken, userName })
      }
    },
  }),
)
