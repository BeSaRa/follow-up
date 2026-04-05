import { computed } from '@angular/core'
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals'
import type { AppApplicationUser, LookupList } from '../models/app-auth'

type AppState = {
  applicationUser: AppApplicationUser | null
  lookupList: LookupList | null
}

const initialState: AppState = {
  applicationUser: null,
  lookupList: null,
}

const STORAGE_KEY = 'app_session'

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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ applicationUser: user, lookupList: lookups }))
      } catch {
        // storage full or unavailable — session works in-memory only
      }
    },
    clearSession() {
      patchState(store, { ...initialState })
      localStorage.removeItem(STORAGE_KEY)
    },
  })),
  withHooks({
    onInit(store) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const { applicationUser, lookupList } = JSON.parse(raw) as AppState
          if (applicationUser) {
            patchState(store, { applicationUser, lookupList })
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },
  }),
)
