import {
  inject,
  Injector,
  makeEnvironmentProviders,
  provideAppInitializer,
  runInInjectionContext,
} from '@angular/core'
import { concatMap, from, isObservable, Observable, of, tap } from 'rxjs'

export type SequentialAppInitializer = (
  args?: unknown[],
) => Promise<unknown> | Observable<unknown> | unknown | void

export function provideSequentialAppInitializer(
  ...args: SequentialAppInitializer[]
) {
  const lastValue: unknown[] = []
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const injector = inject(Injector)
      if (args.length === 1) {
        throw new Error(
          'provideSequentialAppInitializer requires at least two Sequential functions or you can use provideAppInitializer directly',
        )
      }
      return from(args).pipe(
        concatMap((callback) => {
          const result = runInInjectionContext(
            injector,
            callback.bind(null, lastValue),
          )
          return (
            isObservable(result)
              ? result
              : result instanceof Promise
                ? from(result)
                : of(result)
          ).pipe(tap((value) => lastValue.push(value)))
        }),
      )
    }),
  ])
}
