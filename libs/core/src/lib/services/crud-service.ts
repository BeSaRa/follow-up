import { Observable } from 'rxjs'
import { inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { injectUrlService } from '../providers/provide-url-service'

export interface CrudContract<Model, PrimaryKeyType = number> {
  create(model: Model): Observable<Model>
  update(model: Model): Observable<Model>
  delete(id: PrimaryKeyType): Observable<void>
  getById(id: PrimaryKeyType): Observable<Model>
  getAll(options?: { params?: HttpParams }): Observable<Model[]>
  getSegmentUrl(): string
}

export abstract class CrudService<
  Model,
  PrimaryKeyType,
  EndPoints extends Record<string, string>,
> implements CrudContract<Model, PrimaryKeyType>
{
  protected readonly http = inject(HttpClient)
  protected UrlService = injectUrlService<EndPoints>()
  abstract getSegmentUrl(): string

  create(model: Model): Observable<Model> {
    return this.http.post<Model>(this.getSegmentUrl(), model)
  }
  update(model: Model): Observable<Model> {
    return this.http.put<Model>(this.getSegmentUrl(), model)
  }
  delete(id: PrimaryKeyType): Observable<void> {
    return this.http.delete<void>(this.getSegmentUrl() + '/' + id)
  }
  getById(id: PrimaryKeyType): Observable<Model> {
    return this.http.get<Model>(this.getSegmentUrl() + '/' + id)
  }
  getAll(options?: { params?: HttpParams }): Observable<Model[]> {
    return this.http.get<Model[]>(this.getSegmentUrl(), {
      params: options?.params,
    })
  }
}
