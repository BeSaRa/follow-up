import { computed } from '@angular/core'
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals'
import type { Permission } from '../models/permission'
import type { AppApplicationUser, LookupList } from '../models/app-auth'

type AppState = {
  applicationUser: AppApplicationUser | null
  lookupList: LookupList | null
  permissionSet: Permission[]
}

const initialState: AppState = {
  applicationUser: null,
  lookupList: null,
  permissionSet: [],
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
    permissionMap: computed(() =>
      store.permissionSet().reduce((map, p) => {
        map[p.permissionKey] = true
        return map
      }, {} as Record<string, true>),
    ),
  })),
  withMethods((store) => ({
    setSession(user: AppApplicationUser, lookups: LookupList, permissions: Permission[]) {
      patchState(store, { applicationUser: user, lookupList: lookups, permissionSet: permissions })
    },
    clearSession() {
      patchState(store, { ...initialState })
    },
    hasPermission(key: string): boolean {
      return !!store.permissionMap()[key]
    },
    hasAnyPermission(keys: string[]): boolean {
      const map = store.permissionMap()
      return keys.some((key) => !!map[key])
    },
    hasAllPermissions(keys: string[]): boolean {
      const map = store.permissionMap()
      return keys.every((key) => !!map[key])
    },
  })),
)
