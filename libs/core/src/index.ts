export * from './lib/services/url-service'
export * from './lib/services/config-service'
export * from './lib/services/auth-service'
export * from './lib/services/cookie-service'
export * from './lib/services/crud-service'
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
export * from './lib/types/constructor'
export * from './lib/directives/crud-page.directive'

console.log('[core] core module loaded — CrudPageDirective added')
console.log('[core] ExternalSite feature support added')
console.log('[core] FollowupStatus feature support added')
console.log('[core] PriorityLevel feature support added')
console.log('[core] AuthStore setTokens method added, CrudPageDirective error signal added')
