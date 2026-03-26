import type { Observable } from 'rxjs'

export interface Paginated<T> {
  statusCode: string
  result: T
  totalElements: number
  totalPages: number
  numberOfElements: number
}

export interface CrudServiceContract<Model, PrimaryKeyType = number> {
  create(model: Model): Observable<Model>
  update(model: Model): Observable<Model>
  delete(id: PrimaryKeyType): Observable<void>
  getById(id: PrimaryKeyType): Observable<Model>
  getAll(options?: Record<string, unknown>): Observable<Paginated<Model[]>>
  getSegmentUrl(): string
  getCreateEndpoint(): string
  getUpdateEndpoint(): string
  getDeleteEndpoint(): string
  getGetByIdEndpoint(): string
  getGetAllEndpoint(): string
}
