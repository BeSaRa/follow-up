import { Observable } from 'rxjs'
import { inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { CastResponse, HasInterception, InterceptParam } from 'cast-response'
import { injectUrlService } from '../providers/provide-url-service'
import { Pagination } from '../classes/pagination'

export interface CrudServiceContract<Model, PrimaryKeyType = number> {
  create(model: Model): Observable<Model>
  update(model: Model): Observable<Model>
  delete(id: PrimaryKeyType): Observable<void>
  getById(id: PrimaryKeyType): Observable<Model>
  getAll(options?: Record<string, unknown>): Observable<Pagination<Model[]>>
  getSegmentUrl(): string
  getCreateEndpoint(): string
  getUpdateEndpoint(): string
  getDeleteEndpoint(): string
  getGetByIdEndpoint(): string
  getGetAllEndpoint(): string
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

  getCreateEndpoint(): string {
    return this.getSegmentUrl()
  }

  getUpdateEndpoint(): string {
    return this.getSegmentUrl()
  }

  getDeleteEndpoint(): string {
    return this.getSegmentUrl()
  }

  getGetByIdEndpoint(): string {
    return this.getSegmentUrl()
  }

  getGetAllEndpoint(): string {
    return this.getSegmentUrl()
  }

  @HasInterception
  @CastResponse(undefined, { fallback: '$default' })
  create(@InterceptParam() model: Model): Observable<Model> {
    return this.http.post<Model>(this.getCreateEndpoint() + '/entities', model)
  }

  @HasInterception
  @CastResponse(undefined, { fallback: '$default' })
  update(@InterceptParam() model: Model): Observable<Model> {
    return this.http.put<Model>(this.getUpdateEndpoint() + '/entities', model)
  }

  delete(id: PrimaryKeyType): Observable<void> {
    return this.http.delete<void>(this.getDeleteEndpoint() + '/' + id)
  }

  @CastResponse(undefined, { fallback: '$default' })
  getById(id: PrimaryKeyType): Observable<Model> {
    return this.http.get<Model>(this.getGetByIdEndpoint() + '/' + id)
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  getAll(options?: Record<string, unknown>): Observable<Pagination<Model[]>> {
    return this.http.get<Pagination<Model[]>>(this.getGetAllEndpoint(), {
      params: new HttpParams({
        fromObject: options as never,
      }),
    })
  }
}
