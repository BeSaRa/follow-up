export * from './lib/services/url-service'
export * from './lib/services/config-service'
export * from './lib/services/auth-service'
export * from './lib/services/cookie-service'
export * from './lib/services/crud-service'
export * from './lib/services/crud-with-dialog-service'
export * from './lib/providers/provide-config-service'
export * from './lib/providers/provide-sequential-app-initializer'
export * from './lib/providers/provide-url-service'
export * from './lib/interceptors/token-interceptor'
export * from './lib/stores/auth-store'

export * from './lib/classes/crud-model'
export * from './lib/classes/service-registry'
export * from './lib/classes/pagination'
export * from './lib/mixins/model-service-mixin'
export * from './lib/mixins/register-service-mixin'
export * from './lib/interfaces/model-has-service'
export * from './lib/interfaces/service-name-contract'
export * from './lib/interfaces/has-form'
export * from './lib/types/constructor'
export * from './lib/directives/crud-page.directive'
export * from './lib/directives/crud-page-with-dialog.directive'
export * from './lib/directives/crud-dialog.directive'
export * from './lib/guards/auth.guard'

console.log('[core] core module loaded — CrudPageDirective added')
console.log('[core] authGuard and guestGuard added')
console.log('[core] ExternalSite feature support added')
console.log('[core] FollowupStatus feature support added')
console.log('[core] PriorityLevel feature support added')
console.log('[core] AuthStore setTokens method added, CrudPageDirective error signal added')
console.log('[core] CrudWithDialogService added — VIEW mode support')
console.log('[core] CrudPageWithDialogDirective added')
console.log('[core] CrudService per-endpoint URL methods added')
console.log('[core] CrudService: moved /entities suffix to getCreateEndpoint/getUpdateEndpoint')
console.log('[core] CrudPageWithDialogDirective: added confirmDelete with confirmation dialog')
console.log('[core] CrudDialogDirective: added base dialog directive with contract')
console.log('[core] types/interfaces moved to @follow-up/contracts')
console.log('[core] AuthStore: logout sends token before clearing state')
console.log('[core] CrudDialogDirective: mode signal with isCreateMode/isUpdateMode/isViewMode computed signals')
