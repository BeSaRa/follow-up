import { Route } from '@angular/router'

/**
 * Routes available only in development builds. In production this file is
 * swapped for `dev.routes.prod.ts` (an empty array) via `fileReplacements`,
 * so the dynamic `import('@follow-up/ui')` literal — and therefore the entire
 * showcase chunk — is never emitted into the production bundle.
 */
export const devOnlyRoutes: Route[] = [
  {
    path: 'showcase',
    loadChildren: () =>
      import('@follow-up/ui/showcase').then((m) => m.showcaseRoutes),
  },
]
