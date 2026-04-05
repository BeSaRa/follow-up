import { computed } from '@angular/core'
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals'
import type { AppApplicationUser, LookupList } from '../models/app-auth'

type AppState = {
  applicationUser: AppApplicationUser | null
  lookupList: LookupList | null
}

const initialState: AppState = {
  applicationUser: null,
  lookupList: null,
}

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.applicationUser()),
    userName: computed(() => {
      const user = store.applicationUser()
      return user?.arName || user?.enName || null
    }),
  })),
  withMethods((store) => ({
    setSession(user: AppApplicationUser, lookups: LookupList) {
      patchState(store, { applicationUser: user, lookupList: lookups })
    },
    clearSession() {
      patchState(store, { ...initialState })
    },
  })),
)
