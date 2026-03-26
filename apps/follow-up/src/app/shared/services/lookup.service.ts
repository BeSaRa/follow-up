import { Injectable, inject, signal, computed } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { CastResponse, CastResponseContainer } from 'cast-response'
import { injectUrlService, Pagination } from '@follow-up/core'
import { Endpoints } from '../../constants/endpoints'
import { Lookup } from '../models/lookup'
import type { LookupList } from '../models/app-auth'

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'result.*': () => Lookup,
    },
  },
})
@Injectable({ providedIn: 'root' })
export class LookupService {
  private readonly http = inject(HttpClient)
  private readonly urlService = injectUrlService<Endpoints>()

  readonly models = signal<Lookup[]>([])
  readonly lookupList = signal<LookupList | null>(null)
  readonly lookupMap = computed(() =>
    this.models().reduce((acc, lookup) => {
      if (!acc[lookup.category]) {
        acc[lookup.category] = {}
      }
      acc[lookup.category][lookup.lookupKey] = lookup
      return acc
    }, {} as Record<number, Record<number, Lookup>>),
  )

  setLookupList(list: LookupList) {
    this.lookupList.set(list)
  }

  getAll(options?: Record<string, unknown>): Observable<Pagination<Lookup[]>> {
    return this._getAll(options).pipe(
      tap((res) => this.models.set(res.result)),
    )
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  private _getAll(options?: Record<string, unknown>): Observable<Pagination<Lookup[]>> {
    return this.http.get<Pagination<Lookup[]>>(this.urlService.URLS.LOOKUP, {
      params: new HttpParams({
        fromObject: options as never,
      }),
    })
  }
}
