import { Observable } from 'rxjs'
import { inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { CastResponse, HasInterception, InterceptParam } from 'cast-response'
import { injectUrlService } from '../providers/provide-url-service'

export interface CrudServiceContract<Model, PrimaryKeyType = number> {
  create(model: Model): Observable<Model>
  update(model: Model): Observable<Model>
  delete(id: PrimaryKeyType): Observable<void>
  getById(id: PrimaryKeyType): Observable<Model>
  getAll(options?: Record<string, unknown>): Observable<Model[]>
  getSegmentUrl(): string
}

export abstract class CrudService<
  Model,
  EndPoints extends Record<string, string>,
  PrimaryKeyType,
> implements CrudServiceContract<Model, PrimaryKeyType>
{
  protected readonly http = inject(HttpClient)
  protected readonly urlService = injectUrlService<EndPoints>()
  abstract getSegmentUrl(): string

  @HasInterception
  @CastResponse(undefined, { fallback: '$default' })
  create(@InterceptParam() model: Model): Observable<Model> {
    return this.http.post<Model>(this.getSegmentUrl() + '/entities', model)
  }

  @HasInterception
  @CastResponse(undefined, { fallback: '$default' })
  update(@InterceptParam() model: Model): Observable<Model> {
    return this.http.put<Model>(this.getSegmentUrl() + '/entities', model)
  }

  delete(id: PrimaryKeyType): Observable<void> {
    return this.http.delete<void>(this.getSegmentUrl() + '/' + id)
  }

  @CastResponse(undefined, { fallback: '$default' })
  getById(id: PrimaryKeyType): Observable<Model> {
    return this.http.get<Model>(this.getSegmentUrl() + '/' + id)
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  getAll(options?: Record<string, unknown>): Observable<Model[]> {
    return this.http.get<Model[]>(this.getSegmentUrl(), {
      params: new HttpParams({
        fromObject: options as never,
      }),
    })
  }
}
