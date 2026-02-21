import { computed, inject } from '@angular/core'
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs'
import { AuthService, AuthCredentials } from '../services/auth-service'

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

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.accessToken()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<AuthCredentials>(
      pipe(
        tap(() => patchState(store, { loading: true, error: '' })),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tap((response) => {
              patchState(store, {
                accessToken: response.result.accessToken,
                refreshToken: response.result.refreshToken,
                userName: credentials.userName,
                loading: false,
              })
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
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          authService.logout().pipe(
            tap(() => {
              patchState(store, { ...initialState })
            }),
            catchError(() => {
              patchState(store, { ...initialState })
              return EMPTY
            }),
          ),
        ),
      ),
    ),
  })),
)
